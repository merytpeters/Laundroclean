import { apiRequest } from "./requests";
import { RegisterPayload } from "src/types/auth/auth";
import { AuthResponseDto } from "src/types/auth/auth.dto";
import { RolePayload } from "src/types/roles/role";
import { RoleDto } from "src/types/roles/role.dto";

export const adminApi = {
    registerUser: (payload: RegisterPayload) =>
        apiRequest<AuthResponseDto>("/admin/company-user/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    createRole: (payload: RolePayload) =>
        apiRequest<RoleDto>("/admin/company-roles", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    getRoles: () =>
        apiRequest<RoleDto[]>("/admin/company-roles")
};