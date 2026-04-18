import prisma from '../../config/prisma.js';
import type { PromoCode } from '@prisma/client';

const now = () => new Date();


const getPromoByCodeForService = async (serviceId: string, code: string): Promise<PromoCode | null> => {
  const n = now();
  const promo = await prisma.promoCode.findFirst({
    where: {
      serviceId,
      code: String(code).toUpperCase(),
      isActive: true,
      AND: [
        {
          OR: [
            { startsAt: null },
            { startsAt: { lte: n } },
          ],
        },
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: n } },
          ],
        },
      ],
    },
  });
  return promo;
};

const isPromoValid = (promo: PromoCode | null): boolean => {
  if (!promo || !promo.isActive) return false;
  const n = now();
  if (promo.startsAt && promo.startsAt > n) return false;
  if (promo.expiresAt && promo.expiresAt < n) return false;
  return true;
};

const calculateDiscount = (totalAmount: number, promo: PromoCode | null): { discount: number; finalAmount: number } => {
  if (!promo) return { discount: 0, finalAmount: totalAmount };
  const val = Number(promo.value as any);
  let discount = 0;
  if (promo.type === 'PERCENTAGE') {
    discount = +(totalAmount * (val / 100));
  } else {
    discount = Math.min(val, totalAmount);
  }
  const finalAmount = Math.max(0, +(totalAmount - discount));
  return { discount, finalAmount };
};


// CRUD
const createPromo = async (data: {
  code: string;
  description?: string | null;
  serviceId: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number | string;
  currency?: string | null;
  isActive?: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  perUserLimit?: number | null;
}) => {
  const promo = await prisma.promoCode.create({ data: {
    code: data.code.toUpperCase(),
    description: data.description ?? null,
    serviceId: data.serviceId,
    type: data.type,
    value: data.value as any,
    currency: data.currency ? (data.currency as any) : null,
    isActive: data.isActive ?? true,
    startsAt: data.startsAt ?? null,
    expiresAt: data.expiresAt ?? null,
    usageLimit: data.usageLimit ?? null,
    perUserLimit: data.perUserLimit ?? null,
  }});
  return promo;
};

const getPromos = async () => {
  return prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
};

const getPromoById = async (id: string) => {
  return prisma.promoCode.findUnique({ where: { id } });
};

const updatePromo = async (id: string, payload: any) => {
  const data = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
  if (data.code) data.code = String(data.code).toUpperCase();
  const updated = await prisma.promoCode.update({ where: { id }, data });
  return updated;
};

const deletePromo = async (id: string) => {
  // soft deactivate
  await prisma.promoCode.update({ where: { id }, data: { isActive: false, deletedAt: new Date() } });
};

export default {
  getPromoByCodeForService,
  isPromoValid,
  calculateDiscount,
  createPromo,
  getPromos,
  getPromoById,
  updatePromo,
  deletePromo,
};

