import { adminApi } from "src/lib/api/adminApi";
import { BookingPayload, BookingStatusPayload, CompanyListBookingsQueryParam, minimumPickupdaysPayload, UpdateBookingPayload } from "src/types/booking/booking";
import { BookingDto, BookingSettingsDto, ListBookingsDTO } from "src/types/booking/booking.dto";


// admin routes Services
export async function setMinimumPickupDaysService (payload: minimumPickupdaysPayload): Promise<BookingSettingsDto | null> {
    const res = await adminApi.setMinimumPickupDays(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminSearchBookingService (params? : CompanyListBookingsQueryParam): Promise<ListBookingsDTO | null> {
    const res = await adminApi.searchBookings(params);

    if (!res.success || !res.data || !res.meta) return null;

    return res.data
}

export async function adminCreateBookingService (payload: BookingPayload): Promise<BookingDto | null> {
    const res = await adminApi.createBooking(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminGetBookingById (bookingId: string): Promise<BookingDto | null> {
    const res = await adminApi.getBookingById(bookingId);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminUpdateBooking (bookingId: string, payload: UpdateBookingPayload): Promise<BookingDto | null> {
    const res = await adminApi.updateBooking(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminCancelBookingService (bookingId: string): Promise<string | null> {
    const res = await adminApi.cancelBooking(bookingId);

    if (!res.success || !res.message) return null;

    return res.message
}

export async function adminUpdateBookingStatusService (bookingId: string, payload: BookingStatusPayload): Promise<BookingDto | null> {
    const res = await adminApi.updateBookingStatus(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminRestoreBookingService (bookingId: string): Promise<BookingDto | null> {
    const res = await adminApi.restoreBooking(bookingId);

    if (!res.success || !res.data) return null;

    return res.data
}

