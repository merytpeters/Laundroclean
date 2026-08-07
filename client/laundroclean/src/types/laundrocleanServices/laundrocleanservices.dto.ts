import { Meta } from "../shared";
import { PromoCodeDto } from "./promoCode.dto";

export type ServiceDto = {
    name: string;
    description: string;
    maxDailyBookings: number;
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    prices?: ServicePriceDto[];
    promoCodes?: PromoCodeDto[];
}

export type ServicePriceDto = {
    id: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    serviceId?: string;
    amount: number;
    currency: "DOLLAR" | "NAIRA" | "POUNDS";
    pricingType: "PER_KG" | "PER_ITEM" | "FLAT_RATE";
}

export type ServicesDto = ServiceDto[] & Meta;
