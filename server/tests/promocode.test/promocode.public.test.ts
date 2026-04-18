import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Public Promocode Routes', () => {
  let service: any;

  beforeAll(async () => {
    // clean dependent tables to avoid FK constraint issues
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

    service = await prisma.service.create({ data: { name: `PublicPromoSvc_${Date.now()}`, description: 'public promo test' } });

    // create a promo for the service
    await prisma.promoCode.create({
      data: {
        code: 'SAVE20',
        serviceId: service.id,
        type: 'PERCENTAGE',
        value: 20,
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/v1/promocode/validate should validate promo and return promo data', async () => {
    const res = await request(app)
      .get('/api/v1/promocode/validate')
      .query({ serviceId: service.id, code: 'SAVE20', totalAmount: 10000 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('promo');
    expect(res.body.data.promo).toMatchObject({ code: 'SAVE20' });
  });
});

export {};
