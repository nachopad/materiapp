import { CareerShortResponseDto } from "@/module/career/dtos";
import { CollegeShortResponseDto } from "@/module/college/dtos";
import { UuidToString } from "@/module/common/decorators";
import { UserShortResponseDto } from "@/module/user/dtos";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { SubjectEnrollmentResponseDto } from "./subject-enrollment-response.dto";

@Exclude()
export class EnrollmentResponseDto {

    @ApiProperty()
    @Expose()
    @UuidToString()
    _id: string;

    @ApiProperty({ type: () => UserShortResponseDto })
    @Expose()
    @Type(() => UserShortResponseDto)
    user: UserShortResponseDto;

    @ApiProperty({ type: () => CollegeShortResponseDto })
    @Expose()
    @Type(() => CollegeShortResponseDto)
    college: CollegeShortResponseDto;

    @ApiProperty({ type: () => CareerShortResponseDto })
    @Expose()
    @Type(() => CareerShortResponseDto)
    career: CareerShortResponseDto;

    @ApiProperty({ type: [SubjectEnrollmentResponseDto] })
    @Expose()
    @Type(() => SubjectEnrollmentResponseDto)
    subjects: SubjectEnrollmentResponseDto[];

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<EnrollmentResponseDto>) {
        Object.assign(this, partial);
    }
}