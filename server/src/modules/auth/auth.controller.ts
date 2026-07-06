import authService from './auth.service.js';
import tokenService from '../token/token.service.js';
import type { SignupSchema, LoginSchema, ResetPasswordSchema } from '../../validation/auth/auth.validation.js';
import asyncHandler from '../../utils/asyncHandler.js';
import authUtils from './auth.utils.js';
import { TokenType } from '@prisma/client';
import config from '../../config/config.js';
import ms from 'ms';


const refreshTokenCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: config.NODE_ENV === 'production',
    path: '/',
    maxAge: Number(ms(config.REFRESH_TOKEN_EXPIRES || '7d')),
};


const clientRegister = asyncHandler(async (req, res) => {
    let newUser: SignupSchema = req.body;

    if (newUser.type === 'COMPANYUSER') {
        return res.status(403).json({
            success: false,
            message: 'Company users cannot register here',
        });
    }

    const { user: savedUser, accessToken, refreshToken } = await authService.registerUser(newUser);

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(201).json({
        success: true,
        data: {
            user: savedUser,
            accessToken,
        },
        message: 'Account created successfully'
    });
});

const login = asyncHandler(async (req, res) => {
    let user: LoginSchema = req.body;

    const { authenticatedUser, accessToken, refreshToken } = await authService.loginUser({
        email: user.email,
        password: user.password,
    });

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
        success: true,
        data: {
            user: authenticatedUser,
            accessToken,
        },
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password }: ResetPasswordSchema = req.body;

    const tokenRecord = await tokenService.findToken(token);
    if (!tokenRecord || tokenRecord.expiresAt < new Date() || tokenRecord.type !== TokenType.RESET) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }

    await authService.updateUser(
        { id: tokenRecord.userId },
        { password: await authUtils.hashPassword(password), updatedAt: new Date() }
    );

    await tokenService.updateToken({ id: tokenRecord.id }, { valid: false });

    return res.status(200).json({
        success: true,
        message: 'Password successfully updated'
    });
});



export default {
    clientRegister,
    login,
    resetPassword
};