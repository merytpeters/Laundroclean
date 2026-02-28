import prisma from "../../../config/prisma.js";

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
  return prisma.companyRoleTitle.findUnique({ where: { id: intId } });
};

const getAllRoles = async () => {
  return prisma.companyRoleTitle.findMany();
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
