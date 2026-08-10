import { adminApi } from "src/lib/api/adminApi";
import { RolePayload, UsersRoleResponse, RoleResponse } from "src/types/roles/role";
import { ApiResponse } from "src/lib/api/requests";

export async function createRoleService(payload: RolePayload): Promise<ApiResponse<RoleResponse> | null> {
    const res = await adminApi.createRole(payload);

    if (!res.success || !res.data) return null;

    // role mapping is not needed here as uiRole has been separated from server role
    return res;
}

export async function getRolesService(): Promise<ApiResponse<RoleResponse[]> | []> {
    const res = await adminApi.getRoles();

    if (!res.success || !res.data) {
        return [];
    }

    return res;
}

export async function getUsersByRoleService(id: string): Promise<ApiResponse<UsersRoleResponse> | null> {
    const res = await adminApi.getUsersByRole(id);

    if (!res.success || !res.data) {
        return null;
    }

    return res
}

export async function updateRoleService(id: string, payload: RolePayload): Promise<ApiResponse<RoleResponse> | null> {
    const res = await adminApi.updateRole(id, payload);

    if (!res.success || !res.data) {
        return null;
    }

    return res
}

export async function deleteRoleService(id: string): Promise<ApiResponse<string> | null> {
    const res = await adminApi.deleteRole(id);

   if  (!res.success) return null;

   return res || "Role successfully deleted";
}