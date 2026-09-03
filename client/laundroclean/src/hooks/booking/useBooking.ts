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
    staffUpdateBookingStatusService
} from "src/services/bookingService/booking.service";

import { BookingPayload, minimumPickupdaysPayload } from "src/types/booking/booking";
import { bookingKeys } from "./keys";
import { toast } from "sonner";


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
                queryKey: bookingKeys.lists(),
            });
            toast.success(data?.message)
        }
    });

    return mutation
}


// useGetbookings