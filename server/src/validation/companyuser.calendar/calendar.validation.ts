import z from 'zod';

const timeSlotSchema = z.object({
    staffCalendarId: z.uuid(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    maxBookings: z.int(),
    notes: z.string().optional(),
});

export type TimeSlotSchema = z.infer<typeof timeSlotSchema>

const updateTimeSlotSchema = timeSlotSchema.partial();

export type UpdateTimeSlotSchema = z.infer<typeof updateTimeSlotSchema>

const staffCalendarSchema = z.object({
    userId: z.uuid(),
    date: z.coerce.date(),
    notes: z.string().optional(),
});

export type StaffCalendarSchema = z.infer<typeof staffCalendarSchema>

const updateStaffCalendarSchema = staffCalendarSchema.partial();

export type UpdateStaffCalendarSchema = z.infer<typeof updateStaffCalendarSchema>

const staffCalendarSchemaWithTimeSlots = staffCalendarSchema.extend({
    timeSlots: z.array(timeSlotSchema).optional()
});

export type StaffCalendarSchemaWithTimeSlots = z.infer<typeof staffCalendarSchemaWithTimeSlots>

const updateStaffCalendarSchemaWithTimeSlots = staffCalendarSchemaWithTimeSlots.partial();

export type UpdateStaffCalendarSchemaWithTimeSlots = z.infer<typeof updateStaffCalendarSchemaWithTimeSlots>

export default {
    timeSlotSchema,
    updateTimeSlotSchema,
    staffCalendarSchema,
    updateStaffCalendarSchema,
    staffCalendarSchemaWithTimeSlots,
    updateStaffCalendarSchemaWithTimeSlots
};