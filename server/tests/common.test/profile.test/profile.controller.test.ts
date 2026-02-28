import { jest } from '@jest/globals';
import { ProfileController, ProfileService } from '../../../src/modules/common';

describe('Profile Controller (unit)', () => {
  it('updates profile', async () => {
    const req = {
      user: { id: 1 },
      body: { phoneNumber: '123' }
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;

    const next = jest.fn();

    jest.spyOn(ProfileService, 'updateProfile')
      .mockResolvedValue({
        id: 'test-id',
        userId: '1',
        phoneNumber: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        avatarUrl: null,
        avatarPublicId: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        postalCode: null,
        paymentMethodToken: null,
      });

    await ProfileController.updateProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});

