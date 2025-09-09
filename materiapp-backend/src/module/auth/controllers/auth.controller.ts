import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import type { Response } from 'express';
import { UserService } from 'src/module/user/services';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../dtos/login.dto';
import { setCookie } from 'src/shared/utils/set-cookie.util';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from 'src/module/common/constants';
import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from 'src/core/config';
import { UserResponseDTO } from 'src/module/user/dtos';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Log out',
    description: 'Allows a user to log out of the application',
  })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token, refresh_token } = await this.authService.login(req.user);

    setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
      maxAge: JWT_ACCESS_EXPIRES_IN,
    });

    setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
      maxAge: JWT_REFRESH_EXPIRES_IN,
    });

    return plainToInstance(UserResponseDTO, req.user, {
      excludeExtraneousValues: true,
    });
  }
}
