import type { TokenType as PrismaTokenType } from '@prisma/client';

interface TokenPayload {
   userId: string;
   token: string;
   type: PrismaTokenType;
   expiresAt: Date;
   valid?: boolean;
}

interface TokenResponse {
    token: string;
    type: PrismaTokenType;
    expiresAt: Date;
    valid: boolean;
}

export type { TokenPayload, TokenResponse };