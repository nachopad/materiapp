import { Role } from "@/module/common/enums"
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { JwtAccessAuthGuard, RoleAuthGuard } from "../guards"

export const Auth = (...roles: Role[]) =>
    applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(
            JwtAccessAuthGuard,
            RoleAuthGuard
        )
    )
