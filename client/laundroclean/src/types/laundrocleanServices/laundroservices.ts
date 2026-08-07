import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { PromoDetail } from "./promoCode";
import { Meta } from "../shared";

export type PricingType = "per kg" | "per item" | "flat rate"

export function mapPricingType(pricingType: string): PricingType {
    switch(pricingType) {
        case "PER_KG":
            return "per kg"
        case "PER_ITEM":
            return "per item"
        case "FLAT_RATE":
            return "flat rate"
        default:
            throw new Error(`Unknown pricing type: ${pricingType}`)
    }
}

export type Currency = "USD" | "NGN" | "GBP"

export function mapCurrency(currency: string): Currency {
    switch(currency) {
        case "NAIRA":
            return "NGN"
        case "POUNDS":
            return "GBP"
        case "DOLLAR":
            return "USD"
        default:
            throw new Error(`Unknown currency: ${currency}`)
    }
   
}

export type CurrencySymbol = "$" | "₦" | "£"

export function mapCurrencySymbol(currency: string): CurrencySymbol {
    switch(currency) {
        case "NAIRA":
            return "₦"
        case "POUNDS":
            return "£"
        case "DOLLAR":
            return "$"
        default:
            throw new Error(`Unknown currency symbol: ${currency}`)
    }
   
}

export interface ServicesProps {
  icon?: string | StaticImport;
  name: string;
  description: string;
  orderedlist?: string[];
}

export interface ServiceDisplayProp {
  id?: string;
  name: string;
  description?: string;
  pricingType: string;
  amount: number;
  currency: string;
  maxDailyBookings?: string;
  promoCodes?: PromoDetail[];
}

export type ServicePricePayload = {
    serviceId?: string;
    amount?: number;
    currency?: "DOLLAR" | "NAIRA" | "POUNDS";
    pricingType?: "PER_KG" | "PER_ITEM" | "FLAT_RATE";
}

export type ServicePriceResponse = {
    id: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    serviceId?: string;
    amount: number;
    currency: "DOLLAR" | "NAIRA" | "POUNDS";
    pricingType: "PER_KG" | "PER_ITEM" | "FLAT_RATE";
}

export type ServicePayload = {
    name: string;
    description: string;
    maxDailyBookings?: number;
}

export type ServiceResponse = {
    name: string;
    description: string;
    maxDailyBookings: number;
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    prices?: ServicePriceResponse[],
    promoCodes?: PromoDetail[]
}

export interface GetActiveServicesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export type ServicesResponse = ServiceResponse[] & Meta;


{/*export interface ServicesPromoResponse {
  data: ServiceDisplayProp[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}*/}


export type UpdateServicePayload = {
    name?: string;
    description?: string;
    maxDailyBookings?: number;
    isActive?: boolean;
}

export type AllServicesParams = {
    page?: number;
    limit?: number;
    search?: string;
    includeDeleted?: 'true' | 'false' | 'only';
}

export type ServiceIdPayload = {
    id: string;
}

export type ActivateOrDeactivateServicesPayload = {
    ids: ServiceIdPayload[];
}

export type ActivatedOrDeactivatedServicesResponse = {
    deletedCount?: number;
    count?: number
}

export type PublicServicesParams = {
    search?: string;
    page?: number;
    limit?: number;
    sort?: {
        price?: 'asc' | 'desc';
        name?: 'asc' | 'desc';
    }
}