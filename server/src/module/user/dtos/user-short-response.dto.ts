import { PickType } from "@nestjs/swagger";
import { UserResponseDTO } from "./user-response.dto";

export class UserShortResponseDto extends PickType(UserResponseDTO, ['_id', 'name', 'email']) { }