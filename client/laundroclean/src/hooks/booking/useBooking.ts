import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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