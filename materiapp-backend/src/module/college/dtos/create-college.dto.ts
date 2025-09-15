import { IsXssSafeString } from "@/module/common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCollegeDto {
    @IsString()
    @IsXssSafeString("College name contains invalid characters")
    @MinLength(1, { message: 'College name must be at least 1 character long' })
    @ApiProperty({ description: 'Name of the college', example: 'Harvard University' })
    name: string;
}