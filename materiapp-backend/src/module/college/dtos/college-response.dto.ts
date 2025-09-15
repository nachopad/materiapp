import { UuidToString } from "@/module/common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CollegeResponseDTO {
    @ApiProperty()
    @Expose()
    @UuidToString()
    _id: string;


    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<CollegeResponseDTO>) {
        Object.assign(this, partial);
    }
}