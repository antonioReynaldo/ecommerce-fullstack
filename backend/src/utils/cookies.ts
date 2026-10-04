import type { Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 30 * 60 * 1000 // 30 minutos
  });
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  });
};

export const clearCookies = (res: Response) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax'
  });
};
