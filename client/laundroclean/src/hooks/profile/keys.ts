export const profileKeys = {
    all: ["profile"] as const,

    profile: () => [...profileKeys.all, "me"] as const,

    detail: (id: string) =>
    [...profileKeys.all, id] as const
}