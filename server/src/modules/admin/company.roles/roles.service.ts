import prisma from '../../../config/prisma.js';
import type { Prisma, CompanyRoleTitle } from '@prisma/client';
import type { PaginationQuery } from '../../../utils/asyncHandler.js';
import { getPagination } from '../../common/pagination/paginate.js';

type CompanyRoleTitleWhereInput = Prisma.CompanyRoleTitleWhereInput;

const createRole = async (data: { title: string; level?: number | null; permissions?: string[] | null }) => {
  const createData: any = {
    title: data.title?.toString().toUpperCase(),
    level: data.level ?? null,
  };
  if (data.permissions) {
    createData.permissions = data.permissions;
  }
  return prisma.companyRoleTitle.create({ data: createData });
};

const getRoleById = async (id: string | number) => {
  const intId = typeof id === 'string' ? Number(id) : id;
  return prisma.companyRoleTitle.findUnique({
    where: {
      id: intId
    },
    include: {
      users: {
        select: {
          id: true,
          isActive: true,
          firstName: true,
          lastName: true,
          email: true,
          profile: {
            select: {
              phoneNumber: true
            }
          },
          createdAt: true,
        }
      },
    }
  });
};

const getAllRoles = async (
  query?: PaginationQuery
) => {
  const { page, limit, skip } = getPagination(query || {});
  const search = query?.search?.trim();
  const where: CompanyRoleTitleWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
      ]
    })
  };
  const [roles, total] = await Promise.all([
    prisma.companyRoleTitle.findMany({
      where,
      skip,
      take: limit,
    }),
    prisma.companyRoleTitle.count({ where })
  ]);
  return {
    roles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const updateRole = async (id: string | number, data: Partial<{ title?: string | null; level?: number | null; permissions?: string[] | null }>) => {
  const intId = typeof id === 'string' ? Number(id) : id;
  const cleanData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value ?? null])
  );
  if ('title' in data && data.title != null) {
    cleanData.title = data.title?.toString().toUpperCase();
  }
  return prisma.companyRoleTitle.update({ where: { id: intId }, data: cleanData });
};

const deleteRole = async (id: string | number) => {
  const intId = typeof id === 'string' ? Number(id) : id;
  return prisma.companyRoleTitle.delete({ where: { id: intId } });
};

export default {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
};
