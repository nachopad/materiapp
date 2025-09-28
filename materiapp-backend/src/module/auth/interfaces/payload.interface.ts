import { Role } from "@/module/common/enums";

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}
