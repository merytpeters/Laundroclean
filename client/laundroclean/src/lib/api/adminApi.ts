import { apiRequest } from "./requests";
import { RegisterPayload } from "src/types/auth/auth";
import { AuthResponseDto } from "src/types/auth/auth.dto";
import { BookingPayload, BookingStatusPayload, CompanyListBookingsQueryParam, minimumPickupdaysPayload, UpdateBookingPayload } from "src/types/booking/booking";
import { BookingDto, BookingSettingsDto, ListBookingsDTO } from "src/types/booking/booking.dto";
import { ServiceWithServicePriceAndPromoCodes, ServiceDto, ServicesDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import { ActivateOrDeactivateServicesPayload, AllServicesParams, ActivatedOrDeactivatedServicesResponse, GetActiveServicesParams, ServicePayload, ServiceResponse, ServiceWithPromoCodesAndPriceResponse, UpdateServicePayload } from "src/types/laundrocleanServices/laundroservices";
import { RolePayload } from "src/types/roles/role";
import { RoleDto, UserRoleDto } from "src/types/roles/role.dto";
import { GetUsersParams, UpdateUserStatusPayload } from "src/types/users/user";
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

    getRoles: () =>
        apiRequest<RoleDto[]>("/admin/company-roles"),

    getUsersByRole: (id: string) =>
        apiRequest<UserRoleDto>(`/admin/company-roles/${id}`),
    
    updateRole: (id: string, payload: RolePayload) =>
        apiRequest<RoleDto>(`/admin/company-roles/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    deleteRole: (id: string) =>
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
        apiRequest<ServiceWithServicePriceAndPromoCodes>(`/admin/services/${serviceId}`),

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
        apiRequest<ServiceWithPromoCodesAndPriceResponse>(`/admin/services/all-services/${serviceId}`),

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
        apiRequest<ListBookingsDTO>('/admin/bookings', {
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
        apiRequest<BookingDto>(`/api/v1/admin/bookings-status/${bookingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    restoreBooking: (bookingId: string) =>
        apiRequest<BookingDto>(`/admin/bookings/cancel/${bookingId}/restore`, {
            method: "PATCH"
        }),
}