import { CalendarRowParams, TimeSlotsParam } from "src/types/calendar/calendar"

export const calendarRowKeys = {
    all: ["calendarRows"] as const,
    lists: () => ["calendarRows", "list"] as const,

    list: (
        params?: CalendarRowParams
    ) => ["calendarRows", "list", params] as const,

    detail: (id: string) => ["calendarRow", id] as const
}

export const timeSlotKeys = {
    all: ["timeslots"] as const,

    lists: () => ["timeslots", "list"] as const,

    list: (
        params?: TimeSlotsParam
    ) => ["timeslots", "list", params] as const,

    detail: (id: string) => ["timeslot", id] as const
}