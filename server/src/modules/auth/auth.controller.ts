import authService from './auth.service.js';
import type { SignupSchema} from '../../validation/auth/auth.validation.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ValidationError } from '../../middlewares/errorHandler.js';


const register = asyncHandler(async (req, res) => {
    let newUser: SignupSchema = req.body;

    const user = await authService.findUser({ email: newUser.email });
    if (user) {
        throw new ValidationError('User with this email already exists');
    };

    const { user: savedUser, accessToken, refreshToken } = await authService.registerUser(newUser);

    res.status(201).json({
        success: true,
        data: {
            user: savedUser,
            accessToken,
            refreshToken
        },
        message: 'Account created successfully'
    });
});


export default {
    register
};