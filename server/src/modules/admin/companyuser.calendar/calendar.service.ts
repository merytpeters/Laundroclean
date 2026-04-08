import prisma from '../../../config/prisma.js';
import type { Prisma, StaffCalendar, TimeSlot } from '@prisma/client';
import { NotFoundError, ProcessingError, ForbiddenError } from '../../../middlewares/errorHandler.js';
import { Prisma as PrismaNamespace } from '@prisma/client';

// CRUD for timeslot and staff calendar

type StaffCalendarWhereUnique = Prisma.StaffCalendarWhereUniqueInput;
type TimeSlotWhereUnique = Prisma.TimeSlotWhereUniqueInput;
type StaffCalendarCreateInput = Prisma.StaffCalendarCreateInput;
type TimeSlotCreateManyStaffCalendarInput = Prisma.TimeSlotCreateManyStaffCalendarInput;
type StaffCalendarUpdateInput = Prisma.StaffCalendarUpdateInput;
type TimeSlotCreateInput = Prisma.TimeSlotCreateInput;
type TimeSlotUpdateInput = Prisma.TimeSlotUpdateInput;

const normalizeWhere = (where: any) => {
	if (!where) return {} as any;
	if (typeof where === 'string') return { id: where };
	return where;
};

// STAFF CALENDAR

const createStaffCalendar = async (data: StaffCalendarCreateInput): Promise<StaffCalendar> => {
	try {
		const payload = { ...data } as StaffCalendarCreateInput;
		const created = await prisma.staffCalendar.create({ data: payload });
		return created;
	} catch (error: any) {
		console.error('createStaffCalendar error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to create staff calendar');
	}
};

const createStaffCalendarWithTimeSlots = async (data: StaffCalendarCreateInput & { timeSlots?: TimeSlotCreateManyStaffCalendarInput[] }): Promise<StaffCalendar> => {
	try {
		// if nested timeslots passed as createMany style, transform to nested create
		const timeSlots = (data as any).timeSlots;
		const payload: any = { user: (data as any).user ?? undefined, date: (data as any).date, notes: (data as any).notes };
		if (timeSlots && Array.isArray(timeSlots)) {
			payload.timeSlots = { create: timeSlots };
		}
		if ((data as any).userId) {
			payload.user = { connect: { id: (data as any).userId } };
		}
		const created = await prisma.staffCalendar.create({ data: payload, include: { timeSlots: true } });
		return created;
	} catch (error: any) {
		console.error('createStaffCalendarWithTimeSlots error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to create staff calendar with timeslots');
	}
};

const getStaffCalendar = async (where: StaffCalendarWhereUnique, includeTimeSlots: boolean = true): Promise<StaffCalendar | null> => {
	const whereObj = normalizeWhere(where);
	const calendar = await prisma.staffCalendar.findUnique({
		where: whereObj,
		...(includeTimeSlots ? { include: { timeSlots: true } } : {}),
	});
	return calendar;
};

const listStaffCalendars = async (params: { userId?: string; date?: Date } = {}) => {
	const where: any = {};
	if (params.userId) where.userId = params.userId;
	if (params.date) where.date = params.date;
	const data = await prisma.staffCalendar.findMany({ where, include: { timeSlots: true }, orderBy: { date: 'asc' } });
	return data;
};

const updateStaffCalendar = async (where: StaffCalendarWhereUnique | string, data: Partial<StaffCalendarUpdateInput>): Promise<StaffCalendar> => {
	const whereObj = normalizeWhere(where);
	try {
		const updated = await prisma.staffCalendar.update({ where: whereObj, data });
		return updated;
	} catch (error: any) {
		if (error instanceof PrismaNamespace.PrismaClientKnownRequestError && error.code === 'P2025') {
			throw new NotFoundError('Staff calendar not found');
		}
		console.error('updateStaffCalendar error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to update staff calendar');
	}
};

const deleteStaffCalendar = async (where: StaffCalendarWhereUnique | string, isAdmin = false): Promise<void> => {
	if (!isAdmin) throw new ForbiddenError('Only admin users may delete staff calendars');
	const whereObj = normalizeWhere(where);
	try {
		// delete timeslots first to avoid foreign key constraints
		const calendar = await prisma.staffCalendar.findUnique({ where: whereObj });
		if (!calendar) throw new NotFoundError('Staff calendar not found');

		await prisma.timeSlot.deleteMany({ where: { staffCalendarId: calendar.id } });
		await prisma.staffCalendar.delete({ where: whereObj });
	} catch (error: any) {
		if (error instanceof PrismaNamespace.PrismaClientKnownRequestError && error.code === 'P2025') {
			throw new NotFoundError('Staff calendar not found');
		}
		console.error('deleteStaffCalendar error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to delete staff calendar');
	}
};

// TIMESLOTS

const createTimeSlot = async (data: TimeSlotCreateInput): Promise<TimeSlot> => {
	try {
		const created = await prisma.timeSlot.create({ data });
		return created;
	} catch (error: any) {
		console.error('createTimeSlot error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to create time slot');
	}
};

const getTimeSlot = async (where: TimeSlotWhereUnique, includeBookings = false): Promise<TimeSlot | null> => {
	const whereObj = normalizeWhere(where);
	const slot = await prisma.timeSlot.findUnique({ where: whereObj, include: includeBookings ? { bookings: true, staffCalendar: true } : { staffCalendar: true } });
	return slot;
};

const listTimeSlots = async (params: { staffCalendarId?: string; date?: Date } = {}) => {
	const where: any = {};
	if (params.staffCalendarId) where.staffCalendarId = params.staffCalendarId;
	const data = await prisma.timeSlot.findMany({ where, orderBy: { startTime: 'asc' } });
	return data;
};

const updateTimeSlot = async (where: TimeSlotWhereUnique | string, data: Partial<TimeSlotUpdateInput>): Promise<TimeSlot> => {
	const whereObj = normalizeWhere(where);
	try {
		const updated = await prisma.timeSlot.update({ where: whereObj, data });
		return updated;
	} catch (error: any) {
		if (error instanceof PrismaNamespace.PrismaClientKnownRequestError && error.code === 'P2025') {
			throw new NotFoundError('Time slot not found');
		}
		console.error('updateTimeSlot error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to update time slot');
	}
};

const deleteTimeSlot = async (where: TimeSlotWhereUnique | string, isAdmin = false): Promise<void> => {
	if (!isAdmin) throw new ForbiddenError('Only admin users may delete time slots');
	const whereObj = normalizeWhere(where);
	try {
		await prisma.timeSlot.delete({ where: whereObj });
	} catch (error: any) {
		if (error instanceof PrismaNamespace.PrismaClientKnownRequestError && error.code === 'P2025') {
			throw new NotFoundError('Time slot not found');
		}
		console.error('deleteTimeSlot error:', error?.message ?? error);
		throw new ProcessingError(error?.message || 'Failed to delete time slot');
	}
};

export default {
	createStaffCalendar,
	createStaffCalendarWithTimeSlots,
	getStaffCalendar,
	listStaffCalendars,
	updateStaffCalendar,
	deleteStaffCalendar,
	createTimeSlot,
	getTimeSlot,
	listTimeSlots,
	updateTimeSlot,
	deleteTimeSlot,
};