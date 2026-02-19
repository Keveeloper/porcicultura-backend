import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header "Authorization: Bearer <token>"
      ]),
      ignoreExpiration: false,
      secretOrKey: secret, // Obtiene el secreto del archivo .env
    });
  }

  /**
   * Método estático personalizado para extraer el token de la cookie
   */
  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && 'accessToken' in req.cookies) {
      return req.cookies.accessToken;
    }
    return null;
  }

  /**
   * Este método se ejecuta si el token es válido.
   * Lo que retorne aquí se inyectará automáticamente en `request.user`
   */
  validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
