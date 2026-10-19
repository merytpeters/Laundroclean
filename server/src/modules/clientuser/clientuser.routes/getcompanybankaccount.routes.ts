import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import companyBankAccountController from '../../financialtransactions/companybankaccount/companybankaccount.controller.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireClient());

router.get(
    '/',
    companyBankAccountController.listCompanyBankAccountsController
);


router.get(
    '/:bankAccountId',
    companyBankAccountController.getCompanyBankAccountController
);
export default router;