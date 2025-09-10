import { Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import type { Request, Response } from 'express';
import { UserService } from 'src/module/user/services';
import { AuthService } from '../services/auth.service';
import { GoogleOAuthGuard, JwtAccessAuthGuard, LocalAuthGuard } from '../guards';

import { LoginDto } from '../dtos/login.dto';
import { setCookie } from 'src/shared/utils/set-cookie.util';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from 'src/module/common/constants';
import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from 'src/core/config';
import { UserResponseDTO } from 'src/module/user/dtos';
import { plainToInstance } from 'class-transformer';
import { Cookies } from 'src/module/common/decorators';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Log out',
    description: 'Allows a user to log out of the application',
  })
  @ApiBody({ type: LoginDto })
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
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

  
  @Get('google')
  @ApiOperation({
    summary: 'Sign in with Google',
    description: 'Allows a user to log in to the app using their Google account.'
  })
  @ApiResponse({ status: 302, description: 'Redirección a Google OAuth2' })
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() request) { }

  
  @Get('google-redirect')
  @ApiOperation({
    summary: 'Google Redirect',
    description: 'Handles Google redirection after authentication'
  })
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() request, @Res({ passthrough: true }) response: Response) {
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const { access_token, refresh_token } = this.authService.googleLogin(user);

    setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
      maxAge: JWT_ACCESS_EXPIRES_IN,
    });

    setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
      maxAge: JWT_REFRESH_EXPIRES_IN,
    });
    return {
      message: 'Google login successful',
    };
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get information from the authenticated user',
    description: 'Returns the authenticated users information'
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiResponse({ status: 200, type: UserResponseDTO })
  async getAuthUser(@Cookies(ACCESS_TOKEN_COOKIE) accessToken: string): Promise<UserResponseDTO> {
    try {
      const user = this.authService.verifyTokenAndResolveUser(accessToken);
      return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
    } catch (error) {
      return error;
    }
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Allows a user to refresh their access token'
  })
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Cookies(REFRESH_TOKEN_COOKIE) refreshToken: string
  ) {
    const { access_token, refresh_token } = this.authService.refreshToken(refreshToken);
    setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
      maxAge: JWT_ACCESS_EXPIRES_IN,
    });
    setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
      maxAge: JWT_REFRESH_EXPIRES_IN,
    });
    return {
      message: 'Token refreshed successfully',
    };


  }
}
