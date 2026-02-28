import express from 'express';
import UserAuth from '../../../middlewares/auth.js';
import { RolesController } from '../index.js';
import validate from '../../../middlewares/validate.js';
import { AuthValidation } from '../../../validation/index.js';

const router = express.Router();

router.use(UserAuth.requireCompanyAdmin());

router.post('/company-roles', validate(AuthValidation.companyRoleTitle), RolesController.createRole);
router.get('/company-roles', RolesController.getRoles);
router.get('/company-roles/:id', RolesController.getRole);
router.patch('/company-roles/:id', validate(AuthValidation.companyRoleTitle), RolesController.updateRole);
router.delete('/company-roles/:id', RolesController.deleteRole);

export default router;
