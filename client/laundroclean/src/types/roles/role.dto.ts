export type RoleDto = {
    title: string;
    level?: number;
    permissions?: string[];
    id: number;
}

type users = {
    firstName: string;
    lastName: string;
    email: string;
    profile?: {
        phoneNumber?: string;
    }
}

export type UserRoleDto = users & RoleDto