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
