import { UuidToString } from '@/module/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDTO {
  @ApiProperty()
  @Expose()
  @UuidToString()
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

  @ApiProperty({ type: [String] })
  @Expose()
  roles: string[];

  @ApiProperty()
  @Expose()
  get isGoogleUser(): boolean {
    return !!this.googleId;
  }

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
