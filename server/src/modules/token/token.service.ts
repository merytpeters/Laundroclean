import prisma from '../../config/prisma.js';
import type { Prisma, Token } from '@prisma/client';
import { NotFoundError } from '../../middlewares/errorHandler.js';
import config from '../../config/config.js';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import type { TokenPayload } from './token.types.js';
import { TokenType } from '@prisma/client';
import crypto from 'crypto';


export type TokenWhereUniqueInput = Prisma.TokenWhereUniqueInput
export type TokenUncheckedCreateInput = Prisma.TokenUncheckedCreateInput

const REFRESH_TOKEN_EXPIRES_MS = ms(config.REFRESH_TOKEN_EXPIRES || '7d');
const RESET_TOKEN_EXPIRES_MS = ms(config.RESET_TOKEN_EXPIRES || '60m');

const generateTokenString = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};


const findToken = async (where: TokenWhereUniqueInput): Promise<Token | null> => {
    const token = await prisma.token.findUnique({
        where,
    });

    return token;
};

const createResetToken = async (userId: string): Promise<Token> => {
    const tokenValue = generateTokenString();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
    const token = await prisma.token.create({
        data: {
          token: tokenValue,
          userId,
          expiresAt: expiresAt,
          type: TokenType.RESET
        },
    });
    return token;
};

const updateToken = async (where: TokenWhereUniqueInput, data: Prisma.TokenUpdateInput): Promise<Token> => {
    const token = await prisma.token.update({
        where,
        data,
    });
    return token;
};

export const refreshToken = async (tokenId: string): Promise<Token> => {
  const token = await prisma.token.findUnique({ where: { id: tokenId } });
  if (!token) throw new NotFoundError('Token not found');
  if (!token.valid) throw new Error('Token is invalid');
  if (token.expiresAt < new Date()) throw new Error('Token has expired');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);
  return prisma.token.update({ where: { id: tokenId }, data: { expiresAt: expiresAt } });
};


const refreshTokenExpiry = async (
  where: TokenWhereUniqueInput,
  expiresAt: Date
): Promise<Token> => {
  return prisma.token.update({
    where,
    data: { expiresAt: expiresAt },
  });
};

const createAccessToken = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const payload: any = { userId };
  if (user) {
    payload.type = user.type;

    payload.companyRoleTitle = user.role ?? null;

    payload.tokenType = TokenType.ACCESS;

  }
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRES });
};

const createRefreshToken = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const payload: any = { userId };
  if (user) {
    payload.type = user.type;
    payload.companyRoleTitle = user.role ?? null;
    payload.tokenType = TokenType.REFRESH;
  }
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (_err) {
    throw new Error('Invalid token');
  }
};

const saveRefreshToken = async (
  userId: string,
  token: string
) => {
  const payload: TokenPayload = {
    userId,
    token,
    type: TokenType.REFRESH,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    valid: true,
  };

  return prisma.token.create({ data: payload });
};


export default {
  findToken,
  createResetToken,
  updateToken,
  refreshToken,
  refreshTokenExpiry,
  createAccessToken,
  createRefreshToken,
  verifyToken,
  saveRefreshToken
};