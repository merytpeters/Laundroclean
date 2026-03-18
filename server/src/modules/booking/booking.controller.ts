import prisma from '../../config/prisma.js';
import asyncHandler from '../../utils/asyncHandler.js';
import type { CreateBookingSchema } from '../../validation/booking/booking.validation.js';
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

export default {
    createBookingController
};