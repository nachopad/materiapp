import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import type { Response } from 'express';
import { UserService } from 'src/module/user/services';
import { AuthService } from '../services/auth.service';
import {
  GoogleOAuthGuard,
  JwtAccessAuthGuard,
  LocalAuthGuard,
} from '../guards';

import { LoginDto } from '../dtos/login.dto';
import { setCookie } from 'src/shared/utils/set-cookie.util';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from 'src/module/common/constants';
import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from 'src/core/config';
import { CreateUserDto, UserResponseDTO } from 'src/module/user/dtos';
import { plainToInstance } from 'class-transformer';
import { Cookies } from 'src/module/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Allows a new user to sign up for the application',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return {
        message: 'User registered successfully. You can now log in.',
      };
    } catch (error: any) {
      if (error.code === 11000 && error.keyValue.email) {
        throw new BadRequestException(
          `Email "${error.keyValue.email}" is already registered.`,
        );
      }

      throw new BadRequestException(
        'Failed to register user. Please check the data and try again.',
      );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Log In',
    description: 'Allows a user to log out of the application',
  })
  @ApiBody({ type: LoginDto })
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
      maxAge: JWT_ACCESS_EXPIRES_IN,
    });

    setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
      maxAge: JWT_REFRESH_EXPIRES_IN,
    });

    return {
      message: 'Login successful.',
      user: plainToInstance(UserResponseDTO, req.user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Allows a user to log out of the application',
  })
  async logout(
    @Cookies(ACCESS_TOKEN_COOKIE) accessToken: string,
    @Cookies(REFRESH_TOKEN_COOKIE) refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (accessToken) response.clearCookie(ACCESS_TOKEN_COOKIE);
    if (refreshToken) response.clearCookie(REFRESH_TOKEN_COOKIE);

    return {
      message: 'You have been logged out successfully.',
    };
  }

  @Get('google')
  @ApiOperation({
    summary: 'Sign in with Google',
    description:
      'Redirects the user to Google OAuth2 login page. No request body or response is returned.',
  })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth2' })
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() request) {}

  @Get('google-redirect')
  @ApiOperation({
    summary: 'Google Redirect',
    description: 'Handles Google redirection after authentication',
  })
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Req() request,
    @Res({ passthrough: true }) response: Response,
  ) {
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
      message: 'Google authentication successful.',
    };
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get information from the authenticated user',
    description: 'Returns the authenticated users information',
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiResponse({ status: 200, type: UserResponseDTO })
  async getAuthUser(
    @Cookies(ACCESS_TOKEN_COOKIE) accessToken: string,
  ): Promise<UserResponseDTO> {
    try {
      const user =
        await this.authService.verifyTokenAndResolveUser(accessToken);

      return plainToInstance(UserResponseDTO, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      return error;
    }
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Tokens',
    description: 'Allows a user to refresh their access token',
  })
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Cookies(REFRESH_TOKEN_COOKIE) refreshToken: string,
  ) {
    try {
      const { access_token, refresh_token } =
        this.authService.refreshToken(refreshToken);

      setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
        maxAge: JWT_ACCESS_EXPIRES_IN,
      });
      setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
        maxAge: JWT_REFRESH_EXPIRES_IN,
      });

      return {
        message: 'Access and refresh tokens have been refreshed successfully.',
      };
    } catch (error) {
      return {
        message:
          'Failed to refresh token. Refresh token may be invalid or expired.',
      };
    }
  }
}
