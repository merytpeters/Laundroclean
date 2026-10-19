import prisma from '../../config/prisma.js';
import { Prisma } from '@prisma/client';
import { type User, type Profile, TokenType } from '@prisma/client';
import { NotFoundError, ConflictError, ValidationError, UnauthenticatedError } from '../../middlewares/errorHandler.js';
import authUtils from './auth.utils.js';
import tokenService from '../token/token.service.js';
import type { SignupSchema } from '../../validation/auth/auth.validation.js';
import config from '../../config/config.js';
import ms from 'ms';

const REFRESH_TOKEN_EXPIRES_MS = ms(config.REFRESH_TOKEN_EXPIRES || '7d');

export type UserWhereInput = Prisma.UserWhereInput
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput
export type UserCreateInput = Prisma.UserCreateInput
export type UserUpdateInput = Prisma.UserUpdateInput
export type UserCreateManyInput = Prisma.UserCreateManyInput
export type UserOrderByWithRelationInput = Prisma.UserOrderByWithRelationInput
export type jayagdu = Prisma.CompanyRoleTitleCreateNestedOneWithoutUsersInput;

// findUser
const findUser = async (where: UserWhereUniqueInput): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where,
        include: {
            role: true,
        },
    });
    if (!user) return null;
    return user;
};


// UpdateUser
const updateUser = async (where: UserWhereUniqueInput, payload: UserUpdateInput): Promise<User> => {
    const user = await findUser(where);
    if (!user) throw new NotFoundError('User not found');
    return await prisma.user.update({
        where,
        data: payload,
    });
};

// DeleteUser
const deleteUser = async (where: UserWhereUniqueInput): Promise<User> => {
    const user = await findUser(where);
    if (!user) throw new NotFoundError('User not found');
    return prisma.user.update({
        where,
        data: { deletedAt: new Date() },
    });
};


// registerUser: orchestrates createUser + token generation
const registerUser = async (
    payload: SignupSchema
): Promise<{ user: Omit<User, 'password'>; profile: Profile; accessToken: string; refreshToken: string }> => {

    const existingUser = await findUser({ email: payload.email });
    if (existingUser) {
        throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await authUtils.hashPassword(payload.password);

    const parts = payload.name?.trim().split(' ');

    const user = await prisma.user.create({
        data: {
            email: payload.email,
            password: hashedPassword,
            type: payload.type,
            ...(payload.role?.title ? { 
                role: { 
                    connectOrCreate: {
                        where: {
                            title: payload.role.title.toUpperCase(),
                        },
                        create: {
                            title: payload.role.title,
                            permissions: payload.role.permissions ?? [],
                        }
                    }
                } } : {}),
            ...(parts && {
                firstName: parts[0],
                lastName: parts.slice(1).join(' ') || null,
            }),
        },
        include: {
            role: true,
        },
    });

    const profile = await prisma.profile.create({
        data: {
            userId: user.id,
            avatarUrl: null,
            phoneNumber: null,
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            postalCode: null,
            paymentMethodToken: null,
        },
    });

    const accessToken = await tokenService.createAccessToken(user.id);
    const refreshToken = await tokenService.createRefreshToken(user.id);
    await tokenService.saveRefreshToken(user.id, refreshToken);

    const { password: _password, ...safeUser } = user;

    return { user: safeUser, profile, accessToken, refreshToken };
};


const loginUser = async (payload: any): Promise<{ authenticatedUser: Omit<User, 'password'>; accessToken: string; refreshToken: string }> => {
    const authenticatedUser = await findUser({ email: payload.email });
    if (!authenticatedUser) throw new NotFoundError('Invalid email or password');

    const isValid = await authUtils.isPasswordValid(payload.password, authenticatedUser.password);
    if (!isValid) throw new NotFoundError('Invalid email or password');

    const accessToken = await tokenService.createAccessToken(authenticatedUser.id);
    const refreshToken = await tokenService.createRefreshToken(authenticatedUser.id);

    await tokenService.saveRefreshToken(authenticatedUser.id, refreshToken);

    const { password: _password, ...safeUser } = authenticatedUser;

    return { authenticatedUser: safeUser, accessToken, refreshToken };
};

const findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return user;
};

const logoutUser = async (userId: string): Promise<string> => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            tokens: {
                deleteMany: {
                    type: TokenType.REFRESH
                }
            }
        }
    });
    const message = 'Logged out successfully';
    return message;
};

const refreshSession = async (
    incomingRefreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    let payload;
    try {
        payload = tokenService.verifyToken(incomingRefreshToken);
    } catch (_err) {
        throw new UnauthenticatedError('Invalid refresh token');
    }

    if (payload.tokenType !== TokenType.REFRESH) {
        throw new UnauthenticatedError('Invalid refresh token type');
    }

    const storedToken = await prisma.token.findUnique({
        where: { token: incomingRefreshToken },
        include: { user: { include: { role: true } } },
    });

    if (!storedToken || storedToken.type !== TokenType.REFRESH || !storedToken.valid) {
        throw new UnauthenticatedError('Refresh token not recognized');
    }

    if (storedToken.expiresAt < new Date()) {
        await prisma.token.update({
            where: { id: storedToken.id },
            data: { valid: false },
        });
        throw new UnauthenticatedError('Refresh token has expired');
    }

    if (storedToken.userId !== payload.id) {
        throw new UnauthenticatedError('Invalid refresh token subject');
    }

    if (!storedToken.user || !storedToken.user.isActive) {
        throw new UnauthenticatedError('User account is inactive');
    }

    const newAccessToken = await tokenService.createAccessToken(storedToken.userId);
    const newRefreshToken = await tokenService.createRefreshToken(storedToken.userId);

    await prisma.$transaction([
        prisma.token.update({
            where: { id: storedToken.id },
            data: { valid: false },
        }),
        prisma.token.create({
            data: {
                userId: storedToken.userId,
                token: newRefreshToken,
                type: TokenType.REFRESH,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
                valid: true,
            },
        }),
    ]);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};


export default {
    findUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    findUserByEmail,
    logoutUser,
    refreshSession
};