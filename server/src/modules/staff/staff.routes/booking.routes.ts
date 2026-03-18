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


export default router;