import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { BookingValidation } from '../../../validation/index.js';
import { BookingController } from '../../booking/index.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireClient);

router.post(
    '/booking',
   validate(BookingValidation.createBookingSchema),
   BookingController.createBookingController
);


export default router;