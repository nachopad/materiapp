import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { ACCEPT_VERSION_HEADER } from "../constants";

export function ApiVersionHeader(defaultVersion: string = '1') {
    return applyDecorators(
        ApiHeader({
            name: ACCEPT_VERSION_HEADER,
            description: 'Header to specify the API version',
            required: true,
            schema: { type: 'string', default: defaultVersion },
        }),
    );
}