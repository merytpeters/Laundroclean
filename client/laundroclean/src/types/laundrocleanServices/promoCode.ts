export type PromoType = "PERCENTAGE" | "FIXED_AMOUNT"

export type PromoDetail = {
    id: string;
    code: string;
    description?: string;
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
    perUserLimit?: number;
    isActive?: boolean;
}

export type PromoCodePayload = {
    code: string;
    description?: string;
    serviceId: string;
    expiresAt: string;
    type: PromoType;
    value: number;
    currency?: string;
    startsAt?: string;
    usageLimit?: number;
    perUserLimit?: number;
    isActive: true;
}

export type UpdatePromoCodePayload = {
    code?: string;
    description?: string;
    expiresAt?: string;
    type?: PromoType;
    value: number;
    currency?: string;
    startsAt?: string;
    usageLimit?: number;
    perUserLimit?: number;
    isActive: boolean;
}

{/*export interface PromoCodeResponse {
    data: PromoDetail[];
    pagination: {
        page: number;
        limit: number;
       total: number;
    }
}*/}