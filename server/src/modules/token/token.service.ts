import prisma from '../../config/prisma.js';
import type { Prisma, Token } from '@prisma/client';
import { NotFoundError } from '../../middlewares/errorHandler.js';
import config from '../../config/config.js';
import jwt from 'jsonwebtoken';
import ms from 'ms';


export type TokenWhereUniqueInput = Prisma.TokenWhereUniqueInput
export type TokenUncheckedCreateInput = Prisma.TokenUncheckedCreateInput

const REFRESH_TOKEN_EXPIRES_MS = ms(config.REFRESH_TOKEN_EXPIRES || '7d');

const findToken = async (where: TokenWhereUniqueInput): Promise<Token | null> => {
    const token = await prisma.token.findUnique({
        where,
    });

    return token;
};

const createToken = async (data: TokenUncheckedCreateInput): Promise<Token> => {
    const token = await prisma.token.create({
        data,
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

const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRES });
};

const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (_err) {
    throw new Error('Invalid token');
  }
};


export default {
  findToken,
  createToken,
  updateToken,
  refreshToken,
  refreshTokenExpiry,
  createAccessToken,
  createRefreshToken,
  verifyToken
};