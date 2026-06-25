export type PromoType = "PERCENTAGE" | "FIXED_AMOUNT"

export type PromoDetail = {
    id: string;
    code: string;
    description?: string;
    perUserLimit?: number;
    timesUsed?: number;
    expiresAt: string;
    type: PromoType;
    value: number;
    currency?: string;
    serviceId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    startsAt?: string;
    usageLimit?: number;
}