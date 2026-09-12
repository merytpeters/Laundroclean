import { Router } from 'express';
import UserAuth from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { CompanyBankAccountValidation } from '../../../validation/index.js';
import companyBankAccountController from './companybankaccount.controller.js';
import { PERMISSIONS } from '../../../constants/permissions.js';


const router = Router();

router.use(UserAuth.authenticate());
router.use(UserAuth.requireCompanyUser());

router.post(
    '/',
    validate(CompanyBankAccountValidation.companyBankAccountSchema),
    UserAuth.requirePermission(PERMISSIONS.COMPANYBANKACCOUNT.CREATE),
    companyBankAccountController.createCompanyBankAccountController
);

router.get(
    '/',
    UserAuth.requirePermission(PERMISSIONS.COMPANYBANKACCOUNT.VIEW),
    companyBankAccountController.listCompanyBankAccountsController
);

export default router;