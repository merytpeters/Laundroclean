import { CalendarRowPayload } from "../calendar/calendar";
import { ProfilePayload } from "../users/user";
import { DeliveryTypeDto } from "./booking.dto";

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
    address?: ProfilePayload;
    deliveryType: DeliveryTypeDto;
    serviceId: string;
    promoCode?: string;
    scheduledDate: string;
    pickupTime?: string;
    weight?: number;
    itemCount?: number;
    additionalNotes?: string;
    assignedToId?: string;
    timeSlotId?: string;
}

export type BookingFormValues =
    Omit<BookingPayload, "scheduledDate" | "pickupTime"> &
    Omit<CalendarRowPayload, "date"> & {
        scheduledDate: string;
        scheduledTime: string;
        pickupDate: string;
        pickupTime: string;
        date: string;
        time: string;
    };

export type UpdateBookingPayload = {
    serviceId?: string;
    promoCode?: string;
    address?: ProfilePayload;
    deliveryType?: DeliveryTypeDto;
    scheduledDate?: string;
    pickupTime?: string;
    weight?: number;
    itemCount?: number;
    additionalNotes?: string;
}

export type BookingStatusPayload = {
    status: string;
}