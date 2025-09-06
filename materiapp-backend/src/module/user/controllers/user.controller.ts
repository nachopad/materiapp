import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserResponseDTO } from '../dtos';
import { ChangePasswordDto } from '../dtos/change-password.dto';

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
    return this.userService.updateProfile(email, updateUserDto);
  }

  @Patch(':email/password')
  async changePassword(
    @Param('email') email: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(email, changePasswordDto);
  }
}
