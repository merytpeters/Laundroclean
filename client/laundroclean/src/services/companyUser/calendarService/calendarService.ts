import { adminApi } from "src/lib/api/adminApi";
import { CalendarRowParams, CalendarRowPayload, TimeSlotPayload, TimeSlotsParam, UpdateCalendarRowPayload, UpdateTimeSlotPayload } from "src/types/calendar/calendar";
import { CalendarRowWithTimeSlotsDto, TimeSlotsDto } from "src/types/calendar/calendar.dto";

// admin routes
export async function adminCreateCalendarRowService (payload: CalendarRowPayload): Promise<CalendarRowWithTimeSlotsDto | null> {
    const res = await adminApi.createCalendarRow(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminListUsersCalendarService (params?: CalendarRowParams): Promise<CalendarRowWithTimeSlotsDto[] | null> {
    const res = await adminApi.listCompanyUserCalendar(params);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminGetCalendarRowByIdService (calendarId: string): Promise<CalendarRowWithTimeSlotsDto | null> {
    const res = await adminApi.getCalendarRowById(calendarId);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminUpdateCalendarRowByIdService (calendarId: string, payload: UpdateCalendarRowPayload): Promise<CalendarRowWithTimeSlotsDto | null> {
    const res = await adminApi.updateCalendarRowById(calendarId, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminDeleteCalendarRowById (calendarId: string): Promise<string | null> {
    const res = await adminApi.deleteCalendarRowById(calendarId);

    if (!res.success) return null;

    return res.message || "No content"
}

export async function adminCreateTimeSlotService (payload: TimeSlotPayload): Promise<TimeSlotsDto | null> {
    const res = await adminApi.createTimeSlot(payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminListTimeSlotsService (params?: TimeSlotsParam): Promise<TimeSlotsDto[] | null> {
    const res = await adminApi.listTimeSlots(params);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminGetTimeSlotById (timeslotId: string): Promise<TimeSlotsDto | null> {
    const res = await adminApi.getTimeSlotById(timeslotId);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminUpdateTimeSlotById (timeslotId: string, payload: UpdateTimeSlotPayload): Promise<TimeSlotsDto | null> {
    const res = await adminApi.updateTimeSlotById(timeslotId, payload);

    if (!res.success || !res.data) return null;

    return res.data
}

export async function adminDeleteTimeSlotById (timeslotId: string): Promise<string | null> {
    const res = await adminApi.deleteTimeSlotById(timeslotId);

    if (!res.success) return null;

    return res.message || "No content"
}
