import ServicepriceController from '../../src/modules/serviceprice/serviceprice.controller';
import prisma from '../../src/config/prisma';
import { jest } from '@jest/globals';
import type { Request, Response } from 'express';

describe('ServicePrice Controller', () => {
  let service: any;
  let next: jest.Mock;

  beforeAll(async () => {
    await prisma.servicePrice.deleteMany();
    await prisma.service.deleteMany();

    service = await prisma.service.create({
      data: { name: 'Test Service', description: 'Service for controller tests' },
    });

    next = jest.fn();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a service price for a service', async () => {
    const req = {
      params: { serviceId: service.id },
      body: { amount: '12.5', currency: 'DOLLAR', pricingType: 'FLAT_RATE' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await ServicepriceController.companyCreateServicePriceController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          serviceId: service.id,
          currency: 'DOLLAR',
          pricingType: 'FLAT_RATE',
        }),
      })
    );
  });

  it('deactivates previous active price when creating a new one', async () => {
    // create first price
    const req1 = {
      params: { serviceId: service.id },
      body: { amount: '5', currency: 'DOLLAR', pricingType: 'FLAT_RATE' },
    } as unknown as Request;

    const res1 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await ServicepriceController.companyCreateServicePriceController(req1, res1, next);
    const first = (res1.json as any).mock.calls[0][0].data;

    // create second price
    const req2 = {
      params: { serviceId: service.id },
      body: { amount: '10', currency: 'DOLLAR', pricingType: 'FLAT_RATE' },
    } as unknown as Request;

    const res2 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await ServicepriceController.companyCreateServicePriceController(req2, res2, next);
    const second = (res2.json as any).mock.calls[0][0].data;

    const actives = await prisma.servicePrice.findMany({ where: { serviceId: service.id, isActive: true } });
    expect(actives).toHaveLength(1);
    expect(actives[0].id).toBe(second.id);
    expect(actives[0].id).not.toBe(first.id);
  });

  it('calls next when service is not found', async () => {
    const req = {
      params: { serviceId: 'non-existent-service-id' },
      body: { amount: '1', currency: 'DOLLAR', pricingType: 'FLAT_RATE' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await ServicepriceController.companyCreateServicePriceController(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
