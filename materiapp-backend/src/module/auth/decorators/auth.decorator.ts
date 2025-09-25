import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { JwtAccessAuthGuard, RoleAuthGuard } from "../guards"

export const Auth = (...roles: string[]) =>
    applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(
            JwtAccessAuthGuard,
            RoleAuthGuard
        )
    )
