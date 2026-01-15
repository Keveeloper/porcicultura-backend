import { Controller, Post, Headers, UseInterceptors, ClassSerializerInterceptor, UnauthorizedException, Inject, Res } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  /**
   * Description:         Endpoint para manejar el inicio de sesión con Google/Firebase.
   *                      Recibe el Token de ID de Firebase en el encabezado Authorization.
   * Note:                Este controlador verifica el token de Firebase,
   *                      encuentra/crea el usuario en Postgres, y devolvería un JWT propio de NestJS.
   */
  @Post('google/login')
  async googleLogin(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) response: Response
  ) {
    //Modify porcicultura software
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización no proporcionado o formato inválido.');
    }

    const firebaseIdToken = authHeader.split(' ')[1];     

    try {
      // 2. Verificar el Token de ID de Firebase
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(firebaseIdToken);            
      const { uid, email, name, picture } = decodedToken;      
      
      const [firstName, lastName] = name ? name.split(' ') : ['Usuario', 'Google'];

      const userResponse = await this.usersService.findOrCreate({
        uid,
        email: email || '',
        password: '',
        profile: {
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: picture,
        },
      });      

      const payload = {
        sub: userResponse.id,
        email: userResponse.email
      };      

      const nestJsToken = this.jwtService.sign(payload);

      response.cookie('accessToken', nestJsToken, {
        httpOnly: true,    // Prevents JS access (XSS protection)
        secure: false,     // Set to true in production with HTTPS
        sameSite: 'lax',   // Helps against CSRF
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
      });

      return {
        userResponse,
        // accessToken: nestJsToken,
      };

    } catch (error) {
      // Los errores de token inválido o expirado se capturan aquí
      const errorMessage = error.code === 'auth/argument-error' ?
        'Token de Firebase mal formado o ausente.' :
        'Token de Firebase inválido o expirado.';

      throw new UnauthorizedException(errorMessage);
    }
  }
}
