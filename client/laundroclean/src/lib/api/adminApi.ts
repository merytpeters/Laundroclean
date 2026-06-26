import { apiRequest } from "./requests";
import { RegisterPayload } from "src/types/auth/auth";
import { AuthResponseDto } from "src/types/auth/auth.dto";
import { RolePayload } from "src/types/roles/role";
import { RoleDto, UserRoleDto } from "src/types/roles/role.dto";
import { UserProfileDto } from "src/types/users/user.dto";

export const adminApi = {
    registerUser: (payload: RegisterPayload) =>
        apiRequest<AuthResponseDto>("/admin/company-user/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    createRole: (payload: RolePayload) =>
        apiRequest<RoleDto>("/admin/company-roles", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    getRoles: () =>
        apiRequest<RoleDto[]>("/admin/company-roles"),

    getUsersByRole: (id: string) =>
        apiRequest<UserRoleDto>(`/admin/company-roles/${id}`),
    
    updateRole: (id: string, payload: RolePayload) =>
        apiRequest<RoleDto>(`/admin/company-roles/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    deleteRole: (id: string) =>
        apiRequest<string>(`/admin/company-roles/${id}`, {
            method: "DELETE",
        }),
    
    adminGetUser: (userId: string) =>
        apiRequest<UserProfileDto>(`/api/v1/admin/users/${userId}`),
}