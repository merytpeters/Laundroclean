import AuthUtils from '../src/modules/auth/auth.utils.js';
import config from '../src/config/config.js';
import prisma from '../src/config/prisma.js';

async function seedAdmin() {
  const ADMIN_EMAIL = config.ADMIN_EMAIL!;
  const ADMIN_PASSWORD = config.ADMIN_PASSWORD!;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
  }

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping...');
    return;
  }

  const password = await AuthUtils.hashPassword(ADMIN_PASSWORD);

  const adminRole = await prisma.companyRoleTitle.upsert({
    where: { title: 'ADMIN' },
    update: {},
    create: {
      title: 'ADMIN',
      level: config.ADMIN_ROLE_LEVEL,
      permissions: ['*'],
    },
  });

  const user = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password,
      type: 'COMPANYUSER',
      role: { connect: { id: adminRole.id } },
      isActive: true,
    },
  });

  const _profile = await prisma.profile.create({
    data: {
      userId: user.id,
      avatarUrl: null,
      phoneNumber: null,
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      postalCode: null,
      paymentMethodToken: null,
    },
   });

  console.log('Admin user created successfully');
}

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
