import { jest } from '@jest/globals';
import config from '../../src/config/config';


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
    expect(arg?.subject).toContain(config.APP_NAME);
    expect(arg?.html).toBe('<html/>');
    expect(nunjucks.render).toHaveBeenCalledWith('password-reset.html', {
      firstname: 'Test',
      resetUrl: 'https://app/reset?token=abc',
    });
    expect(result).toEqual({ id: 'sent' });
  });
});
