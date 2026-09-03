import { apiRequest } from "./requests";
import { RegisterPayload } from "src/types/auth/auth";
import { AuthResponseDto } from "src/types/auth/auth.dto";
import { BookingPayload, BookingStatusPayload, CompanyListBookingsQueryParam, minimumPickupdaysPayload, UpdateBookingPayload } from "src/types/booking/booking";
import { BookingDto, BookingSettingsDto, ListBookingsDto } from "src/types/booking/booking.dto";
import { CalendarRowParams, CalendarRowPayload, TimeSlotPayload, TimeSlotsParam, UpdateCalendarRowPayload, UpdateTimeSlotPayload } from "src/types/calendar/calendar";
import { CalendarRowWithTimeSlotsDto, TimeSlotsDto } from "src/types/calendar/calendar.dto";
import { ServiceDto, ServicesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { ActivateOrDeactivateServicesPayload, AllServicesParams, ActivatedOrDeactivatedServicesResponse, GetActiveServicesParams, ServicePayload, ServicesResponse, UpdateServicePayload } from "src/types/laundrocleanServices/laundroservices";
import { PromoCodePayload, UpdatePromoCodePayload } from "src/types/laundrocleanServices/promoCode";
import { PromoCodeDto } from "src/types/laundrocleanServices/promoCode.dto";
import { RolePayload } from "src/types/roles/role";
import { RoleDto, RolesDto, UserRoleDto } from "src/types/roles/role.dto";
import { GetUsersParams, PaginationParamQuery, UpdateUserStatusPayload } from "src/types/users/user";
import { UserDto, UserProfileDto } from "src/types/users/user.dto";

export const adminApi = {
    registerUser: (payload: RegisterPayload) =>
        apiRequest<AuthResponseDto>("/admin/company-user/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    createRole: (payload: RolePayload) =>
        apiRequest<RoleDto>("/admin/company-roles", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    getRoles: (params?: PaginationParamQuery) =>
        apiRequest<RolesDto>("/admin/company-roles", {
            method: "GET",
            params: params,
        }),

    getUsersByRole: (id: number) =>
        apiRequest<UserRoleDto>(`/admin/company-roles/${id}`),
    
    updateRole: (id: number, payload: RolePayload) =>
        apiRequest<RoleDto>(`/admin/company-roles/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    deleteRole: (id: number) =>
        apiRequest<string>(`/admin/company-roles/${id}`, {
            method: "DELETE",
        }),
    
    getUser: (userId: string) =>
        apiRequest<UserProfileDto>(`/admin/users/${userId}`),

    getUsers: (params?: GetUsersParams) =>
        apiRequest<UserProfileDto[]>('/admin/users', {
            method: "GET",
            params: params,
        }),
    
    updateUserStatus: (userId:string, payload: UpdateUserStatusPayload) =>
        apiRequest<UserDto>(`/admin/users/${userId}/status`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    createService: (payload: ServicePayload) =>
        apiRequest<ServiceDto>('/admin/services', {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    
    getActiveServices: (params?: GetActiveServicesParams) =>
        apiRequest<ServicesDto>('/admin/services', {
            params: params
        }),
    
    getActiveServiceById: (serviceId: string) =>
        apiRequest<ServiceDto>(`/admin/services/${serviceId}`),

    // also deactivates and activates a service
    updateServiceById: (serviceId: string, payload: UpdateServicePayload) =>
        apiRequest<ServiceDto>(`/admin/services/${serviceId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    searchAllServices: (params?: AllServicesParams) =>
        apiRequest<ServicesDto>('admin/services/all-services', {
            params: params
        }),

    deactivateServices: (payload: ActivateOrDeactivateServicesPayload) =>
        apiRequest<ActivatedOrDeactivatedServicesResponse>('admin/services/all-services', {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    getInactiveOrActiveServiceById: (serviceId: string) =>
        apiRequest<ServicesResponse>(`/admin/services/all-services/${serviceId}`),

    restoreServiceById: (serviceId: string) =>
        apiRequest<ServiceDto>(`/admin/services/all-services/${serviceId}/restore`, {
            method: "PATCH"
        }),

    restoreMultipleServices: (payload: ActivateOrDeactivateServicesPayload) =>
        apiRequest<ActivatedOrDeactivatedServicesResponse>('/admin/services/all-services/restore', {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    setMinimumPickupDays: (payload: minimumPickupdaysPayload) =>
        apiRequest<BookingSettingsDto>('/admin/booking-settings', {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    searchBookings: (params?: CompanyListBookingsQueryParam) =>
        apiRequest<ListBookingsDto>('/admin/bookings', {
            params: params
        }),

    createBooking: (payload: BookingPayload) =>
        apiRequest<BookingDto>('/admin/booking', {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    getBookingById: (bookingId: string) =>
        apiRequest<BookingDto>(`/admin/bookings/${bookingId}`),

    updateBooking: (bookingId: string, payload: UpdateBookingPayload) =>
        apiRequest<BookingDto>(`/admin/bookings/${bookingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),
    
    cancelBooking: (bookingId: string) =>
        apiRequest<string>(`/admin/bookings/cancel/${bookingId}`, {
            method: "PATCH"
        }),

    updateBookingStatus: (bookingId: string, payload: BookingStatusPayload) =>
        apiRequest<BookingDto>(`/admin/bookings-status/${bookingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    restoreBooking: (bookingId: string) =>
        apiRequest<BookingDto>(`/admin/bookings/cancel/${bookingId}/restore`, {
            method: "PATCH"
        }),

    createCalendarRow: (payload: CalendarRowPayload) =>
        apiRequest<CalendarRowWithTimeSlotsDto>('/admin/staff-calendars', {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    listCompanyUserCalendar: (params?: CalendarRowParams) =>
        apiRequest<CalendarRowWithTimeSlotsDto[]>('/admin/staff-calendars', {
            params: params
        }),

    getCalendarRowById: (calendarId: string) =>
        apiRequest<CalendarRowWithTimeSlotsDto>(`/admin/staff-calendars/${calendarId}`),

    updateCalendarRowById: (calendarId: string, payload: UpdateCalendarRowPayload) =>
        apiRequest<CalendarRowWithTimeSlotsDto>(`/admin/staff-calendars/${calendarId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),
    
    deleteCalendarRowById: (calendarId: string) =>
        apiRequest<string>(`/admin/staff-calendars/${calendarId}`, {
            method: "DELETE"
        }),

    createTimeSlot: (payload: TimeSlotPayload) =>
        apiRequest<TimeSlotsDto>('/admin/timeslots', {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    listTimeSlots: (params?: TimeSlotsParam) =>
        apiRequest<TimeSlotsDto[]>('/admin/timeslots', {
            params: params
        }),
    
    getTimeSlotById: (timeslotId: string) =>
        apiRequest<TimeSlotsDto>(`/admin/timeslots/${timeslotId}`),

    updateTimeSlotById: (timeslotId: string, payload: UpdateTimeSlotPayload) =>
        apiRequest<TimeSlotsDto>(`/admin/timeslots/${timeslotId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    deleteTimeSlotById: (timeslotId: string) =>
        apiRequest<TimeSlotsDto>(`/admin/timeslots/${timeslotId}`, {
            method: "DELETE"
        }),

    createPromoCode: (payload: PromoCodePayload) =>
        apiRequest<PromoCodeDto>('/admin/promocodes', {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    getPromoCodes: () =>
        apiRequest<PromoCodeDto[]>('/admin/promocodes'),

    getPromoCodeById: (id: string) =>
        apiRequest<PromoCodeDto>(`/admin/promocodes/${id}`),

    updatePromoCodeById: (id: string, payload: UpdatePromoCodePayload) =>
        apiRequest<PromoCodeDto>(`/api/v1/admin/promocodes/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    deactivatePromoCodeById: (id: string) =>
        apiRequest<string>(`/admin/promocodes/deactivate/${id}`, {
            method: "PATCH"
        }),
}