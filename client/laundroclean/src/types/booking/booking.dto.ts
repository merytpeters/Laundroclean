import { TransactionDto } from "../financialtransactions/payment.dto";
import { UserDto } from "../users/user.dto";

export type BookingSettingsDto = {
    id: number;
    updatedAt: string;
    minPickupDays: number;
}

export type DeliveryTypeDto = "DROP_OFF" | "PICK_UP"

export type BookingStatusDto =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"                             
  | "COMPLETED"
  | "CANCELLED"
  | "IN_TRANSIT"                              
  | "DELIVERED"
  | "CUSTOMER_DROPPED_OFF_AT_POINT"
  | "CUSTOMER_PICKED_UP_FROM_POINT"
  | "COMPANY_PICKED_UP_FROM_CUSTOMER"
  | "COMPANY_PICKED_UP_FROM_POINT"
  | "COMPANY_DROPPED_OFF_AT_POINT" 

type assignedTo = UserDto

export type BookingDto = {
    id: string;
    status?: BookingStatusDto;
    profileId?: string;
    customBookingId: string;
    serviceId?: string;
    service?: {
        name?: string;
    }
    profile?: {
        user?: {
            firstName?: string;
            lastName?: string;
            email: string;
        }
        phoneNumber: string;
    }
    currency: "NAIRA" | "DOLLAR" | "POUNDS";
    unitPrice?: number;
    totalAmount?: number;
    promoCodeId?: string;
    discountAmount?: number;
    finalAmount?: number;

    itemCount?: number;
    weight?: string;
    addressId?: string;
    additionalNote?: string;
    deliveryType?: DeliveryTypeDto;
    scheduledDate?: string;
    pickupTime?: string;
    isActive?: boolean;
    assignedToId?: string;
    assignedTo: assignedTo;
    timeSlotId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    transactions?: TransactionDto[];
}

export type ListBookingsDto = BookingDto[]
