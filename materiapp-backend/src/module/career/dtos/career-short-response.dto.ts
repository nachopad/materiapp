import { PickType } from "@nestjs/swagger";
import { CareerResponseDto } from "./response-career.dto";

export class CareerShortResponseDto extends PickType(CareerResponseDto, ['_id', 'name']) { }