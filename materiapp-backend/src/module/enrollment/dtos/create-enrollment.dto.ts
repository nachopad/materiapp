import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsMongoId, ValidateNested } from "class-validator";
import { SubjectEnrollmentDto } from "./subject-enrollment.dto";

export class CreateEnrollmentDto {
    @IsMongoId({ message: 'The career ID must be a valid MongoDB ObjectId' })
    @ApiProperty({ description: 'Career ID' })
    careerId: string;

    @IsMongoId({ message: 'The college ID must be a valid MongoDB ObjectId' })
    @ApiProperty({ description: 'College ID' })
    collegeId: string;

    @ValidateNested({ each: true })
    @Type(() => SubjectEnrollmentDto)
    @ArrayMinSize(1)
    @ApiProperty({ type: [SubjectEnrollmentDto], description: 'Subjects' })
    subjects: SubjectEnrollmentDto[];
}