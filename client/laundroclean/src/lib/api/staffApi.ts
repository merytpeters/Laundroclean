import { GetActiveServicesParams, ServicePayload, UpdateServicePayload } from "src/types/laundrocleanServices/laundroservices";
import { apiRequest } from "./requests";
import { ServiceDto, ServicesDto, ServiceWithServicePriceAndPromoCodesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { BookingPayload, BookingStatusPayload, CompanyListBookingsQueryParam, UpdateBookingPayload } from "src/types/booking/booking";
import { BookingDto, ListBookingsDto } from "src/types/booking/booking.dto";
import { CalendarRowParams, CalendarRowPayload, TimeSlotPayload, TimeSlotsParam, UpdateCalendarRowPayload, UpdateTimeSlotPayload } from "src/types/calendar/calendar";
import { CalendarRowWithTimeSlotsDto, TimeSlotsDto } from "src/types/calendar/calendar.dto";

export const staffApi = {
    createService: (payload: ServicePayload) =>
        apiRequest<ServiceDto>('/staff/services', {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    getActiveServices: (params?: GetActiveServicesParams) =>
        apiRequest<ServicesDto>('/staff/services', {
            params: params
        }),

    getActiveServiceById: (serviceId: string) =>
        apiRequest<ServiceWithServicePriceAndPromoCodesDto>(`/staff/services/${serviceId}`),

    // also deactivates and activates a service
    updateServiceById: (serviceId: string, payload: UpdateServicePayload) =>
        apiRequest<ServiceDto>(`/staff/services/${serviceId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    createBooking: (payload: BookingPayload) =>
        apiRequest<BookingDto>('/staff/booking', {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    
    searchBookings: (params?: CompanyListBookingsQueryParam) =>
        apiRequest<ListBookingsDto>('/staff/bookings', {
            params: params
        }),

    updateBooking: (bookingId: string, payload: UpdateBookingPayload) =>
        apiRequest<BookingDto>(`/staff/bookings/${bookingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    getBookingById: (bookingId: string) =>
        apiRequest<BookingDto>(`/staff/bookings/${bookingId}`),

    updateBookingStatus: (bookingId: string, payload: BookingStatusPayload) =>
        apiRequest<BookingDto>(`/staff/bookings-status/${bookingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),
    
    createCalendarRow: (payload: CalendarRowPayload) =>
        apiRequest<CalendarRowWithTimeSlotsDto>('/staff/staff-calendars', {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    
    listCompanyUserCalendar: (params?: CalendarRowParams) =>
        apiRequest<CalendarRowWithTimeSlotsDto[]>('/staff/staff-calendars', {
            params: params
        }),
    
    getCalendarRowById: (calendarId: string) =>
        apiRequest<CalendarRowWithTimeSlotsDto>(`/staff/staff-calendars/${calendarId}`),

    updateCalendarRowById: (calendarId: string, payload: UpdateCalendarRowPayload) =>
        apiRequest<CalendarRowWithTimeSlotsDto>(`/staff/staff-calendars/${calendarId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),
    
    createTimeSlot: (payload: TimeSlotPayload) =>
        apiRequest<TimeSlotsDto>('/staff/timeslots', {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    
    listTimeSlots: (params?: TimeSlotsParam) =>
        apiRequest<TimeSlotsDto[]>('/staff/timeslots', {
            params: params
        }),
    
    getTimeSlotById: (timeslotId: string) =>
        apiRequest<TimeSlotsDto>(`/staff/timeslots/${timeslotId}`),

    updateTimeSlotById: (timeslotId: string, payload: UpdateTimeSlotPayload) =>
        apiRequest<TimeSlotsDto>(`/admin/timeslots/${timeslotId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),
}