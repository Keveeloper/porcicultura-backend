// auth.service.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async validateFirebaseUser(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización no proporcionado o formato inválido.');
    }

    const firebaseIdToken = authHeader.split(' ')[1];

    try {
      // 1. Verificar token con Firebase
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(firebaseIdToken);
      const { uid, email, name, picture } = decodedToken;

      const [firstName, lastName] = name ? name.split(' ') : ['Usuario', 'Google'];

      // 2. Sincronizar con nuestra DB
      const user = await this.usersService.findOrCreate({
        uid,
        email: email || '',
        password: '',
        profile: {
          firstName: firstName || '',
          lastName: lastName || '',
          avatar: picture,
        },
      });

      // 3. Generar el payload para nuestro JWT interno
      const payload = { sub: user.id, email: user.email };
      return {
        user,
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      const errorMessage = error.code === 'auth/argument-error' ?
        'Token de Firebase mal formado o ausente.' :
        'Token de Firebase inválido o expirado.';

      throw new UnauthorizedException(errorMessage);
    }
  }
}
