import { generateAccessToken, generateRefreshToken } from './jwt.js';
import { hashToken } from './hashToken.js';
import { prisma } from '../lib/prisma.js';

type UserType = {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
};

export const createSession = async (user: UserType) => {
  const payloadAccessToken = {
    sub: user.id,
    role: user.role.name
  };

  const payloadRefreshToken = {
    sub: user.id
  };

  const accessToken = generateAccessToken(payloadAccessToken);
  const refreshToken = generateRefreshToken(payloadRefreshToken);

  const hashRefreshToken = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    }
  };
};
