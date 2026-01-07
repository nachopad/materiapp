import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, Max, Min } from "class-validator";
import { EnrollmentState } from "../enums";

export class SubjectEnrollmentDto {
    @IsMongoId({ message: 'The subject ID must be a valid MongoDB ObjectId' })
    @ApiProperty({ description: 'Subject ID' })
    subject: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @ApiProperty({ description: 'Qualification', required: false })
    qualification?: number;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ description: 'Date', required: false })
    date?: Date;

    @IsEnum(EnrollmentState, { message: 'State must be one of: approved, regular, stateless' })
    @ApiProperty({ enum: EnrollmentState, description: 'State' })
    state: EnrollmentState;
}
