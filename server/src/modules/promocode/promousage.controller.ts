import asyncHandler from '../../utils/asyncHandler.js';
import PromoUsageService from './promousage.service.js';

const list = asyncHandler(async (req, res) => {
  const data = await PromoUsageService.listUsages();
  res.json({ success: true, data });
});

const get = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = await PromoUsageService.getUsageById(id);
  res.json({ success: true, data });
});

const getForUser = asyncHandler(async (req, res) => {
  const q: any = req.query || {};
  const { userId, promoCodeId } = q;
  if (!userId || !promoCodeId) return res.status(400).json({ success: false, message: 'userId and promoCodeId are required' });

  const data = await PromoUsageService.getUsageForUser(userId, promoCodeId);
  res.json({ success: true, data });
});

const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await PromoUsageService.deleteUsage(id);
  res.json({ success: true, message: 'Promo usage removed' });
});

export default {
  list,
  get,
  getForUser,
  remove,
};
