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
    permissions?: string[];
    title: string;
    level?: number | null;
    id?: number;
    role?: string;
}

export type UserInfoSummary = {
    firstName?: string;
    lastName?: string;
    email?: string;
    profile?: {
        phoneNumber?: string;
    }
}

type users = UserInfoSummary

export type UsersRoleResponse = users & RoleResponse