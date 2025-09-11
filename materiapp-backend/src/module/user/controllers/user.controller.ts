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
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserResponseDTO } from '../dtos';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { EmailValidationPipe } from '../pipes';
import { plainToInstance } from 'class-transformer';
import { ApiStandardResponse } from '@/module/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiStandardResponse({
    summary: 'Create a new user',
    description: 'Creates a new user in the system',
    type: UserResponseDTO,
    status: 201,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    return this.userService.create(createUserDto);
  }

  @Put(':email')
  @ApiStandardResponse({
    summary: 'Update user profile',
    description: 'Updates the profile information of a user identified by email',
    type: UserResponseDTO,
  })
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
  async getUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userService.getUsers();
    return plainToInstance(UserResponseDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':email')
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
