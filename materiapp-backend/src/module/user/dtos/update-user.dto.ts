import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsOptional()
  @ApiProperty({
    description: 'New user password',
    example: 'newpassword123',
    required: false,
  })
  newPassword?: string;
}
