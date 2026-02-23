import { EmailServices } from './index.js';
import asyncHandler from '../../utils/asyncHandler.js';
import type { ForgotPasswordSchema } from '../../validation/auth/auth.validation.js';
import authService from '../auth/auth.service.js';
import config from '../../config/config.js';
import tokenService from '../token/token.service.js';

const emailService = new EmailServices();
export default class EmailController {
    requestPasswordReset = asyncHandler(async (req, res) => {
        const { email } = req.body as ForgotPasswordSchema;

        const user = await authService.findUserByEmail(email);
                
        if (!user) {
            return res.status(404).json({
                success: true,
                message: `You do not have an account with ${config.APP_NAME}`
            });
        }
        const resetTokenRecord = await tokenService.createResetToken(user.id);
        const resetToken = resetTokenRecord.token;

        const resetUrl = `${config.CLIENT_URL}/reset-password?token=${resetToken}`;


        const userEmail = user.email;

        const firstName: string = user.firstName || userEmail?.split('@')[0] || 'there';

        await emailService.sendPasswordResetEmail(userEmail, firstName, resetUrl);

        return res.status(200).json({
            success: true,
            message: `Password reset email successfully sent ${userEmail}`
        });
    });
}