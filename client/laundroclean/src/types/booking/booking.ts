import { ProfilePayload } from "../users/user";
import { DeliveryType } from "./bookingStatus";

export type minimumPickupdaysPayload = {
    minPickupDays: number;
}

export type ClientUserListBookingsQueryParam = {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    includeProfile: false;
}

export type CompanyListBookingsQueryParam = {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    profileId?: string;
    includeProfile: true;
}

export type BookingPayload = {
    email: string;
    profileId: string;
    address?: ProfilePayload;
    deliveryType: DeliveryType;
    serviceId: string;
    promoCode?: string;
    scheduledDate: string;
    pickupTime: string;
    weight?: number;
    itemCount?: number;
    additionalNotes?: string;
    // assignedToId?: string;
    // timeSlotId?: string;
}

export type UpdateBookingPayload = {
    serviceId?: string;
    promoCode?: string;
    address?: ProfilePayload;
    deliveryType?: DeliveryType;
    scheduledDate?: string;
    pickupTime?: string;
    weight?: number;
    itemCount?: number;
    additionalNotes?: string;
}

export type BookingStatusPayload = {
    status: string;
}