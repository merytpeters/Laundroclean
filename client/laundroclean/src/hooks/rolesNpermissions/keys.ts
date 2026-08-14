export const companyRolesKeys = {
    all: ["roles"] as const,

    lists: () => ["roles", "list"] as const,

    list: (

    ) => ["roles", "list"] as const,

    detail: (id: number) => ["role", id] as const
}