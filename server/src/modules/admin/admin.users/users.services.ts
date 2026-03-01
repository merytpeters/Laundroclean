import prisma from '../../../config/prisma.js';
import type { Prisma } from '@prisma/client';
import { UserType } from '@prisma/client';
import { ProcessingError } from '../../../middlewares/errorHandler.js';
import type { SafeProfileWithUser } from '../../../constants/safeUser.js';
import { safeUserSelect } from '../../../constants/safeUser.js';
import { getPagination } from '../../common/pagination/paginate.js';

type ProfileWhereUniqueInput = Prisma.ProfileWhereUniqueInput
type ProfileWhereInput = Prisma.ProfileWhereInput
type ProfileOrderByWithRelationInput = Prisma.ProfileOrderByWithRelationInput
type UserWhereInput = Prisma.UserWhereInput

export interface UserFilter {
  status?: 'active' | 'inactive';
  type?: 'client' | 'company';
  search?: string;
}

// get a user's profile by id - whether active or inactive
const getProfile = async (where: ProfileWhereUniqueInput): Promise<SafeProfileWithUser | null> => {
    try{
        const profile = await prisma.profile.findUnique({
            where,
            include: {
                user: {
                    select: safeUserSelect,
                }
            }
        });
        return profile;
    } catch (error: any) {
        throw new ProcessingError(error?.message || 'Failed to fetch user');
    }
};

const buildProfileWhere = (
    filter?: UserFilter
): ProfileWhereInput | undefined => {
    if (!filter) return undefined;

    const userFilter: UserWhereInput = {};

    if (filter.status) {
        userFilter.isActive = filter.status === 'active';
    }

    if (filter.type) {
        userFilter.type =
        filter.type.toUpperCase() === 'CLIENT' ? UserType.CLIENT : UserType.COMPANYUSER;
    }

    const where: ProfileWhereInput = {};

    if (Object.keys(userFilter).length > 0) {
        where.user = userFilter;
    }

    if (filter.search) {
        where.OR = [
        { user: { firstName: { contains: filter.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filter.search, mode: 'insensitive' } } },
        ];
    }

    return where;
};

const getUsers = async (
    filter?: UserFilter,
    orderBy?: ProfileOrderByWithRelationInput,
    paginationQuery?: { page?: number; limit?: number }
): Promise<SafeProfileWithUser[]> => {
    try {
        const { skip, limit } = getPagination(paginationQuery || {});

        const where = buildProfileWhere(filter);

        const profiles = await prisma.profile.findMany({
        ...(where && { where }),
        include: { user: { select: safeUserSelect } },
        orderBy: orderBy ?? { createdAt: 'asc' },
        skip,
        take: limit,
        });

        return profiles;
    } catch (error: any) {
        throw new ProcessingError(error?.message || 'Failed to fetch users');
    }
};

export const setUserActiveStatus = async (userId: string, isActive: boolean) => {
  try {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: safeUserSelect,
    });
  } catch (error: any) {
    throw new ProcessingError(error?.message || 'Failed to update user status');
  }
};


export default {
    getProfile,
    getUsers,
    buildProfileWhere,
    setUserActiveStatus
};