import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";

export function UuidToString() {
    return applyDecorators(
        Transform(({ obj }) => obj._id?.toString())
    )
}