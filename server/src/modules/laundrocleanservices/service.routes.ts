// public get all service routes for homepage or about page or service page
import { Router } from 'express';
import LaundrocleanservicesController from './service.controller.js';


const router = Router();

router.get(
    '/',
    LaundrocleanservicesController.searchActiveServices
);

router.get(
    '/:id',
    LaundrocleanservicesController.getActiveServiceById
);

export default router;