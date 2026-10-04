import type { SignOptions } from 'jsonwebtoken';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

// Validamos si existen dichas varaibles de entorno
if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET no esta definido');
if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET no esta definido');
if (!ACCESS_TOKEN_EXPIRES_IN) throw new Error('ACCESS_TOKEN_ESPIRED_IN no esta definido');
if (!REFRESH_TOKEN_EXPIRES_IN) throw new Error('REFRESH_TOKEN_ESPIRED_IN no esta definido');

export const tokens = {
  accessSecret: JWT_ACCESS_SECRET,
  refreshSecret: JWT_REFRESH_SECRET,
  accessTokenExpiredIn: ACCESS_TOKEN_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
  refreshTokenExpiredIn: REFRESH_TOKEN_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>
};
