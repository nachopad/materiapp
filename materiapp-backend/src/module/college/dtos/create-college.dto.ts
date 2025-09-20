import { IsUniqueArray, IsXssSafeString } from "@/module/common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCollegeDto {
    @IsString()
    @IsXssSafeString("College name contains invalid characters")
    @MinLength(1, { message: 'College name must be at least 1 character long' })
    @ApiProperty({ description: 'Name of the college', example: 'Harvard University' })
    name: string;

    @IsOptional()
    @IsMongoId({ each: true, message: 'The career IDs must be valid MongoDB ObjectId' })
    @IsUniqueArray({ message: 'Careers array contains duplicate IDs' })
    @ApiProperty({ description: 'Careers ID', example: ['64b64c4f5f3c2a6d88f0e9b1'], required: false })
    careers?: string[];
}