import { jest } from '@jest/globals';
import prisma from '../../src/config/prisma';
import ServiceController from '../../src/modules/laundrocleanservices/service.controller';
import type { Request, Response } from 'express';

describe('Service Controller', () => {
    let createdService: any;
    let next: jest.Mock;

    beforeAll(async () => {
        await prisma.service.deleteMany();

        next = jest.fn();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('companyCreateServiceController', () => {
        it('should create a new service', async () => {
            const req = {
                body: {
                    name: 'Dry Cleaning',
                    description: 'Premium dry cleaning service',
                },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await ServiceController.companyCreateServiceController(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ name: 'Dry Cleaning' }),
                })
            );

            createdService = (res.json as any).mock.calls[0][0].data;
        });
    });

    describe('companyUpdateServiceController', () => {
        it('should update an existing service', async () => {
            const req = {
                params: { id: createdService.id },
                body: { name: 'Dry Cleaner', description: 'Updated description' },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await ServiceController.companyUpdateServiceController(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ name: 'Dry Cleaner' }),
                })
            );
        });
    });

    describe('getActiveServiceById', () => {
        it('should retrieve the active service by id', async () => {
            const req = { params: { id: createdService.id } } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await ServiceController.getActiveServiceById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ name: 'Dry Cleaner' }),
                })
            );
        });
    });

    describe('searchActiveServices', () => {
        it('should return active services list', async () => {
            const req = { query: {} } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await ServiceController.searchActiveServices(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.any(Array),
                })
            );
        });
    });

    describe('companyGetServiceById', () => {
        it('should retrieve inactive service for company users', async () => {
            // create a service to work with
            const createReq = { body: { name: 'Alterations', description: 'Tailoring and alterations' } } as unknown as Request;
            const createRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyCreateServiceController(createReq, createRes, next);
            const svc = (createRes.json as any).mock.calls[0][0].data;

            // soft-delete via update (set isActive false)
            const updateReq = { params: { id: svc.id }, body: { isActive: false } } as unknown as Request;
            const updateRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyUpdateServiceController(updateReq, updateRes, next);

            const req = { params: { id: svc.id } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await ServiceController.companyGetServiceById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: svc.id, isActive: false }),
                })
            );
        });
    });

    describe('companySoftDeleteServices', () => {
        it('should soft delete multiple services', async () => {
            // create two fresh services
            const c1Req = { body: { name: 'Wash & Fold', description: 'Quick wash' } } as unknown as Request;
            const c1Res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyCreateServiceController(c1Req, c1Res, next);
            const s1 = (c1Res.json as any).mock.calls[0][0].data;

            const c2Req = { body: { name: 'Steam Press', description: 'Pressing service' } } as unknown as Request;
            const c2Res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyCreateServiceController(c2Req, c2Res, next);
            const s2 = (c2Res.json as any).mock.calls[0][0].data;

            const req = { body: { ids: [s1.id, s2.id] } } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await ServiceController.companySoftDeleteServices(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ deletedCount: expect.any(Number) }),
                })
            );
        });
    });

    describe('companySearchAllServices', () => {
        it('should return all services including inactive ones', async () => {
            const req = { query: {} } as unknown as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await ServiceController.companySearchAllServices(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.any(Array),
                    meta: expect.objectContaining({ total: expect.any(Number) }),
                })
            );
        });
    });

    describe('companyRestoreService and companyRestoreManyServices', () => {
        it('should restore a single service and many services', async () => {
            // create services and soft-delete them via update
            const aReq = { body: { name: 'Temp A', description: 'A' } } as unknown as Request;
            const aRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyCreateServiceController(aReq, aRes, next);
            const a = (aRes.json as any).mock.calls[0][0].data;

            const bReq = { body: { name: 'Temp B', description: 'B' } } as unknown as Request;
            const bRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyCreateServiceController(bReq, bRes, next);
            const b = (bRes.json as any).mock.calls[0][0].data;

            // soft-delete via controller update
            const upd1 = { params: { id: a.id }, body: { isActive: false } } as unknown as Request;
            const updRes1 = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyUpdateServiceController(upd1, updRes1, next);

            const upd2 = { params: { id: b.id }, body: { isActive: false } } as unknown as Request;
            const updRes2 = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyUpdateServiceController(upd2, updRes2, next);

            // restore single
            const restoreReq = { params: { id: a.id } } as unknown as Request;
            const restoreRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyRestoreService(restoreReq, restoreRes, next);

            expect(restoreRes.status).toHaveBeenCalledWith(200);
            expect(restoreRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ id: a.id, isActive: true }),
                })
            );

            // restore many
            const manyReq = { body: { ids: [b.id] } } as unknown as Request;
            const manyRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
            await ServiceController.companyRestoreManyServices(manyReq, manyRes, next);

            expect(manyRes.status).toHaveBeenCalledWith(200);
            expect(manyRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({ count: expect.any(Number) }),
                })
            );
        });
    });
});
