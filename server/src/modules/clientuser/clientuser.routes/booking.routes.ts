import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { BookingValidation } from '../../../validation/index.js';
import { BookingController } from '../../booking/index.js';
import { bookingLimiter } from '../../../middlewares/rateLimiter.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireClient());

router.post(
    '/booking',
   bookingLimiter,
   validate(BookingValidation.createBookingSchema),
   BookingController.createBookingController
);

router.get('/bookings', BookingController.listBookingsController);

router.patch(
    '/bookings/:bookingId',
    validate(BookingValidation.updateBookingSchema),
    BookingController.updateBookingController
);

router.get('/bookings/:bookingId', BookingController.getBookingController);

router.patch(
    '/bookings-status/:bookingId',
    validate(BookingValidation.updateBookingStatusSchema),
    BookingController.updateBookingStatusController
);

router.delete('/bookings/:bookingId', BookingController.cancelBookingController);

export default router;