import { Exclude, Expose, Type } from "class-transformer";
import { EnrollmentState } from "../enums";
import { ApiProperty } from "@nestjs/swagger";
import { SubjectResponseDto } from "@/module/subject/dtos";

@Exclude()
export class SubjectEnrollmentResponseDto {

    @ApiProperty({ type: () => SubjectResponseDto })
    @Expose()
    @Type(() => SubjectResponseDto)
    subject: SubjectResponseDto;

    @ApiProperty()
    @Expose()
    qualification?: number;

    @ApiProperty()
    @Expose()
    date?: Date;

    @ApiProperty({ enum: EnrollmentState })
    @Expose()
    state?: EnrollmentState;

    constructor(partial: Partial<SubjectEnrollmentResponseDto>) {
        Object.assign(this, partial);
    }
}