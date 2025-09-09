import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/module/user/schemas';
import { UserService } from 'src/module/user/services';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
} from 'src/core/config';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (await this.userService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: User) {
    const user: any = await this.userService.findUserByEmail(loginDto.email);
    const payload = { email: user.email, sub: user._id.toString() };
    return this.generateTokens(payload);
  }

  generateTokens(payload: JwtPayload) {
    const access_token = this.jwtService.sign(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: JWT_ACCESS_EXPIRES_IN / 1000,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_EXPIRES_IN / 1000,
    });
    return {
      access_token,
      refresh_token,
    };
  }
}
