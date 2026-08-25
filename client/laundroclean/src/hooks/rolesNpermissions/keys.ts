import { PaginationParamQuery } from "src/types/users/user";

export const companyRolesKeys = {
    all: ["roles"] as const,

    lists: () => ["roles", "list"] as const,

    list: (params?: PaginationParamQuery) => ["roles", "list", params] as const,

    detail: (id: number) => ["role", id] as const
}