import asyncHandler from '../../../utils/asyncHandler.js';
import CalendarService from './calendar.service.js';
import type { TimeSlotSchema, StaffCalendarSchema } from '../../../validation/companyuser.calendar/calendar.validation.js';

const createStaffCalendarController = asyncHandler(async (req, res) => {
    const payload: StaffCalendarSchema = req.body;

    // support creating with nested timeslots
    const created = (payload as any).timeSlots
        ? await CalendarService.createStaffCalendarWithTimeSlots(req.body as any)
        : await CalendarService.createStaffCalendar({ userId: payload.userId as any, date: payload.date as any, notes: payload.notes as any } as any);

    return res.status(201).json({ success: true, data: created, message: 'Staff calendar created successfully' });
});

const listStaffCalendarsController = asyncHandler(async (req, res) => {
    const q = req.query as any;
    const params: any = {};
    if (q.userId) params.userId = q.userId;
    if (q.date) params.date = new Date(q.date);

    const data = await CalendarService.listStaffCalendars(params);
    return res.status(200).json({ success: true, data, message: 'Staff calendars retrieved successfully' });
});

const getStaffCalendarController = asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const calendar = await CalendarService.getStaffCalendar(calendarId);
    if (!calendar) return res.status(404).json({ success: false, message: 'Staff calendar not found' });
    return res.status(200).json({ success: true, data: calendar, message: 'Staff calendar retrieved successfully' });
});

const updateStaffCalendarController = asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const updated = await CalendarService.updateStaffCalendar(calendarId, req.body as any);
    return res.status(200).json({ success: true, data: updated, message: 'Staff calendar updated successfully' });
});

const deleteStaffCalendarController = asyncHandler(async (req, res) => {
    const { calendarId } = req.params;
    const isAdmin = req.user?.role?.title === 'ADMIN';
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });
    await CalendarService.deleteStaffCalendar(calendarId, Boolean(isAdmin));
    return res.status(204).send();
});

// TIMESLOTS

const createTimeSlotController = asyncHandler(async (req, res) => {
    const payload: TimeSlotSchema = req.body;
    const created = await CalendarService.createTimeSlot(payload as any);
    return res.status(201).json({ success: true, data: created, message: 'Time slot created successfully' });
});

const listTimeSlotsController = asyncHandler(async (req, res) => {
    const q = req.query as any;
    const params: any = {};
    if (q.staffCalendarId) params.staffCalendarId = q.staffCalendarId;
    const data = await CalendarService.listTimeSlots(params);
    return res.status(200).json({ success: true, data, message: 'Time slots retrieved successfully' });
});

const getTimeSlotController = asyncHandler(async (req, res) => {
    const { timeslotId } = req.params;
    const slot = await CalendarService.getTimeSlot(timeslotId, true);
    if (!slot) return res.status(404).json({ success: false, message: 'Time slot not found' });
    return res.status(200).json({ success: true, data: slot, message: 'Time slot retrieved successfully' });
});

const updateTimeSlotController = asyncHandler(async (req, res) => {
    const { timeslotId } = req.params;
    const updated = await CalendarService.updateTimeSlot(timeslotId, req.body as any);
    return res.status(200).json({ success: true, data: updated, message: 'Time slot updated successfully' });
});

const deleteTimeSlotController = asyncHandler(async (req, res) => {
    const { timeslotId } = req.params;
    const isAdmin = req.user?.role?.title === 'ADMIN';
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });
    await CalendarService.deleteTimeSlot(timeslotId, Boolean(isAdmin));
    return res.status(204).send();
});

export default {
    createStaffCalendarController,
    listStaffCalendarsController,
    getStaffCalendarController,
    updateStaffCalendarController,
    deleteStaffCalendarController,
    createTimeSlotController,
    listTimeSlotsController,
    getTimeSlotController,
    updateTimeSlotController,
    deleteTimeSlotController,
};
