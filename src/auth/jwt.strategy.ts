import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { cleanEnv } from '../config/env.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cleanEnv(
        config.get<string>('JWT_SECRET'),
        'JWT_SECRET',
      ),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}