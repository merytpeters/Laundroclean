import express from 'express';
import request from 'supertest';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockCreatePOSDeviceController: any = jest.fn((req: any, res: any) =>
    res.status(201).json({ route: 'create-pos-device' })
);
const mockListPOSDevicesController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'list-pos-devices' })
);
const mockUpdatePOSDeviceController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'update-pos-device', params: req.params })
);
const mockRestorePOSDeviceController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'restore-pos-device', params: req.params })
);
const mockGetPOSDeviceController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'get-pos-device', params: req.params })
);
const mockSoftDeletePosDeviceController: any = jest.fn((req: any, res: any) =>
    res.status(200).json({ route: 'delete-pos-device', params: req.params })
);

const mockAuthenticate = jest.fn(() => (req: any, res: any, next: any) => next());
const mockRequireCompanyUser = jest.fn(() => (req: any, res: any, next: any) => next());
const mockRequirePermission = jest.fn(() => (req: any, res: any, next: any) => next());
const mockValidate = jest.fn(() => (req: any, res: any, next: any) => next());

(jest as any).unstable_mockModule(
    '../../src/modules/financialtransactions/devices/posDevice.controller.js',
    () => ({
        default: {
            createPOSDeviceController: mockCreatePOSDeviceController,
            listPOSDevicesController: mockListPOSDevicesController,
            updatePOSDeviceController: mockUpdatePOSDeviceController,
            restorePOSDeviceController: mockRestorePOSDeviceController,
            getPOSDeviceController: mockGetPOSDeviceController,
            softDeletePosDeviceController: mockSoftDeletePosDeviceController,
        },
    })
);

(jest as any).unstable_mockModule(
    '../../src/middlewares/auth.js',
    () => ({
        default: {
            authenticate: mockAuthenticate,
            requireCompanyUser: mockRequireCompanyUser,
            requirePermission: mockRequirePermission,
        },
    })
);

(jest as any).unstable_mockModule(
    '../../src/middlewares/validate.js',
    () => ({
        default: mockValidate,
    })
);

const { default: posDeviceRoutes } = await import(
    '../../src/modules/financialtransactions/devices/posDevice.routes.js'
);

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/v1/posdevices', posDeviceRoutes);
    return app;
};

describe('POS Device Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/posdevices', () => {
        it('should route to create POS device controller', async () => {
            const response = await request(buildApp())
                .post('/api/v1/posdevices')
                .send({ name: 'Front Desk POS', serialNumber: 'POS-001' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'create-pos-device',
                })
            );
            expect(mockCreatePOSDeviceController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/v1/posdevices', () => {
        it('should route to list POS devices controller', async () => {
            const response = await request(buildApp())
                .get('/api/v1/posdevices');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'list-pos-devices',
                })
            );
            expect(mockListPOSDevicesController).toHaveBeenCalledTimes(1);
        });
    });

    describe('PATCH /api/v1/posdevices', () => {
        it('should route to update POS device controller', async () => {
            const response = await request(buildApp())
                .patch('/api/v1/posdevices')
                .send({ name: 'Updated POS', serialNumber: 'POS-001', isActive: true });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'update-pos-device',
                })
            );
            expect(mockUpdatePOSDeviceController).toHaveBeenCalledTimes(1);
        });
    });

    describe('PATCH /api/v1/posdevices/restore', () => {
        it('should route to restore POS device controller', async () => {
            const response = await request(buildApp())
                .patch('/api/v1/posdevices/restore')
                .send({ name: 'Restored POS', serialNumber: 'POS-002', isActive: true });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'restore-pos-device',
                })
            );
            expect(mockRestorePOSDeviceController).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/v1/posdevices/:posDeviceId', () => {
        it('should route to get POS device controller', async () => {
            const response = await request(buildApp())
                .get('/api/v1/posdevices/POS-001');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'get-pos-device',
                    params: { posDeviceId: 'POS-001' },
                })
            );
            expect(mockGetPOSDeviceController).toHaveBeenCalledTimes(1);
        });
    });

    describe('PATCH /api/v1/posdevices/:posDeviceId', () => {
        it('should route to soft delete POS device controller', async () => {
            const response = await request(buildApp())
                .patch('/api/v1/posdevices/POS-001');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    route: 'delete-pos-device',
                    params: { posDeviceId: 'POS-001' },
                })
            );
            expect(mockSoftDeletePosDeviceController).toHaveBeenCalledTimes(1);
        });
    });
});
