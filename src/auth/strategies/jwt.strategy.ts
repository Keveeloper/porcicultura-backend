import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: secret, // Obtiene el secreto del archivo .env
    });
  }

  /**
   * Este método se ejecuta si el token es válido.
   * Lo que retorne aquí se inyectará automáticamente en `request.user`
   */
  validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
