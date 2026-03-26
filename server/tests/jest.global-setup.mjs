import { PrismaClient } from '@prisma/client';

export default async function globalSetup() {
  const prisma = new PrismaClient();
  try {
    // ensure previous test data that can cause FK constraints is cleaned
    // delete child tables first, then parents to avoid FK constraint errors
    await prisma.bookingNotifications.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();

    // service prices depend on service; delete prices before services
    await prisma.servicePrice.deleteMany();
    await prisma.service.deleteMany();

    // tokens, profiles and users — profiles may reference users and bookings
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

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
