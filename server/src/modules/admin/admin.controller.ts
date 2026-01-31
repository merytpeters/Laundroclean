import authService from '../auth/auth.service.js';
import type { SignupSchema } from '../../validation/auth/auth.validation.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ForbiddenError } from '../../middlewares/errorHandler.js';


const companyRegister = asyncHandler(async (req, res) => {
    let newUser: SignupSchema = req.body;

    if (newUser.type === 'CLIENT') {
        throw new ForbiddenError('Clients cannot register here');
    };

    const { user: savedUser, accessToken, refreshToken } = await authService.registerUser(newUser);

    const { password: _password, ...userWithoutPassword } = savedUser;

    res.status(201).json({
        success: true,
        data: {
            user: userWithoutPassword,
            accessToken,
            refreshToken
        },
        message: 'Account created successfully'
    });
});

export default {
    companyRegister
};