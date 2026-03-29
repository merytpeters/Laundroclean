import prisma from '../../config/prisma.js';
import asyncHandler from '../../utils/asyncHandler.js';
import type { CreateBookingSchema, UpdateBookingSchema, UpdateBookingStatusSchema } from '../../validation/booking/booking.validation.js';
import { BookingService } from './index.js';
import { NotFoundError } from '../../middlewares/errorHandler.js';


const createBookingController = asyncHandler (async (req, res) => {
    let clientbookingData: CreateBookingSchema = req.body;

    const { email, ...bookingData } = clientbookingData;

    let clientEmail: string | undefined;

    if (req.user?.type === 'CLIENT') {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) throw new NotFoundError('Logged-in user not found');
        clientEmail = user.email;
    } else {
        clientEmail = email;
    }

    const newBooking = await BookingService.createBooking(bookingData as any, clientEmail);

    return res.status(201).json({
        success: true,
        data: newBooking,
        message: 'Booking created successfully',
    });
});

const updateBookingController = asyncHandler(async (req, res) => {
    let bookingUpdateData: UpdateBookingSchema = req.body;

    const { bookingId } = req.params;

    const updatedBooking = await BookingService.updateBooking(bookingUpdateData, bookingId);

    return res.status(200).json({
        success: true,
        data: updatedBooking,
        message: `${updatedBooking.customBookingId} booking has been updated successfully`
    });
});

const getBookingController = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const currentUser = req.user ? { id: req.user.id, type: req.user.type } : undefined;
    const isAdmin = req.user?.role?.title === 'ADMIN';

    const booking = await BookingService.getBooking(bookingId, currentUser, Boolean(isAdmin));

    return res.status(200).json({
        success: true,
        data: booking,
        message: `${booking.customBookingId} booking has been retrieved successfully`
    });
});

const listBookingsController = asyncHandler(async (req, res) => {
    const q = req.query as any;
    const page = q.page ? Number(q.page) : undefined;
    const limit = q.limit ? Number(q.limit) : undefined;
    const status = q.status as string | undefined;
    const search = q.search as string | undefined;

    const params: { page?: number; limit?: number; status?: string; search?: string } = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    if (status !== undefined) params.status = status;
    if (search !== undefined) params.search = search;

    const currentUser = req.user ? { id: req.user.id, type: req.user.type } : undefined;
    const isAdmin = req.user?.role?.title === 'ADMIN';
    const result = await BookingService.listBookings(params, currentUser, Boolean(isAdmin));

    return res.status(200).json({
        success: true,
        ...result,
        message: 'Bookings retrieved successfully'
    });
});

const updateBookingStatusController = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const statusBody: UpdateBookingStatusSchema = req.body;

    const isAdmin = req.user?.role?.title === 'ADMIN';
    const currentUser = req.user ? { id: req.user.id, type: req.user.type } : undefined;
    const updated = await BookingService.updateBookingStatus(statusBody, bookingId, Boolean(isAdmin), currentUser);

    return res.status(200).json({
        success: true,
        data: updated,
        message: `${updated.customBookingId} booking has been updated`
    });
});

const cancelBookingController = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const isAdmin = req.user?.role?.title === 'ADMIN';

    await BookingService.softDeleteBooking(bookingId, Boolean(isAdmin));

    return res.status(204).send();
});

const restoreBookingController = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const isAdmin = req.user?.role?.title === 'ADMIN';

    const restored = await BookingService.restoreBooking(bookingId, Boolean(isAdmin));

    return res.status(200).json({
        success: true,
        data: restored,
        message: `${restored.customBookingId} booking has been restored`
    });
});

const updateBookingSettings = asyncHandler(async (req, res) => {
    try {
        const { minPickupDays } = req.body;

        const updatedSettings = await BookingService.upsertBookingSettings({ minPickupDays });

        return res.status(200).json({
            success: true,
            data: updatedSettings,
            message: 'Booking settings updated successfully'
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: `Failed to update booking settings: ${err.message}` });
    }
});

export default {
    createBookingController,
    updateBookingController,
    getBookingController,
    listBookingsController,
    updateBookingStatusController,
    cancelBookingController,
    restoreBookingController,
    updateBookingSettings
};