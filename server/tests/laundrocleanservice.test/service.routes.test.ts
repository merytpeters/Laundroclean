import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma';

describe('Public Service Routes', () => {
    let activeService: any;
    let inactiveService: any;

    beforeAll(async () => {
        // clean existing services
        await prisma.service.deleteMany();

        activeService = await prisma.service.create({
            data: {
                name: 'Wash & Fold',
                description: 'Standard wash and fold service',
                isActive: true,
            }
        });

        inactiveService = await prisma.service.create({
            data: {
                name: 'Dry Clean Only',
                description: 'Dry cleaning service (inactive)',
                isActive: false,
            }
        });
    });

    afterAll(async () => {
        await prisma.service.deleteMany();
        await prisma.$disconnect();
    });

    it('GET /api/v1/services should return only active services', async () => {
        const res = await request(app).get('/api/v1/services');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);

        // only the active service should be returned
        const names = res.body.data.map((s: any) => s.name);
        expect(names).toContain('Wash & Fold');
        expect(names).not.toContain('Dry Clean Only');

        // meta.total should equal 1
        expect(res.body).toHaveProperty('meta');
        expect(res.body.meta.total).toBe(1);
    });

    it('GET /api/v1/services/:id should return active service by id', async () => {
        const res = await request(app).get(`/api/v1/services/${activeService.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id', activeService.id);
        expect(res.body.data).toHaveProperty('name', 'Wash & Fold');
    });

    it('GET /api/v1/services/:id should return 404 for inactive service (service not found wrapped)', async () => {
        const res = await request(app).get(`/api/v1/services/${inactiveService.id}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
    });
});
