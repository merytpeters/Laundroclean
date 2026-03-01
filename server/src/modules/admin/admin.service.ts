import prisma from '../../config/prisma.js';

const getAdminRole = await prisma.companyRoleTitle.findUnique({ where: { title: 'ADMIN' } });


export default {
    getAdminRole
};