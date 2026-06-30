export type TimeSlotPayload = {
    staffCalendarId: string;
    startTime: string;
    endTime: string;
    maxBookings: number;
    notes?: string;
}

export type CalendarRowPayload = {
    userId: string;
    date: string;
    notes?: string;
    timeSlots? : TimeSlotPayload[]
}

export type UpdateTimeSlotPayload = {
    staffCalendarId?: string;
    startTime?: string;
    endTime?: string;
    maxBookings?: number;
    notes?: string;
}

export type UpdateCalendarRowPayload = {
    userId?: string;
    date?: string;
    notes?: string;
    timeSlots? : UpdateTimeSlotPayload[]
}

export type CalendarRowParams = {
    userId?: string;
    date?: string;
}

export type TimeSlotsParam = {
    staffCalendarId?: string
}