import { adminApi } from "src/lib/api/adminApi";
import { RolePayload, mapRole, UsersRoleResponse, RoleResponse } from "src/types/roles/role";

export async function createRoleService(payload: RolePayload): Promise<RoleResponse| null> {
    const res = await adminApi.createRole(payload);

    if (!res.success || !res.data) return null;

    const {title, ...rest} = res.data;

    return {
        role: mapRole(title),
        title,
        ...rest
    }
}

export async function getRolesService(): Promise<RoleResponse[] | []> {
    const res = await adminApi.getRoles();

    if (!res.success || !res.data) {
        return [];
    }

    const roles =  res.data.map((role) => {
        const { title, ...rest} = role;

        return  {
            role: mapRole(title),
            title,
            ...rest
        }
    })

    return roles;
}

export async function getUsersByRoleService(id: string): Promise<UsersRoleResponse | null> {
    const res = await adminApi.getUsersByRole(id);

    if (!res.success || !res.data) {
        return null;
    }

    return res.data
}

export async function updateRoleService(id: string, payload: RolePayload): Promise<RoleResponse | null> {
    const res = await adminApi.updateRole(id, payload);

    if (!res.success || !res.data) {
        return null;
    }

    return res.data
}

export async function deleteRoleService(id: string): Promise<string | null> {
    const res = await adminApi.deleteRole(id);

   if  (!res.success) return null;

   return res.message || "Role successfully deleted";
}