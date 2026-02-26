import prisma from '../../../config/prisma.js';
import type { Prisma, Profile, User } from '@prisma/client';
import { Prisma as PrismaNamespace } from '@prisma/client';
import type { ChangePasswordSchema, ProfileSchema } from '../../../validation/profile/profile.validation.js';
import { NotFoundError, ForbiddenError, ProcessingError } from '../../../middlewares/errorHandler.js';
import { AuthUtils } from '../../auth/index.js';
import type { SessionPayload } from '../../../types/index.js';

export type ProfileCreateInput =  Prisma.ProfileCreateInput
export type ProfileWhereUniqueInput = Prisma.ProfileWhereUniqueInput
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput


const getActiveProfile = async (where: ProfileWhereUniqueInput): Promise<Profile | null> => {
  const profile = await prisma.profile.findUnique({
    where,
    include: {
      user: true,
    },
  });

  if (!profile || !profile.user || !profile.user.isActive) {
    return null;
  }

  return profile;
};


const updateProfile = async (sessionUser: SessionPayload, payload: Partial<ProfileSchema>): Promise<Profile> => {
    if (!sessionUser?.id) throw new NotFoundError('User not found');

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
    });

    if (!user) throw new NotFoundError('User not found');

    const { firstName, lastName, ...profileFields } = payload || {};
    const userUpdate: Record<string, any> = {};
    if (firstName !== undefined) userUpdate.firstName = firstName;
    if (lastName !== undefined) userUpdate.lastName = lastName;
    
    const profile = await prisma.profile.upsert({
        where: {userId: user.id},
        include: {
            user: true
        },

        update: {
            ...profileFields,
            user: {
                update: userUpdate,
            },
        },
        create: {
            ...profileFields,
            user: {
                connect: { id: user.id },
            },
        }
    });
    return profile;
};

const changePassword = async (sessionUser: SessionPayload, payload: ChangePasswordSchema): Promise<User> => {
    try {
        if (!sessionUser?.id) throw new NotFoundError('User not found');
        const dbUser = await prisma.user.findUnique({
            where: { id: sessionUser.id },
        });
        if (!dbUser) throw new NotFoundError('User not Found');

        const isValid = await AuthUtils.isPasswordValid(payload.currentPassword, dbUser.password);
        if (!isValid) throw new ForbiddenError('Old password is incorrect');

        const hashedPassword = await AuthUtils.hashPassword(payload.newPassword);

        const updatedUser = await prisma.user.update({
            where: { id: sessionUser.id},
            data: { password: hashedPassword }
        });
        return updatedUser;
    } catch (error: any) {
        throw new ProcessingError(error?.message || 'Failed to change password');
    }
};

const softDeleteAccount = async (where: UserWhereUniqueInput): Promise<void> => {
    const now = new Date();


    const relatedModels = [
        { model: 'Profile', foreignKey: 'userId' },
        { model: 'Token', foreignKey: 'userId' },
        { model: 'Notification', foreignKey: 'userId' },

    ];

    try {
        const relatedUpdates = relatedModels.map((m) =>
        (prisma as any)[m.model.toLowerCase()].updateMany({
            where: { [m.foreignKey]: (where as any).id }, 
            data: { deletedAt: now },
        })
        );

        await prisma.$transaction([
        prisma.user.update({
            where,
            data: { isActive: false },
        }),
        ...relatedUpdates,
        ]);

        const profile = await prisma.profile.findUnique({
            where: { userId: (where as any).id },
        });

        if (profile) {
            await prisma.booking.updateMany({ where: { profileId: profile.id }, data: { deletedAt: now } });
        }
    } catch (error: any) {
        if (
        error instanceof PrismaNamespace.PrismaClientKnownRequestError &&
        error.code === 'P2025'
        ) {
        throw new NotFoundError('User not found');
        }
        throw new ProcessingError(error?.message || 'Failed to delete user');
    }
};


export default {
    updateProfile,
    changePassword,
    softDeleteAccount,
    getActiveProfile
};