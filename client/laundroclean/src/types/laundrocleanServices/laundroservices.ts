import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { PromoDetail } from "./promocode";

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

export interface ServicesPromoResponse {
  data: ServiceDisplayProp[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}