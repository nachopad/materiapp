import { Role } from "@/module/common/enums";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export class RoleAuthGuard implements CanActivate {

    constructor() { }

    canActivate(context: ExecutionContext): boolean {
        const reflector = new Reflector();

        const roles = reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles || roles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest();
        if (!user) return false;

        const cantActivate = roles.some(role => user.roles?.includes(role));
        return cantActivate;
    }
}