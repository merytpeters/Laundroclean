import type { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface ServiceDisplayProp {
  id?: string;
  name: string;
  description?: string;
  pricingType: string;
  amount: number;
  currency: string;
  maxDailyBookings?: string;
}

export interface ServicesProps {
  icon?: string | StaticImport;
  name: string;
  description: string;
  orderedlist?: string[];
}