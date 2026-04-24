import prisma from '../../config/prisma.js';
import type { PromoUsage } from '@prisma/client';

const getUsageForUser = async (userId: string, promoCodeId: string): Promise<PromoUsage | null> => {
  return prisma.promoUsage.findFirst({ where: { userId, promoCodeId } });
};

const incrementUsage = async (tx: any, userId: string, promoCodeId: string) => {
  // attempt to update existing usage row, otherwise create it
  const existing = await tx.promoUsage.findFirst({ where: { userId, promoCodeId } });
  if (existing) {
    return tx.promoUsage.update({ where: { id: existing.id }, data: { timesUsed: { increment: 1 } } });
  }
  return tx.promoUsage.create({ data: { userId, promoCodeId, timesUsed: 1 } });
};

const listUsages = async () => {
  return prisma.promoUsage.findMany({ orderBy: { createdAt: 'desc' } });
};

const getUsageById = async (id: string) => {
  return prisma.promoUsage.findUnique({ where: { id } });
};

const deleteUsage = async (id: string) => {
  await prisma.promoUsage.delete({ where: { id } });
};

export default {
  getUsageForUser,
  incrementUsage,
  listUsages,
  getUsageById,
  deleteUsage,
};
