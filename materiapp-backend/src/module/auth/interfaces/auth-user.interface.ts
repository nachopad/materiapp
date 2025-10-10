import { Role } from "@/module/common/enums";

export interface AuthUser {
  _id: string;
  email: string;
  roles: Role[];
}
