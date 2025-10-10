import { CollegeShortResponseDto } from "@/module/college/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { SubjectEmbeddedResponseDto } from "./response-subject-embedded.dto";


@Exclude()
export class CareerResponseDto{
    @ApiProperty()
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    _id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty({ type: () => CollegeShortResponseDto })
    @Expose()
    @Type(() => CollegeShortResponseDto)
    collegeId: CollegeShortResponseDto;

    @ApiProperty({type: ()=> SubjectEmbeddedResponseDto})
    @Expose()
    @Type(()=> SubjectEmbeddedResponseDto)
    subjects: SubjectEmbeddedResponseDto[];

    constructor(partial: Partial<CareerResponseDto>){
        Object.assign(this, partial);
    }
}