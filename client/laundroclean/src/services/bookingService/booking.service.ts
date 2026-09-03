import { adminApi } from "src/lib/api/adminApi";
import { clientApi } from "src/lib/api/clientApi";
import { ApiResponse } from "src/lib/api/requests";
import { staffApi } from "src/lib/api/staffApi";
import { BookingPayload, BookingStatusPayload, ClientUserListBookingsQueryParam, CompanyListBookingsQueryParam, minimumPickupdaysPayload, UpdateBookingPayload } from "src/types/booking/booking";
import { BookingDto, BookingSettingsDto, ListBookingsDto } from "src/types/booking/booking.dto";


// admin routes Services
export async function setMinimumPickupDaysService (payload: minimumPickupdaysPayload): Promise<ApiResponse<BookingSettingsDto> | null> {
    const res = await adminApi.setMinimumPickupDays(payload);

    if (!res.success || !res.data || !res.message) return null;

    return res
}

export async function adminSearchBookingService (params? : CompanyListBookingsQueryParam): Promise<ApiResponse<ListBookingsDto> | null> {
    const res = await adminApi.searchBookings(params);

    if (!res.success || !res.data || !res.meta) return null;

    return res
}

export async function adminCreateBookingService(
    payload: BookingPayload
): Promise<ApiResponse<BookingDto>> {
    const res = await adminApi.createBooking(payload);

    if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to create booking');
    }

    return res;
}

export async function adminGetBookingById (bookingId: string): Promise<ApiResponse<BookingDto> | null> {
    const res = await adminApi.getBookingById(bookingId);

    if (!res.success || !res.data) return null;

    return res
}

export async function adminUpdateBooking (bookingId: string, payload: UpdateBookingPayload): Promise<ApiResponse<BookingDto> | null> {
    const res = await adminApi.updateBooking(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function adminCancelBookingService (bookingId: string): Promise<ApiResponse<string> | null> {
    const res = await adminApi.cancelBooking(bookingId);

    if (!res.success || !res.message) return null;

    return res
}

export async function adminUpdateBookingStatusService (bookingId: string, payload: BookingStatusPayload): Promise<ApiResponse<BookingDto> | null> {
    const res = await adminApi.updateBookingStatus(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function adminRestoreBookingService (bookingId: string): Promise<ApiResponse<BookingDto> | null> {
    const res = await adminApi.restoreBooking(bookingId);

    if (!res.success || !res.data) return null;

    return res
}

// client ApiServices
export async function clientCreateBookingService (payload: BookingPayload): Promise<ApiResponse<BookingDto>> {
    const res = await clientApi.createBooking(payload);

    if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to create booking');
    };

    return res
}

export async function clientGetBookingsService (params?: ClientUserListBookingsQueryParam): Promise<ApiResponse<ListBookingsDto> | null> {
    const res = await clientApi.getBookings(params);

    if (!res.success || !res.data || !res.meta) return null;

    return res
}

export async function clientGetBookingByIdService (bookingId: string): Promise<ApiResponse<BookingDto> | null> {
    const res = await clientApi.getBookingById(bookingId);

    if (!res.success || !res.data) return null;

    return res
}

export async function clientUpdateBookingByIdService (bookingId: string, payload: UpdateBookingPayload): Promise<ApiResponse<BookingDto> | null> {
    const res = await clientApi.updateBookingById(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function clientCancelBookingService (bookingId: string): Promise<ApiResponse<string> | null> {
    const res = await clientApi.cancelBooking(bookingId);

    if (!res.success || !res.message) return null;

    return res
}

export async function clientUpdateBookingStatusService (bookingId: string, payload: BookingStatusPayload): Promise<ApiResponse<BookingDto> | null> {
    const res = await clientApi.updateBookingStatus(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res
}


// Staff API Service
export async function staffCreateBookingService (payload: BookingPayload): Promise<ApiResponse<BookingDto>> {
    const res = await staffApi.createBooking(payload);

    if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to create booking');
    };

    return res
}

export async function staffSearchBookingService (params? : CompanyListBookingsQueryParam): Promise<ApiResponse<ListBookingsDto> | null> {
    const res = await staffApi.searchBookings(params);

    if (!res.success || !res.data || !res.meta) return null;

    return res
}

export async function staffUpdateBooking (bookingId: string, payload: UpdateBookingPayload): Promise<ApiResponse<BookingDto> | null> {
    const res = await staffApi.updateBooking(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res
}

export async function staffGetBookingById (bookingId: string): Promise<ApiResponse<BookingDto> | null> {
    const res = await staffApi.getBookingById(bookingId);

    if (!res.success || !res.data) return null;

    return res
}

export async function staffUpdateBookingStatusService (bookingId: string, payload: BookingStatusPayload): Promise<ApiResponse<BookingDto> | null> {
    const res = await staffApi.updateBookingStatus(bookingId, payload);

    if (!res.success || !res.data) return null;

    return res
}
