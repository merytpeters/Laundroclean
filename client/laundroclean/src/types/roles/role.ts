export enum Role{
    ADMIN = "ADMIN",
    STAFF = "STAFF",
}

export function mapRole(rawRole: string | null | undefined): Role {
    if (rawRole === "ADMIN") return Role.ADMIN;
    return Role.STAFF;
}