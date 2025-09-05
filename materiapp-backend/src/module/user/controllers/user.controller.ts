import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UserResponseDTO } from '../dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    return this.userService.create(createUserDto);
  }
}
