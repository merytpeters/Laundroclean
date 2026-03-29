import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { BookingValidation } from '../../../validation/index.js';
import { BookingController } from '../../booking/index.js';
import { PERMISSIONS } from '../../../constants/permissions.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

router.post(
    '/booking',
   validate(BookingValidation.createBookingSchema),
   UserAuth.requirePermission(PERMISSIONS.BOOKING.CREATE),
   BookingController.createBookingController
);

router.get(
    '/bookings',
    UserAuth.requirePermission(PERMISSIONS.BOOKING.VIEW),
    BookingController.listBookingsController
);

router.patch(
    '/bookings/:bookingId',
    validate(BookingValidation.updateBookingSchema),
    UserAuth.requirePermission(PERMISSIONS.BOOKING.UPDATE),
    BookingController.updateBookingController
);

router.get(
    '/bookings/:bookingId',
    UserAuth.requirePermission(PERMISSIONS.BOOKING.VIEW),
    BookingController.getBookingController);

router.patch(
    '/bookings-status/:bookingId',
    validate(BookingValidation.updateBookingStatusSchema),
    UserAuth.requirePermission(PERMISSIONS.BOOKING.UPDATESTATUS),
    BookingController.updateBookingStatusController
);


export default router;