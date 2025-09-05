import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

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

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    get isGoogleUser(): boolean {
        return !!this.googleId;
    }

    constructor(partial: Partial<UserResponseDTO>) {
        Object.assign(this, partial);
    }
}