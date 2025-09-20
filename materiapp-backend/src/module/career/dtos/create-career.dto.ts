import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString, Matches, MinLength } from "class-validator";

export class CreateCareerDto {
    @IsString()
    @MinLength(4, { message: 'Career name must be at least 4 characters long' })
    @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Name contains invalid characters', })
    @ApiProperty({ description: 'Full name of the degree program', example: 'Ingenieria Informatica' })
    name: string;

    @IsMongoId({ message: 'The college ID must be a valid MongoDB ObjectId' })
    @ApiProperty({ description: 'College ID' })
    collegeId: string;

    @IsMongoId({ each: true, message: 'The subject IDs must be valid MongoDB ObjectId' })
    @ApiProperty({ description: 'Subjects ID' })
    subjectsId: string[];
}