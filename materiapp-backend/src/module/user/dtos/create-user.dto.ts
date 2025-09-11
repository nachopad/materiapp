import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Name contains invalid characters', })
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50)
  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;
}
