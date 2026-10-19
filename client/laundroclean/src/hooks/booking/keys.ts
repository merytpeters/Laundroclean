import { ClientUserListBookingsQueryParam, CompanyListBookingsQueryParam } from "src/types/booking/booking";

export const bookingKeys = {
    all: ["bookings"] as const,
    lists: () => ["bookings", "list"] as const,
    list: (
        params?: ClientUserListBookingsQueryParam | CompanyListBookingsQueryParam
    ) => ["bookings", "list", params] as const,
    detail: (id: string) => ["booking", id] as const,
}

export const bookingSettingsKeys = {
    all: ["booking-settings"] as const,
    current: () => [...bookingSettingsKeys.all, "current"] as const,
};