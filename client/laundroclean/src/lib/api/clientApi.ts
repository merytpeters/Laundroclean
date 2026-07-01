
import { GetActiveServicesParams } from "src/types/laundrocleanServices/laundroservices";
import { apiRequest } from "./requests";
import { ServicesDto, ServiceWithServicePriceAndPromoCodesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { BookingPayload, BookingStatusPayload, ClientUserListBookingsQueryParam, UpdateBookingPayload } from "src/types/booking/booking";
import { BookingDto, ListBookingsDTO } from "src/types/booking/booking.dto";

export const clientApi = {
    getServices: (params?: GetActiveServicesParams ) =>
        apiRequest<ServicesDto>('/client/services', {
            params: params
        }),

    getServiceById: (id: string) =>
        apiRequest<ServiceWithServicePriceAndPromoCodesDto>(`/client/services/${id}`),

    createBooking: (payload: BookingPayload) =>
        apiRequest<BookingDto>('/client/booking', {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    
    getBookings: (params?: ClientUserListBookingsQueryParam) =>
        apiRequest<ListBookingsDTO>('/client/bookings', {
            params: params
        }),

    getBookingById: (bookingId: string) =>
        apiRequest<BookingDto>(`/client/bookings/${bookingId}`),

    updateBookingById: (bookingId: string, payload: UpdateBookingPayload) =>
        apiRequest<BookingDto>(`/client/bookings/${bookingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    cancelBooking: (bookingId: string) =>
        apiRequest<string>(`/client/bookings/cancel/${bookingId}`, {
            method: "PATCH"
        }),

    updateBookingStatus: (bookingId: string, payload: BookingStatusPayload) =>
            apiRequest<BookingDto>(`/client/bookings-status/${bookingId}`, {
                method: "PATCH",
                body: JSON.stringify(payload)
            }),
}