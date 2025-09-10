import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Esto es para evitar hacer lo siquieres const cookie = req.cokies[NOMBRE DE LA COOKIE]
 * Evita crear codigo repetido
 */
export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
