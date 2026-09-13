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

router.get(
    '/:bankAccountId',
    UserAuth.requirePermission(PERMISSIONS.COMPANYBANKACCOUNT.VIEW),
    companyBankAccountController.getCompanyBankAccountController
);

router.patch(
    '/:bankAccountId',
    validate(CompanyBankAccountValidation.updateCompanyBankAccountSchema),
    UserAuth.requirePermission(PERMISSIONS.COMPANYBANKACCOUNT.UPDATE),
    companyBankAccountController.getCompanyBankAccountController
);

export default router;