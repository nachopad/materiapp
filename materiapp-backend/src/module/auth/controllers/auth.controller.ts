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

import { UserService } from '@/module/user/services';
import {
  GoogleOAuthGuard,
  JwtAccessAuthGuard,
  LocalAuthGuard,
} from '../guards';
import { AuthService } from '../services/auth.service';

import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '@/core/config';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/module/common/constants';
import { ApiStandardResponse, ApiVersionHeader, Cookies } from '@/module/common/decorators';
import { CreateUserDto, UserResponseDTO } from '@/module/user/dtos';
import { setCookie } from '@/shared/utils';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dtos/login.dto';

@ApiVersionHeader('1')
@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }

  @Post('register')
  @ApiStandardResponse({
    summary: 'Register a new user',
    description: 'Allows a new user to sign up for the application',
    status: 201,
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
  @ApiStandardResponse({
    summary: 'Log In',
    description: 'Allows a user to log out of the application',
    status: 201,
    type: UserResponseDTO,
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

    return plainToInstance(UserResponseDTO, req.user, {
      excludeExtraneousValues: true,
    });
  }

  @Post('logout')
  @ApiStandardResponse({
    summary: 'Logout',
    description: 'Allows a user to log out of the application',
    status: 201,
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
  async googleAuth(@Req() request) { }

  @Get('google-redirect')
  @ApiStandardResponse({
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
  @ApiStandardResponse({
    summary: 'Get information from the authenticated user',
    description: 'Returns the authenticated users information',
    type: UserResponseDTO,
  })
  @UseGuards(JwtAccessAuthGuard)
  // @ApiResponse({ status: 200, type: UserResponseDTO })
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
  @ApiStandardResponse({
    summary: 'Refresh Tokens',
    description: 'Allows a user to refresh their access token',
    status: 201,
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
      throw error;
    }
  }
}
