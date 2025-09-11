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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    return this.userService.create(createUserDto);
  }

  @Put(':email')
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
