import { adminApi } from "src/lib/api/adminApi";
import { RolePayload, mapRole } from "src/types/roles/role";
import { RoleDto } from "src/types/roles/role.dto";

export async function CreateRoleService(payload: RolePayload): Promise<RoleDto| null> {
    const res = await adminApi.createRole(payload);

    if (!res.data) return null;

    const {title, ...rest} = res.data;

    return {
        title: mapRole(title),
        ...rest
    }
}

export async function GetRolesService(): Promise<RoleDto[] | []> {
    const res = await adminApi.getRoles();

    if (!res.data || !res.success) {
        return [];
    }

    const roles =  res.data.map((role) => {
        const { title, ...rest} = role;

        return  {
            title: mapRole(title),
            ...rest
        }
    })

    return roles;
}