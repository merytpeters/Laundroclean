import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function globalSetup() {
  try {
    // ensure previous test data that can cause FK constraints is cleaned
    // delete child tables first, then parents to avoid FK constraint errors
    await prisma.bookingNotifications.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();

    // delete timeslots and staff calendars before users to avoid FK constraint
    await prisma.timeSlot.deleteMany();
    await prisma.staffCalendar.deleteMany();

    // service prices depend on service; delete prices before services
    await prisma.servicePrice.deleteMany();
    await prisma.service.deleteMany();

    // tokens, profiles and users — profiles may reference users and bookings
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    await prisma.companyRoleTitle.deleteMany();

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
