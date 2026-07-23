import z from 'zod';

const dropOffPointSchema = z.object({
    name: z.string(),
    address: z.string().min(8, 'Please input a valid address'),
});

export type DropOffPointSchema = z.infer<typeof dropOffPointSchema>

const updateDropoffPointSchema = dropOffPointSchema.partial();

export type UpdateDropoffPointSchema = z.infer<typeof updateDropoffPointSchema>

const serviceAreaSchema = z.object({
    name: z.string(),
    latMin: z.number().optional(),
    latMax: z.number().optional(),
    lngMin: z.number().optional(),
    lngMax: z.number().optional(),
});

export type ServiceAreaSchema = z.infer<typeof serviceAreaSchema>


export default {
    dropOffPointSchema,
    updateDropoffPointSchema,
    serviceAreaSchema
};