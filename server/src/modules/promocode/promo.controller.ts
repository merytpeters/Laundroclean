import asyncHandler from '../../utils/asyncHandler.js';
import PromoService from './promo.service.js';

const validatePromo = asyncHandler(async (req, res) => {
  const q: any = req.query || {};
  const { serviceId, code, totalAmount } = q;
  if (!serviceId || !code) return res.status(400).json({ success: false, message: 'serviceId and code are required' });

  const promo = await PromoService.getPromoByCodeForService(serviceId, code);
  const valid = PromoService.isPromoValid(promo);
  let calc = { discount: 0, finalAmount: totalAmount ? Number(totalAmount) : null };
  if (valid && totalAmount) {
    calc = PromoService.calculateDiscount(Number(totalAmount), promo);
  }

  res.status(200).json({ success: true, data: { promo, valid, calculation: calc } });
});

const createPromo = asyncHandler(async (req, res) => {
  const promo = await PromoService.createPromo(req.body);
  res.status(201).json({ success: true, data: { promo }, message: 'Promo created' });
});

const getPromos = asyncHandler(async (req, res) => {
  const promos = await PromoService.getPromos();
  if (!promos) return res.status(404).json({ success: false, message: 'Promos not found' });
  res.status(200).json({ success: true, data: { promos }, message: 'Promo codes retrieved successfully' });
});

const getPromo = asyncHandler(async (req, res) => {
  const promo = await PromoService.getPromoById(req.params.id);
  if (!promo) return res.status(404).json({ success: false, message: 'Promo not found' });
  res.status(200).json({ success: true, data: { promo }, message: 'Promo code retrieved successfully' });
});

const updatePromo = asyncHandler(async (req, res) => {
  const promo = await PromoService.updatePromo(req.params.id, req.body);
  res.status(200).json({ success: true, data: { promo }, message: 'Promo updated' });
});

const softDeletePromo = asyncHandler(async (req, res) => {
  await PromoService.softDeletePromo(req.params.id);
  res.status(200).json({ success: true, message: 'Promo deleted' });
});

const restorePromo = asyncHandler(async (req, res) => {
  const restoredPromo = await PromoService.restorePromo(req.params.id);
  res.status(200).json({ success: true, data: restoredPromo, message: 'Promo code reactivated'});
});

export default {
  createPromo,
  getPromos,
  getPromo,
  updatePromo,
  softDeletePromo,
  validatePromo,
  restorePromo
};
