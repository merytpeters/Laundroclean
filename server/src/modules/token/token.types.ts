import type { TokenType as PrismaTokenType } from '@prisma/client';
import type { UserType, CompanyRoleTitle } from '@prisma/client';

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

interface JWTPayload {
  id: string;
  type: UserType;
  companyRoleTitle?: CompanyRoleTitle | null;
  tokenType: PrismaTokenType;
}

export type { TokenPayload, TokenResponse, JWTPayload };