import ServicepriceService from './serviceprice.service.js';
import asyncHandler from '../../utils/asyncHandler.js';

const companyCreateServicePriceController = asyncHandler(async (req, res) => {
	const serviceId = (req.params as any).serviceId ?? req.params.id;
	const payload = req.body;

	const newPrice = await ServicepriceService.createServicePrice(serviceId, payload);

	return res.status(201).json({
		success: true,
		message: 'Service price created successfully',
		data: {
			id: newPrice.id,
			serviceId: newPrice.serviceId,
			amount: newPrice.amount.toString(),
			currency: newPrice.currency,
			pricingType: newPrice.pricingType,
			isActive: newPrice.isActive
		}
	});
});

export default {
	companyCreateServicePriceController,
};

