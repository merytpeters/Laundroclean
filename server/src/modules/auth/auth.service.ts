import prisma from '../../config/prisma.js';
import type { Prisma, User } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../middlewares/errorHandler.js';
import authUtils from './auth.utils.js';
import tokenService from '../token/token.service.js';
import { normalizeNullable } from '../../utils/object.js';

export type UserWhereInput = Prisma.UserWhereInput
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput
export type UserCreateInput = Prisma.UserCreateInput
export type UserUpdateInput = Prisma.UserUpdateInput
export type UserCreateManyInput = Prisma.UserCreateManyInput
export type UserOrderByWithRelationInput = Prisma.UserOrderByWithRelationInput

// findUser
const findUser = async (where: UserWhereUniqueInput): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where,
    });
    return user;
};

// createUser
const createUser = async (payload: UserCreateInput): Promise<User> => {
    try {
        const { profile, ...rest } = payload;
        const data: any = {
            ...rest,
            ...(profile ? { profile: { create: profile } } : {}),
        };
        return await prisma.user.create({ data });
    } catch (err: any) {
        if (err.code === 'P2002') {
            const field = err.meta?.target?.[0] || 'Field';
            throw new ConflictError(`${field} already exists`);
        }
        throw err;
    }
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
const registerUser = async (payload: any): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    // hash password
    const hashedPassword = await authUtils.hashPassword(payload.password);
    const withPassword = { ...payload, password: hashedPassword };

    // normalize nullable fields
    const normalized = normalizeNullable(withPassword, ['role', 'profile']);

    // remove undefined and null values to satisfy Prisma exactOptionalPropertyTypes
    const userCreateInput = Object.fromEntries(
        Object.entries(normalized).filter(([, value]) => value !== undefined && value !== null)
    ) as Prisma.UserCreateInput;

    const user = await createUser(userCreateInput as any);

    // generate tokens (JWT strings)
    const accessToken = tokenService.createAccessToken(user.id);
    const refreshToken = tokenService.createRefreshToken(user.id);

    return { user, accessToken, refreshToken };
};
export default {
    findUser,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
};