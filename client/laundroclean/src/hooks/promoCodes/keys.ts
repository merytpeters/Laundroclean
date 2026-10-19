export const promoCodeKeys = {
    all: ["promocodes"] as const,
    lists: () => ["promocodes", /*"list"*/] as const,
    // list: () => ["promocodes", "list"] as const
    detail: (id: string) => ["promocode", id] as const
}