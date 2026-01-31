import authService from './auth.service.js';
import type { SignupSchema, LoginSchema} from '../../validation/auth/auth.validation.js';
import asyncHandler from '../../utils/asyncHandler.js';


const clientRegister = asyncHandler(async (req, res) => {
    let newUser: SignupSchema = req.body;

    if (newUser.type === 'COMPANYUSER') {
        return res.status(403).json({
            success: false,
            message: 'Company users cannot register here',
        });
    }

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

const login = asyncHandler(async (req, res) => {
    let user: LoginSchema = req.body;

    const { authenticatedUser: authenticatedUser, accessToken, refreshToken } = await authService.loginUser({
        email: user.email,
        password: user.password,
    });

    res.status(200).json({
        success: true,
        data: {
            user: authenticatedUser,
            accessToken,
            refreshToken,
        },
    });
});


export default {
    clientRegister,
    login
};