import { jest } from '@jest/globals';
import config from '../../src/config/config';


const mockFindUserByEmail = jest.fn<() => Promise<{ id: number; email: string; firstName: string } | null>>();
jest.unstable_mockModule('../../src/modules/auth/auth.service', () => ({
  default: { findUserByEmail: mockFindUserByEmail },
}));

const mockCreateResetToken = jest.fn<() => Promise<{ token: string }>>();
jest.unstable_mockModule('../../src/modules/token/token.service', () => ({
  default: { createResetToken: mockCreateResetToken },
}));

const mockSendPasswordResetEmail = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
jest.unstable_mockModule('../../src/modules/emailService/index', () => ({
  EmailServices: jest.fn().mockImplementation(() => ({ sendPasswordResetEmail: mockSendPasswordResetEmail })),
}));

const { default: EmailController } = await import('../../src/modules/emailService/email.controller');

describe('EmailController.requestPasswordReset', () => {
  beforeEach(() => {
    mockFindUserByEmail.mockReset();
    mockCreateResetToken.mockReset();
    mockSendPasswordResetEmail.mockReset();
  });

  it('returns 404 when user not found', async () => {
    mockFindUserByEmail.mockResolvedValue(null);

    const req = { body: { email: 'missing@example.com' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    const controller = new EmailController();
    await controller.requestPasswordReset(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining(config.APP_NAME as string),
      })
    );
  });

  it('creates reset token and sends email when user exists', async () => {
    const user = { id: 123, email: 'user@example.com', firstName: 'Jane' };
    mockFindUserByEmail.mockResolvedValue(user);
    mockCreateResetToken.mockResolvedValue({ token: 'reset-token-1' });

    const req = { body: { email: 'user@example.com' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    const controller = new EmailController();
    await controller.requestPasswordReset(req, res, next);

    expect(mockCreateResetToken).toHaveBeenCalledWith(user.id);
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      user.email,
      'Jane',
      `${config.CLIENT_URL}/reset-password?token=reset-token-1`
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining(user.email),
      })
    );
  });
});
