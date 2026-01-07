import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { AuthUser } from "../interfaces";

export const User = createParamDecorator((_data: string, context: ExecutionContext): AuthUser => {
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.sub) throw new InternalServerErrorException('User not found');

    return {
        _id: user.sub,
        email: user.email,
        roles: user.roles
    };
});