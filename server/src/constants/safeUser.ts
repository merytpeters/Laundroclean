import type { Prisma } from '@prisma/client';

// return user without password
export const safeUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  type: true,
  roleId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isActive: true,
};

type Simplify<T> = {
  [K in keyof T]: T[K];
};


export type User = Prisma.UserGetPayload<{}>;

export type SafeUser = Omit<User, 'password'>;

export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: { user: true };
}>;

export type SafeProfileWithUser = Simplify<
  Omit<ProfileWithUser, 'user'> & {
    user: Omit<ProfileWithUser['user'], 'password'>;
  }
>;
