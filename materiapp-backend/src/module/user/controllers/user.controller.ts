import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserResponseDTO } from '../dtos';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { EmailValidationPipe } from '../pipes';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
  ): Promise<UserResponseDTO> {
    return this.userService.changePassword(email, changePasswordDto);
  }

  
  /** Methods to get **/
  @Get()
  async getUsers(): Promise<UserResponseDTO[]> {
    return this.userService.getUsers();
  }
  /**
   * Validación para que lo que llegue tenga formato email y evitar buscar en la BD,
   * Mejora el rendimiento
   * Opciones: 
   *          Pipes --> Me lo dijo la IA XD
   *          DTO ---> Solo para validar el email? me parece raro, pero queda para hablarlo
   * @param email 
   * @returns User found
   */
  @Get(':email')
  async findUserByEmail(@Param('email', new EmailValidationPipe()) email: string): Promise<UserResponseDTO> {
    try {
      return await this.userService.findUserByEmail(email);
    } catch (error) {
      return error;
    }
  }

  @Delete(':email')
  async deleteUserByEmail(@Param('email', new EmailValidationPipe()) email: string): Promise<UserResponseDTO>{
    try {
      return await this.userService.deleteUserByEmail(email);
    } catch (error) {
      return error;
    }
  }
  


}
