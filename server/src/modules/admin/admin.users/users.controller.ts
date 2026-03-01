import { AdminUsersService } from '../index.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import type { UserFilter } from './users.services.js';
import type { UserQuery } from '../../../utils/asyncHandler.js';
import type { Profile } from '@prisma/client';

const getProfile = asyncHandler (async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const userProfile = await AdminUsersService.getProfile({userId: userId});

    return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: userProfile
    });
});

const getUsersController = asyncHandler<Profile[]>(async (req, res) => {
    const query = req.query as unknown as UserQuery;
    const filter: UserFilter = {};

    if (query.status === 'active' || query.status === 'inactive') filter.status = query.status;
    if (query.type === 'client' || query.type === 'company') filter.type = query.type;
    if (query.search) filter.search = query.search;

    const pagination: { page?: number; limit?: number } = {};
    if (query.page !== undefined) pagination.page = query.page;
    if (query.limit !== undefined) pagination.limit = query.limit;

    const users = await AdminUsersService.getUsers(filter, { createdAt: 'asc' }, pagination);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
});

const setUserActiveStatusController = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ success: false, message: 'isActive must be boolean' });
    }

    const updatedUser = await AdminUsersService.setUserActiveStatus(userId, isActive);

    res.status(200).json({
        success: true,
        message: `User is now ${isActive ? 'active' : 'inactive'}`,
        data: updatedUser,
    });
});

export default {
    getProfile,
    getUsersController,
    setUserActiveStatusController
};