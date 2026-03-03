import z from 'zod';
import { Currency, PricingType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const serviceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
});

export type ServiceSchema = z.infer<typeof serviceSchema>

const updateServiceSchema = z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    description: z.string().min(1, 'Description cannot be empty').optional(),
    isActive: z.boolean().optional()
});

export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;


const servicePriceSchema = z.object({
    serviceId: z.uuid(),
    amount: z.preprocess(
        (val) => {
            if (typeof val === 'string' || typeof val === 'number') return new Decimal(val);
        },
        z.instanceof(Decimal)
    ),
    currency: z.enum(Object.values(Currency)),
    pricingType: z.enum(Object.values(PricingType))
});

export type ServicePriceSchema  = z.infer<typeof servicePriceSchema>



export default {
    serviceSchema,
    updateServiceSchema,
    servicePriceSchema,
};