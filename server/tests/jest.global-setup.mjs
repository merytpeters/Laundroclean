import { PrismaClient } from '@prisma/client';

export default async function globalSetup() {
  const prisma = new PrismaClient();
  try {
    await prisma.companyRoleTitle.upsert({
      where: { title: 'ADMIN' },
      update: { level: 10, permissions: ['*'] },
      create: { title: 'ADMIN', level: 10, permissions: ['*'] },
    });

    await prisma.companyRoleTitle.upsert({
      where: { title: 'STAFF' },
      update: { level: 8, permissions: [] },
      create: { title: 'STAFF', level: 8, permissions: [] },
    });
  } finally {
    await prisma.$disconnect();
  }
}
