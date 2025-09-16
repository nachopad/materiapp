import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class SubjectResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(partial: Partial<SubjectResponseDto>) {
    Object.assign(this, partial);
  }
}
