import { Controller, Post, Headers, UseInterceptors, ClassSerializerInterceptor, Res, Get, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  /**
   * @Description: Endpoint para obtener los datos del usuario autenticado.
   * @param user
   * @returns
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User){
    return await this.userService.getUserById(user.id);
  }

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

    const { user, token } = await this.authService.validateFirebaseUser(authHeader);

    response.cookie('accessToken', token, {
      httpOnly: true,    // Prevents JS access (XSS protection)
      secure: false,     // Set to true in production with HTTPS
      sameSite: 'lax',   // Helps against CSRF
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
    });

    return user;

  }

  /**
   * @Description: Endpoint para cerrar sesión del usuario.
   * @param response
   */
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }

}
