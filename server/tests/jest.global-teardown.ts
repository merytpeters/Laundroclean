import { PrismaClient } from '@prisma/client';

export default async function globalTeardown() {
  const prisma = new PrismaClient();

  try {
    await prisma.$disconnect();
  } catch {}

  try {
    // require at runtime to avoid ESM static resolution issues in Jest hooks
     
    const { closeRedis } = require('../src/middlewares/redis');
    await closeRedis();
  } catch {}
  // Ensure Jest exits (clean up any lingering handles)
   
  process.exit(0);
}

