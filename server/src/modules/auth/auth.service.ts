import prisma from '../../config/prisma.js';
import type { Prisma, User } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../middlewares/errorHandler.js';

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
        return await prisma.user.create({ data: payload });
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


export default {
    findUser,
    createUser,
    updateUser,
    deleteUser
};