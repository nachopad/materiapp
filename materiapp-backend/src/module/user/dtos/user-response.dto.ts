import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserResponseDTO {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value?.toString())
  _id: string;

  @ApiProperty()
  @Expose()
  googleId: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  get isGoogleUser(): boolean {
    return !!this.googleId;
  }

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
