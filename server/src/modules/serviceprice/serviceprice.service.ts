import prisma from '../../config/prisma.js';
import z from 'zod';
import type { Prisma, ServicePrice } from '@prisma/client';
import { ProcessingError, NotFoundError, ValidationError } from '../../middlewares/errorHandler.js';
import type { ServicePriceSchema } from '../../validation/laundrocleanservices/services.validation.js';
import ServiceValidation from '../../validation/laundrocleanservices/services.validation.js';
import { Decimal } from '@prisma/client/runtime/library';

type ServicePriceCreateInput = Prisma.ServicePriceCreateInput;

const createServicePrice = async(
	serviceId: string,
	payload: ServicePriceSchema
): Promise<ServicePrice> => {
	try {
		const validated = ServiceValidation.servicePriceSchema.parse({ ...payload, serviceId });

		// ensure service exists
		const service = await prisma.service.findUnique({ where: { id: serviceId } });
		if (!service) throw new NotFoundError('Service not found');

		const amountValue = validated.amount instanceof Decimal ? validated.amount : new Decimal(validated.amount as any);

		const result = await prisma.$transaction(async (tx) => {
			// deactivate existing active price(s)
			await tx.servicePrice.updateMany({
				where: { serviceId, isActive: true },
				data: { isActive: false }
			});

			const data: ServicePriceCreateInput = {
				service: { connect: { id: serviceId } },
				amount: amountValue as any,
				currency: validated.currency as any,
				pricingType: validated.pricingType as any,
				isActive: true
			};

			const created = await tx.servicePrice.create({ data });
			return created;
		});

		return result;
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			throw new ValidationError(`Validation failed: ${error.issues.map((e: any) => e.message).join(', ')}`);
		}
		if (error instanceof NotFoundError) throw error;
		throw new ProcessingError(error?.message || 'Failed to create service price');
	}
};

export default {
	createServicePrice,
};

