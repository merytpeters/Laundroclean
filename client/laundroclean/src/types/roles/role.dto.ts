export type RoleDto = {
    title: string;
    level?: number | null;
    permissions?: string[];
    id: number;
}

type user = {
    firstName?: string;
    lastName?: string;
    email?: string;
    profile?: {
        phoneNumber?: string;
    }
    id: string;
    isActive: boolean;
    createdAt: string;
}

type UsersRoleDto = {
    role: RoleDto & {
        users: user[]
    }
}

export type UserRoleDto =  UsersRoleDto

export type RolesDto = RoleDto[];