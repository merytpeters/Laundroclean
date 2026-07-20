import { ClientUserListBookingsQueryParam, CompanyListBookingsQueryParam } from "src/types/booking/booking";

export const bookingKeys = {
    bookings: {
            all: ["bookings"] as const,
            list: (
                params: ClientUserListBookingsQueryParam | CompanyListBookingsQueryParam
            ) => ["bookings", params] as const,
            detail: (id: string) => ["booking", id] as const,
        },
}