export type PromoCodeDto = {
    id: string;
    code: string;
    description?: string;
    perUserLimit?: number;
    timesUsed?: number;
    expiresAt: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    currency?: string;
    serviceId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    startsAt?: string;
    usageLimit?: number;
    isActive: boolean;
}