// admin only booking routes
import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import BookingValidation from '../../../validation/booking/booking.validation.js';
import { BookingController } from '../../booking/index.js';
import { bookingLimiter } from '../../../middlewares/rateLimiter.js';

const router = Router();

router.use(UserAuth.requireCompanyAdmin());

router.get('/bookings', BookingController.listBookingsController);

router.post(
    '/booking',
    bookingLimiter,
    validate(BookingValidation.createBookingSchema),
    BookingController.createBookingController
);

router.patch('/booking-settings', BookingController.updateBookingSettings);

router.get('/bookings/:bookingId', BookingController.getBookingController);

router.patch(
    '/booking/:bookingId',
    validate(BookingValidation.updateBookingSchema),
    BookingController.updateBookingController
);

router.patch(
    '/bookings-status/:bookingId',
    validate(BookingValidation.updateBookingStatusSchema),
    BookingController.updateBookingStatusController
);

router.delete('/bookings/:bookingId', BookingController.cancelBookingController);

router.patch('/bookings/:bookingId/restore', BookingController.restoreBookingController);

export default router;