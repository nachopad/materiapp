import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({ description: 'Current password', example: 'oldPass123' })
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({ description: 'New password', example: 'newPass123' })
  newPassword: string;
}
