import { applyDecorators } from '@nestjs/common';
import { Matches } from 'class-validator';

export function IsXssSafeString(message?: string) {
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ-]+$/;
    return applyDecorators(
        Matches(regex, { message: message || 'The value contains invalid characters.' })
    );
}