import { jest } from '@jest/globals';

process.env.APP_NAME = process.env.APP_NAME || 'Laundroclean';
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 'test_api_key';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
process.env.RESET_TOKEN_EXPIRES = process.env.RESET_TOKEN_EXPIRES || '1h';

jest.unstable_mockModule('nunjucks', () => ({
  default: { render: jest.fn().mockReturnValue('<html/>') },
} as any));

const mockSend = jest.fn<() => Promise<{ id: string }>>().mockResolvedValue({ id: 'sent' });
jest.unstable_mockModule('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

const { default: EmailService } = await import('../../src/modules/emailService/email.service');
const nunjucks = (await import('nunjucks')).default as any;

describe('EmailService', () => {
  it('sends password reset email using Resend and rendered html', async () => {
    const svc = new EmailService();

    const result = await svc.sendPasswordResetEmail('test@example.com', 'Test', 'https://app/reset?token=abc');

    expect(mockSend).toHaveBeenCalledTimes(1);
    const arg = (mockSend as jest.Mock).mock.calls[0]?.[0] as any;
    expect(arg?.to).toBe('test@example.com');
    expect(arg?.from).toBe('laundroclean@yahoo.com');
    expect(arg?.subject).toContain(process.env.APP_NAME);
    expect(arg?.html).toBe('<html/>');
    expect(nunjucks.render).toHaveBeenCalledWith('password-reset.html', {
      firstname: 'Test',
      resetUrl: 'https://app/reset?token=abc',
    });
    expect(result).toEqual({ id: 'sent' });
  });
});
