import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsEmail()
  @ApiProperty({
    description: 'Email del usuario',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  password: string;
}
