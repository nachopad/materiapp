import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCareerDto } from "./create-career.dto";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateSubjectEmbeddedDto } from "./create-subject-embedded.dto";

export class UpdateCareerDto extends PartialType(CreateCareerDto){

    //REMEMBER: The Type directive allows transformation to an object, and ValidateNested allows validation of each element in the array.
    @IsOptional()
    @ApiProperty({
        description: 'Array of subject objects',
        type: [CreateSubjectEmbeddedDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSubjectEmbeddedDto)
    subjects: CreateSubjectEmbeddedDto[]
}