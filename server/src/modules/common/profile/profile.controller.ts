import { ProfileService } from '../index.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import type { ProfileSchema, ChangePasswordSchema } from '../../../validation/profile/profile.validation.js';

const getUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ 
            success: false,
            message: 'User ID is required',
        });
    }
    const profile = await ProfileService.getActiveProfile({userId: userId});

    res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile retrieved successfuly'
    });
});

const updateProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    let profile: ProfileSchema = req.body;
    if (!user) {
        return res.status(403).json({ 
            success: false,
            message: 'Forbidden',
        });
    }
    const updatedProfile = await ProfileService.updateProfile(user, profile);
    
    res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const user = req.user;

    let passwordData: ChangePasswordSchema = req.body;
    if (!user) {
        return res.status(403).json({ 
            success: false,
            message: 'Forbidden',
        });
    }

    const updatedUserInfo = await ProfileService.changePassword(user, passwordData);
    res.status(200).json({
        success: true,
        data: updatedUserInfo,
        message: 'Password updated successfully'
    });
});


const softDeleteAccount = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user?.id) {
        return res.status(403).json({ 
            success: false,
            message: 'Forbidden',
        });
    }

    await ProfileService.softDeleteAccount({id: user.id});
    res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
    });
});

export default {
    getUser,
    updateProfile,
    changePassword,
    softDeleteAccount
};