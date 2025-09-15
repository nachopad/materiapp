import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MinLength(4, { message: 'Subject name must be at least 4 characters long.' })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message:
      'Subject name can only contain letters, spaces, apostrophes, and hyphens.',
  })
  @ApiProperty({
    description:
      'Full subject name. Only letters, spaces, apostrophes, and hyphens are allowed.',
    example: 'Mathematics',
  })
  name: string;
}
