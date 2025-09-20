import { CollegeResponseDTO } from "@/module/college/dtos";
import { SubjectResponseDto } from "@/module/subject/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";

@Exclude()
export class CareerResponseDTO{
    @ApiProperty()
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    _id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty({ type: () => CollegeResponseDTO })
    @Expose()
    @Type(() => CollegeResponseDTO)
    collegeId: CollegeResponseDTO;

    @ApiProperty({type: () => SubjectResponseDto})
    @Expose()
    @Type(()=> SubjectResponseDto)
    subjectsId: SubjectResponseDto[];

    constructor(partial: Partial<CareerResponseDTO>){
        Object.assign(this, partial);
    }
}