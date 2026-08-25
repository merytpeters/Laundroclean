export enum Role{
    ADMIN = "ADMIN",
    STAFF = "STAFF",
}

export function mapRole(rawRole: string | null | undefined): Role {
    if (rawRole === "ADMIN") return Role.ADMIN;
    return Role.STAFF;
}

export type RolePayload = {
    title: string;
    level?: number;
    permissions?: string[];
}

export type RoleResponse = {
    title: string;
    level?: number | null;
    permissions?: string[];
    id: number;
}

export type UserInfoSummary = {
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

type UserRoleResponse = {
    role: RoleResponse & {
        users: UserInfoSummary[] 
    }
}

export type UsersRoleResponse = UserRoleResponse

export type RolesResponse = RoleResponse[];