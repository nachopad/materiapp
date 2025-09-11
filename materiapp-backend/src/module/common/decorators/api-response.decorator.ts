import { applyDecorators, Type } from "@nestjs/common";
import { ApiOperation, ApiResponse, getSchemaPath } from "@nestjs/swagger";

interface ApiResponseOptions {
    summary: string;
    description?: string;
    type?: Type<any>;
    status?: number;
    isArray?: boolean;
    primitiveType?: 'string' | 'number' | 'boolean'; // Para tipos primitivos
}

export function ApiStandardResponse(options: ApiResponseOptions) {
    const { summary, description, type, status = 200, isArray, primitiveType = "string" } = options;

    const metadataSchema = {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: status },
            timestamp: { type: 'string', example: new Date().toISOString() },
            path: { type: 'string', example: '/api/example' },
        },
    };

    let dataSchema: any = {};
    if (type) {
        dataSchema = isArray
            ? { type: 'array', items: { $ref: getSchemaPath(type) } }
            : { $ref: getSchemaPath(type) };
    } else if (primitiveType) {
        dataSchema = isArray
            ? { type: 'array', items: { type: primitiveType } }
            : { type: primitiveType };
    }

    return applyDecorators(
        ApiOperation({ summary, description }),
        ApiResponse({
            status,
            schema: {
                properties: {
                    _metadata: metadataSchema,
                    data: dataSchema,
                },
            },
        }),
    );
}