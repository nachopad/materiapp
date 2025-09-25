import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from "class-validator";
import { subjectTypes } from "../utils";
import { Types } from "mongoose";

export class CreateSubjectEmbeddedDto {

    @IsEnum(subjectTypes)
    @ApiProperty({description: 'Enum value: QUARTER OR ANNUAL', default: 'QUARTER'})
    subjectType: string; 

    @IsNumber()
    @Min(1)
    @ApiProperty({description: 'Year of career, min 1', default: 1})
    year: number; 

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({description: 'Number of quarter, only 1 or 2', default: null})
    quarter: number; 
    
    @IsMongoId({ each: true, message: 'The subject IDs must be valid MongoDB ObjectId' })
    @ApiProperty({ description: 'Subjects ID' })
    subjectId: Types.ObjectId;
}