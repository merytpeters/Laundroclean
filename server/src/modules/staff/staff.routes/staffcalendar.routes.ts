import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { CompanyUserCalendarValidation } from '../../../validation/index.js';
import CalendarController from '../../admin/companyuser.calendar/calendar.controller.js';
import { PERMISSIONS } from '../../../constants/permissions.js';

const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

// Staff-facing calendar endpoints (reuse admin controller)
router.post(
	'/staff-calendars',
	validate(CompanyUserCalendarValidation.staffCalendarSchemaWithTimeSlots),
	UserAuth.requirePermission(PERMISSIONS.CALENDAR.CREATE),
	CalendarController.createStaffCalendarController
);

router.get('/staff-calendars', UserAuth.allowOwnOrPermissionForCalendarList(), CalendarController.listStaffCalendarsController);

// For single calendar, allow owner to view; otherwise require permission.
router.get('/staff-calendars/:calendarId', UserAuth.allowOwnOrPermissionForCalendarById(), CalendarController.getStaffCalendarController);
router.patch(
	'/staff-calendars/:calendarId',
	validate(CompanyUserCalendarValidation.updateStaffCalendarSchema),
	UserAuth.requirePermission(PERMISSIONS.CALENDAR.UPDATE),
	CalendarController.updateStaffCalendarController
);

router.post('/timeslots', validate(CompanyUserCalendarValidation.timeSlotSchema), UserAuth.requirePermission(PERMISSIONS.TIMESLOT.CREATE), CalendarController.createTimeSlotController);
router.get('/timeslots', UserAuth.requirePermission(PERMISSIONS.TIMESLOT.VIEW), CalendarController.listTimeSlotsController);
router.get('/timeslots/:timeslotId', UserAuth.allowOwnOrPermissionForTimeslotById(), CalendarController.getTimeSlotController);
router.patch('/timeslots/:timeslotId', validate(CompanyUserCalendarValidation.updateTimeSlotSchema), UserAuth.requirePermission(PERMISSIONS.TIMESLOT.UPDATE), CalendarController.updateTimeSlotController);

export default router;
