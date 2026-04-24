import prisma from '../../src/config/prisma';
import PromoUsageController from '../../src/modules/promocode/promousage.controller';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('PromoUsage Controller', () => {
	let service: any;
	let promo: any;
	let user: any;
	let next: jest.Mock;

	beforeAll(async () => {
		// clean dependent tables
		await prisma.bookingNotifications.deleteMany();
		await prisma.notification.deleteMany();
		await prisma.booking.deleteMany();
		await prisma.timeSlot.deleteMany();
		await prisma.staffCalendar.deleteMany();
		await prisma.servicePrice.deleteMany();
		await prisma.promoUsage.deleteMany();
		await prisma.promoCode.deleteMany();
		await prisma.service.deleteMany();
		await prisma.token.deleteMany();
		await prisma.profile.deleteMany();
		await prisma.user.deleteMany();
		await prisma.companyRoleTitle.deleteMany();

		service = await prisma.service.create({ data: { name: `PromoUsageSvc_${Date.now()}`, description: 'for promo usage tests' } });
		user = await prisma.user.create({ data: { email: `user_${Date.now()}@test.com`, password: 'pass', type: 'CLIENT' } });
		promo = await prisma.promoCode.create({ data: { code: `USAGE${Date.now()}`, serviceId: service.id, type: 'FIXED_AMOUNT', value: 100 } });

		next = jest.fn();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it('list should return usages', async () => {
		const a = await prisma.promoUsage.create({ data: { userId: user.id, promoCodeId: promo.id, timesUsed: 1 } });
		const b = await prisma.promoUsage.create({ data: { userId: user.id, promoCodeId: promo.id, timesUsed: 2 } });

		const res: any = { json: jest.fn() };
		await PromoUsageController.list({} as any, res as any, next as any);

		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.any(Array) }));
	});

	it('get should return a usage by id', async () => {
		const created = await prisma.promoUsage.create({ data: { userId: user.id, promoCodeId: promo.id, timesUsed: 1 } });
		const req: any = { params: { id: created.id } };
		const res: any = { json: jest.fn() };

		await PromoUsageController.get(req as any, res as any, next as any);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ id: created.id }) }));
	});

	it('getForUser should require query and return usage for user+promo', async () => {
		const created = await prisma.promoUsage.create({ data: { userId: user.id, promoCodeId: promo.id, timesUsed: 1 } });

		// missing query should 400
		const resBad: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		await PromoUsageController.getForUser({ query: {} } as any, resBad as any, next as any);
		expect(resBad.status).toHaveBeenCalledWith(400);

		// proper query
		const req: any = { query: { userId: user.id, promoCodeId: promo.id } };
		const res: any = { json: jest.fn() };
		await PromoUsageController.getForUser(req as any, res as any, next as any);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ userId: user.id, promoCodeId: promo.id }) }));
	});

	it('remove should delete usage', async () => {
		const created = await prisma.promoUsage.create({ data: { userId: user.id, promoCodeId: promo.id, timesUsed: 1 } });
		const req: any = { params: { id: created.id } };
		const res: any = { json: jest.fn() };

		await PromoUsageController.remove(req as any, res as any, next as any);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, message: 'Promo usage removed' }));

		const found = await prisma.promoUsage.findUnique({ where: { id: created.id } });
		expect(found).toBeNull();
	});
});

export {};

