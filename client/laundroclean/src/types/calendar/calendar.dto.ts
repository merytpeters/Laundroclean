export type CalendarRowDto = {
    id: string;
    userId: string;
    date: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}


export type TimeSlotsDto = {
    id: string;
    staffCalendarId: string;
    startTime: string;
    endTime: string;
    maxBookings: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
};

type timeSlots = {
    timeSlots?: TimeSlotsDto[]
} 

export type CalendarRowWithTimeSlotsDto = CalendarRowDto & timeSlots