import { GetUsersParams } from "src/types/users/user";

type UserType = "CLIENT" | "COMPANYUSER";

export const adminUseUserKeys = {
    all: ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (params?: GetUsersParams, type?: UserType) => ["users", "list", params, type] as const,
    detail: (id: string) => ["user", id] as const
}