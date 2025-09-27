import { ApiStandardResponse, ApiVersionHeader } from '@/module/common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UpdateUserDto, UserResponseDTO } from '../dtos';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { EmailValidationPipe } from '../pipes';
import { UserService } from '../services';
import { Auth } from '@/module/auth/decorators';
import { ROLE_ADMIN } from '@/module/common/constants';

@ApiVersionHeader('1')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiStandardResponse({
    summary: 'Create a new user',
    description: 'Creates a new user in the system',
    type: UserResponseDTO,
    status: 201,
  })
  @Auth(ROLE_ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    return this.userService.create(createUserDto);
  }

  @Put(':email')
  @ApiStandardResponse({
    summary: 'Update user profile',
    description: 'Updates the profile information of a user identified by email',
    type: UserResponseDTO,
  })
  @Auth()
  async updateProfile(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDTO> {
    const updatedUser = await this.userService.updateProfile(
      email,
      updateUserDto,
    );
    return plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':email/password')
  @ApiStandardResponse({
    summary: 'Change user password',
    description: 'Changes the password of a user identified by email',
    type: UserResponseDTO,
  })
  @Auth()
  async changePassword(
    @Param('email') email: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponseDTO> {
    const updatedPassword = await this.userService.changePassword(
      email,
      changePasswordDto,
    );
    return plainToInstance(UserResponseDTO, updatedPassword, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiStandardResponse({
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system',
    type: UserResponseDTO,
    isArray: true,
  })
  @Auth(ROLE_ADMIN)
  async getUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userService.getUsers();
    return plainToInstance(UserResponseDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':email')
  @ApiStandardResponse({
    summary: 'Find user by email',
    description: 'Retrieves a user identified by email from the system',
    type: UserResponseDTO,
  })
  @Auth()
  async findUserByEmail(
    @Param('email', new EmailValidationPipe()) email: string,
  ): Promise<UserResponseDTO> {
    try {
      const userFound = await this.userService.findUserByEmail(email);
      return plainToInstance(UserResponseDTO, userFound, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      return error;
    }
  }

  @Delete(':email')
  @ApiStandardResponse({
    summary: 'Delete user by email',
    description: 'Deletes a user identified by email from the system',
    type: UserResponseDTO,
  })
  @Auth()
  async deleteUserByEmail(
    @Param('email', new EmailValidationPipe()) email: string,
  ): Promise<UserResponseDTO> {
    try {
      const userDeleted = await this.userService.deleteUserByEmail(email);
      return plainToInstance(UserResponseDTO, userDeleted, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      return error;
    }
  }
}
