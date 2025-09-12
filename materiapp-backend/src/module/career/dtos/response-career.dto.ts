import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class CareerResponseDTO{
    @ApiProperty()
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    _id: string;

    @ApiProperty()
    @Expose()
    name: string;

    constructor(partial: Partial<CareerResponseDTO>){
        Object.assign(this, partial);
    }
}