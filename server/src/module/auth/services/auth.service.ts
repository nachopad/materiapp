import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
} from '@/core/config';
import { User } from '@/module/user/schemas';
import { UserService } from '@/module/user/services';
import { AuthUser, JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (await this.userService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: User) {
    const user: any = await this.userService.findUserByEmail(loginDto.email);
    const payload = { email: user.email, sub: user._id.toString(), roles: user.roles };
    return this.generateTokens(payload);
  }

  generateTokens(payload: JwtPayload) {
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_EXPIRES_IN / 1000,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: JWT_REFRESH_SECRET,
      });

      return this.generateTokens({ email: payload.email, sub: payload.sub, roles: payload.roles });
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to refresh token. The refresh token may be invalid or expired.',
      );
    }
  }

  async verifyTokenAndResolveUser(accessToken: string): Promise<User | null> {
    const payload: JwtPayload = this.jwtService.verify(accessToken, {
      secret: JWT_ACCESS_SECRET,
    });
    if (!payload) throw new UnauthorizedException('Invalid Token.');
    return await this.userService.findUserByEmail(payload.email);
  }

  googleLogin(user: AuthUser) {
    const tokens = this.generateTokens({
      email: user.email,
      sub: user._id,
      roles: user.roles,
    });
    return tokens;
  }
}
