export type PromoCodeDto = {
    id: string;
    code: string;
    description?: string;
    service: {
        name: string;
    };
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
    promoUsages: PromoUsageDto[];
}

export type PromoUsageDto = {
    id: string;
    timesUsed: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    promoCodeId: string;
}