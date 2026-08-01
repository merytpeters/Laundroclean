import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';

const mockCreatePOSDevice: any = jest.fn();
const mockGetPOSDevice: any = jest.fn();
const mockListPOSDevices: any = jest.fn();
const mockSoftDeletePosDevice: any = jest.fn();
const mockUpdatePosDevice: any = jest.fn();

const mockPosDeviceSchemaParse: any = jest.fn((input) => input);
const mockPosDeviceUpdateSchemaParse: any = jest.fn((input) => input);

(jest as any).unstable_mockModule(
	'../../src/modules/financialtransactions/devices/posDevice.service.js',
	() => ({
		default: {
			createPOSDevice: mockCreatePOSDevice,
			getPOSDevice: mockGetPOSDevice,
			listPOSDevices: mockListPOSDevices,
			softDeletePosDevice: mockSoftDeletePosDevice,
			updatePosDevice: mockUpdatePosDevice,
		},
	})
);

(jest as any).unstable_mockModule(
	'../../src/validation/index.js',
	() => ({
		PaymentValidation: {
			posDeviceSchema: {
				parse: mockPosDeviceSchemaParse,
			},
			posDeviceUpdateSchema: {
				parse: mockPosDeviceUpdateSchemaParse,
			},
		},
	})
);

const { default: POSDeviceController } = await import(
	'../../src/modules/financialtransactions/devices/posDevice.controller.js'
);

const makeRes = () => ({
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
} as unknown as Response);

describe('POS Device Controller', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createPOSDeviceController', () => {
		it('should create a POS device', async () => {
			const body = {
				name: 'Front Desk POS',
				serialNumber: 'POS-001',
			};

			mockCreatePOSDevice.mockResolvedValue({
				id: 'pos-1',
				...body,
				isActive: true,
			});

			const req = {
				body,
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.createPOSDeviceController(req, res, next);

			expect(mockPosDeviceSchemaParse).toHaveBeenCalledWith(body);
			expect(mockCreatePOSDevice).toHaveBeenCalledWith(body);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Front Desk POS POS device successfully created',
					data: expect.objectContaining({
						id: 'pos-1',
						serialNumber: 'POS-001',
					}),
				})
			);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('getPOSDeviceController', () => {
		it('should fetch a POS device by id', async () => {
			mockGetPOSDevice.mockResolvedValue({
				id: 'pos-1',
				name: 'Front Desk POS',
				serialNumber: 'POS-001',
			});

			const req = {
				params: {
					id: 'pos-1',
				},
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.getPOSDeviceController(req, res, next);

			expect(mockGetPOSDevice).toHaveBeenCalledWith('pos-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Front Desk POS POS Device retrieved successfully',
					data: expect.objectContaining({
						id: 'pos-1',
					}),
				})
			);
		});

		it('should fetch a POS device by serial number when id is missing', async () => {
			mockGetPOSDevice.mockResolvedValue({
				id: 'pos-2',
				name: 'Warehouse POS',
				serialNumber: 'POS-002',
			});

			const req = {
				params: {
					serialNumber: 'POS-002',
				},
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.getPOSDeviceController(req, res, next);

			expect(mockGetPOSDevice).toHaveBeenCalledWith('POS-002');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Warehouse POS POS Device retrieved successfully',
					data: expect.objectContaining({
						serialNumber: 'POS-002',
					}),
				})
			);
		});
	});

	describe('listPOSDevicesController', () => {
		it('should list POS devices for an admin user', async () => {
			mockListPOSDevices.mockResolvedValue({
				data: [
					{ id: 'pos-1', name: 'Front Desk POS', serialNumber: 'POS-001' },
				],
				meta: {
					total: 1,
					page: 1,
					limit: 10,
					totalPages: 1,
				},
			});

			const req = {
				query: {
					page: '1',
					limit: '10',
					search: 'Front',
					isActive: 'true',
				},
				user: {
					role: {
						title: 'ADMIN',
					},
				},
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.listPOSDevicesController(req, res, next);

			expect(mockListPOSDevices).toHaveBeenCalledWith(
				expect.objectContaining({
					page: '1',
					limit: '10',
					search: 'Front',
					isActive: 'true',
				}),
				true
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'POS Devices fetched successfully',
					data: expect.arrayContaining([
						expect.objectContaining({ id: 'pos-1' }),
					]),
					meta: expect.objectContaining({ total: 1 }),
				})
			);
		});

		it('should list only active POS devices for a non-admin user', async () => {
			mockListPOSDevices.mockResolvedValue({
				data: [],
				meta: {
					total: 0,
					page: 1,
					limit: 10,
					totalPages: 0,
				},
			});

			const req = {
				query: {},
				user: {
					role: {
						title: 'STAFF',
					},
				},
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.listPOSDevicesController(req, res, next);

			expect(mockListPOSDevices).toHaveBeenCalledWith({}, false);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'POS Devices fetched successfully',
				})
			);
		});
	});

	describe('softDeletePosDeviceController', () => {
		it('should soft delete a POS device by id', async () => {
			mockSoftDeletePosDevice.mockResolvedValue(undefined);

			const req = {
				params: {
					id: 'pos-1',
				},
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.softDeletePosDeviceController(req, res, next);

			expect(mockSoftDeletePosDevice).toHaveBeenCalledWith('pos-1');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'POS device soft deleted successfully',
				})
			);
		});
	});

	describe('updatePOSDeviceController', () => {
		it('should update a POS device', async () => {
			const body = {
				name: 'Updated POS',
				serialNumber: 'POS-001',
				isActive: true,
			};

			mockUpdatePosDevice.mockResolvedValue({
				id: 'pos-1',
				...body,
			});

			const req = {
				body,
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.updatePOSDeviceController(req, res, next);

			expect(mockPosDeviceUpdateSchemaParse).toHaveBeenCalledWith(body);
			expect(mockUpdatePosDevice).toHaveBeenCalledWith(body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Updated POS POS Device updated successfully',
					data: expect.objectContaining({
						id: 'pos-1',
					}),
				})
			);
		});
	});

	describe('restorePOSDeviceController', () => {
		it('should restore a POS device', async () => {
			const body = {
				name: 'Restored POS',
				serialNumber: 'POS-003',
				isActive: true,
			};

			mockUpdatePosDevice.mockResolvedValue({
				id: 'pos-3',
				...body,
			});

			const req = {
				body,
			} as unknown as Request;
			const res = makeRes();
			const next = jest.fn();

			await POSDeviceController.restorePOSDeviceController(req, res, next);

			expect(mockPosDeviceUpdateSchemaParse).toHaveBeenCalledWith(body);
			expect(mockUpdatePosDevice).toHaveBeenCalledWith(body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Restored POS POS Device retored successfully',
					data: expect.objectContaining({
						id: 'pos-3',
					}),
				})
			);
		});
	});
});
