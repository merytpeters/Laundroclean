import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import  { LaundrocleanservicesController } from '../../laundrocleanservices/index.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireClient());


router.get(
    '/services',
    LaundrocleanservicesController.searchActiveServices
);

router.get(
    '/services/:id',
    LaundrocleanservicesController.getActiveServiceById
);

export default router;
