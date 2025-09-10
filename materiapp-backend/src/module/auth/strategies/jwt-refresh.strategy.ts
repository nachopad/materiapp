import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { JWT_REFRESH_SECRET } from 'src/core/config';
import { REFRESH_TOKEN_COOKIE } from 'src/module/common/constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: false,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.cookies[REFRESH_TOKEN_COOKIE];
          if (!token) throw new UnauthorizedException('Not refresh token');
          return token;
        },
      ]),
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
