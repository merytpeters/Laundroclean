import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import {
    setMinimumPickupDaysService,
    adminSearchBookingService,
    adminCreateBookingService,
    adminGetBookingById,
    adminUpdateBooking,
    adminCancelBookingService,
    adminUpdateBookingStatusService,
    adminRestoreBookingService,
    clientCancelBookingService,
    clientGetBookingsService,
    clientGetBookingByIdService,
    clientCreateBookingService,
    clientUpdateBookingByIdService,
    clientUpdateBookingStatusService,
    staffCreateBookingService,
    staffUpdateBooking,
    staffGetBookingById,
    staffSearchBookingService,
    staffUpdateBookingStatusService,
    getBookingSettingsService
} from "src/services/bookingService/booking.service";

import { BookingPayload, ClientUserListBookingsQueryParam, CompanyListBookingsQueryParam, minimumPickupdaysPayload } from "src/types/booking/booking";
import { bookingKeys, bookingSettingsKeys } from "./keys";
import { toast } from "sonner";
import { ApiResponse } from "src/lib/api/requests";
import { BookingDto, BookingSettingsDto, ListBookingsDto } from "src/types/booking/booking.dto";


type CreateBookingVariable = {
    payload: BookingPayload;
}
export function useCreateBooking() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: CreateBookingVariable) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminCreateBookingService(payload);
                }
                return staffCreateBookingService(payload);
            }
            return clientCreateBookingService(payload);
        },

        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: bookingKeys.lists(),
            });
            toast.success(data?.message)
        },

        onError(error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong'
            );
        }
    });

    return mutation
}


type MinimumPickUpDaysVariable = {
    payload: minimumPickupdaysPayload
}

export function useSetMinimumPickupDays() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: MinimumPickUpDaysVariable) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return setMinimumPickupDaysService(payload);
                }
            }
        },

        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: bookingSettingsKeys.current(),
            });
            toast.success(data?.message)
        }
    });

    return mutation
}


export function useGetBookingSettings() {
    const { authUser } = useAuth();

    return useQuery<ApiResponse<BookingSettingsDto> | null>({
        queryKey: bookingSettingsKeys.current(),
        queryFn: getBookingSettingsService,
        enabled: authUser?.type === "COMPANYUSER",
    })
}


type GetBookingsVariables = {
    id?: string;
    params?: CompanyListBookingsQueryParam;
}
export function useGetbookings({
    id,
    params,
}: GetBookingsVariables) {
    const { authUser } = useAuth();

    return useQuery<ApiResponse<BookingDto | ListBookingsDto> | null>({
        queryKey: id
            ? bookingKeys.detail(id)
            : bookingKeys.list(params),
        queryFn: () => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return id ? adminGetBookingById(id) : adminSearchBookingService(params)
                }
                return id ? staffGetBookingById(id) : staffSearchBookingService(params)
            }
            return null;
        }
    });
}


type GetClientBookingsVariables = {
    id?: string;
    params?: ClientUserListBookingsQueryParam;
}
export function useGetClientbookings({
    id,
    params
}: GetClientBookingsVariables) {

    return useQuery<ApiResponse<BookingDto | ListBookingsDto> | null>({
        queryKey: id
            ? bookingKeys.detail(id)
            : bookingKeys.list(params),
        queryFn: () =>
            id ? clientGetBookingByIdService(id) : clientGetBookingsService(params)
    });
}