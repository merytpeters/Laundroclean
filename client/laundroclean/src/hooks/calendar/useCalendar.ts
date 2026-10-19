import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import {
    adminCreateCalendarRowService,
    adminUpdateCalendarRowByIdService,
    adminCreateTimeSlotService,
    adminUpdateTimeSlotById,
    adminListUsersCalendarService,
    adminListTimeSlotsService,
    adminGetTimeSlotById,
    adminGetCalendarRowByIdService,
    adminDeleteCalendarRowById,
    adminDeleteTimeSlotById,
    staffCreateCalendarRowService,
    staffUpdateCalendarRowByIdService,
    staffCreateTimeSlotService,
    staffUpdateTimeSlotById,
    staffListUsersCalendarService,
    staffListTimeSlotsService,
    staffGetCalendarRowByIdService,
    staffGetTimeSlotById
} from "src/services/companyUser/calendarService/calendarService";
import { CalendarRowPayload, TimeSlotPayload } from "src/types/calendar/calendar";
import { timeSlotKeys, calendarRowKeys } from "./keys";
import { toast } from "sonner";

type CreateCalendarRowVariable = {
    payload: CalendarRowPayload
}

export function useCreateCalendarRow() {
    const queryClient = useQueryClient();
    const { authUser } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            payload
        }: CreateCalendarRowVariable) => {
            if (authUser?.type === "COMPANYUSER") {
                if (authUser.uiRole === "ADMIN") {
                    return adminCreateCalendarRowService(payload);
                }
                return staffCreateCalendarRowService(payload);
            }
        },

        onSuccess: async(data) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: calendarRowKeys.lists()
                }),
                queryClient.invalidateQueries({
                    queryKey: timeSlotKeys.lists()
                })
            ])
            toast.success(data?.message)
        }
    });

    return mutation
}