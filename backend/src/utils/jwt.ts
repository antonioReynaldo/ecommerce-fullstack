import jwt from 'jsonwebtoken';
import { tokens } from '../config/tokens.js';

export type PayloadAccessToken = {
  sub: number;
  role: string;
};

export type PayloadRefreshToken = {
  sub: number;
};

export const generateAccessToken = (payload: PayloadAccessToken) => {
  return jwt.sign(payload, tokens.accessSecret, {
    expiresIn: tokens.accessTokenExpiredIn
  });
};

export const generateRefreshToken = (payload: PayloadRefreshToken) => {
  return jwt.sign(payload, tokens.refreshSecret, {
    expiresIn: tokens.refreshTokenExpiredIn
  });
};

export const verifyAccessToken = (token: string): PayloadAccessToken => {
  const payload = jwt.verify(token, tokens.accessSecret);

  if (typeof payload === 'string') {
    throw new Error('Payload del token invalido');
  }

  return payload as unknown as PayloadAccessToken;
};

export const verifyRefreshtoken = (token: string): PayloadRefreshToken => {
  const payload = jwt.verify(token, tokens.refreshSecret);

  if (typeof payload === 'string') {
    throw new Error('Payload del token invalido');
  }

  return payload as unknown as PayloadRefreshToken;
};
