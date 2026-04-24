import express from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { CompanyUserCalendarValidation } from '../../../validation/index.js';
import CalendarController from './calendar.controller.js';

const router = express.Router();

router.use(UserAuth.requireCompanyAdmin());

// Staff calendars
router.post(
	'/staff-calendars',
	validate(CompanyUserCalendarValidation.staffCalendarSchemaWithTimeSlots),
	CalendarController.createStaffCalendarController
);

router.get('/staff-calendars', CalendarController.listStaffCalendarsController);
router.get('/staff-calendars/:calendarId', CalendarController.getStaffCalendarController);
router.patch('/staff-calendars/:calendarId', validate(CompanyUserCalendarValidation.updateStaffCalendarSchema), CalendarController.updateStaffCalendarController);
router.delete('/staff-calendars/:calendarId', CalendarController.deleteStaffCalendarController);

// Time slots
router.post('/timeslots', validate(CompanyUserCalendarValidation.timeSlotSchema), CalendarController.createTimeSlotController);
router.get('/timeslots', CalendarController.listTimeSlotsController);
router.get('/timeslots/:timeslotId', CalendarController.getTimeSlotController);
router.patch('/timeslots/:timeslotId', validate(CompanyUserCalendarValidation.updateTimeSlotSchema), CalendarController.updateTimeSlotController);
router.delete('/timeslots/:timeslotId', CalendarController.deleteTimeSlotController);

export default router;