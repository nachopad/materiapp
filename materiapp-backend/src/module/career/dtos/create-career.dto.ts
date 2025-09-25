import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsString, Matches, MinLength, ValidateNested } from "class-validator";
import { CreateSubjectEmbeddedDto } from "./create-subject-embedded.dto";
import { Type } from "class-transformer";

export class CreateCareerDto {
    @IsString()
    @MinLength(4, { message: 'Career name must be at least 4 characters long' })
    @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Name contains invalid characters', })
    @ApiProperty({ description: 'Full name of the degree program', example: 'Ingenieria Informatica' })
    name: string;

    @IsMongoId({ message: 'The college ID must be a valid MongoDB ObjectId' })
    @ApiProperty({ description: 'College ID' })
    collegeId: string;

}