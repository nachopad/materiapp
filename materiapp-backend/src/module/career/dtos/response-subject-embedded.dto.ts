import { SubjectResponseDto } from "@/module/subject/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";

@Exclude()
export class SubjectEmbeddedResponseDto {

    @Expose()
    @ApiProperty()
    subjectType: string;

    @Expose()
    @ApiProperty()
    year: number;

    @Expose()
    @ApiProperty()
    quarter: number;

    //Primera Version 
    //@Expose()
    // @ApiProperty()
    // @Transform(({ obj }) => obj.subjectId?.toString())
    // subjectId: string;

    //Segunda version SOLO para el Populate
    @Expose()
    @ApiProperty({ type: () => SubjectResponseDto })
    @Type(() => SubjectResponseDto)
    subjectId: SubjectResponseDto;
}