import { PickType } from "@nestjs/swagger";
import { CollegeResponseDto } from "./college-response.dto";

export class CollegeShortResponseDto extends PickType(CollegeResponseDto, ['_id', 'name']) { }