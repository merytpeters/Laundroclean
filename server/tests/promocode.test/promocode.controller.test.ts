import prisma from '../../src/config/prisma';
import PromoController from '../../src/modules/promocode/promo.controller';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Promo Controller', () => {
  let service: any;
  let next: jest.Mock;

  beforeAll(async () => {
    // clean dependent tables
    await prisma.bookingNotifications.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.staffCalendar.deleteMany();
    await prisma.servicePrice.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.service.deleteMany();
    await prisma.token.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.companyRoleTitle.deleteMany();

    service = await prisma.service.create({ data: { name: `PromoSvc_${Date.now()}`, description: 'for promo tests' } });
    next = jest.fn();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('createPromo should create a promo and return 201', async () => {
    const req: any = { body: { code: 'SAVE10', serviceId: service.id, type: 'PERCENTAGE', value: 10 } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await PromoController.createPromo(req, res, next as any);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ promo: expect.objectContaining({ code: 'SAVE10' }) }) }));
  });

  it('getPromos/getPromo/updatePromo/deletePromo flow', async () => {
    // create a promo via service directly to ensure id available
    const created = await prisma.promoCode.create({ data: { code: 'TEMP', serviceId: service.id, type: 'FIXED_AMOUNT', value: 500 } });

    // getPromos
    const resList: any = { json: jest.fn() };
    await PromoController.getPromos({} as any, resList as any, next as any);
    expect(resList.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ promos: expect.any(Array) }) }));

    // getPromo
    const reqGet: any = { params: { id: created.id } };
    const resGet: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await PromoController.getPromo(reqGet, resGet, next as any);
    expect(resGet.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ promo: expect.objectContaining({ id: created.id }) }) }));

    // updatePromo
    const reqPatch: any = { params: { id: created.id }, body: { description: 'updated' } };
    const resPatch: any = { json: jest.fn() };
    await PromoController.updatePromo(reqPatch, resPatch, next as any);
    expect(resPatch.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ promo: expect.objectContaining({ description: 'updated' }) }) }));

    // deletePromo
    const reqDel: any = { params: { id: created.id } };
    const resDel: any = { json: jest.fn() };
    await PromoController.deletePromo(reqDel, resDel, next as any);
    expect(resDel.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});

export {};
