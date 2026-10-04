import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.schema.js';
import { authService } from './auth.service.js';

import { googleService } from './google.service.js';
import { setAccessTokenCookie, setRefreshTokenCookie, clearCookies } from '../../utils/cookies.js';
import { AppError } from '../../errors/AppError.js';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await authService.registerService(data);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const { accessToken, refreshToken, user } = await authService.loginService(data);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

export const googleAuthController = (_req: Request, res: Response) => {
  const authUrl = googleService.getAuthUrl();

  return res.redirect(authUrl);
};

export const googleCallbackController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (typeof code !== 'string') {
      throw AppError.badRequest('Código de autorización inválido');
    }

    const { accessToken, refreshToken } = await googleService.googleLoginService(code);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    if (!process.env.FRONTEND_URL) {
      throw new Error('FRONTEND_URL no esta configurado');
    }

    return res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    return next(error);
  }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getRefreshToken = req.cookies.refreshToken;

    if (!getRefreshToken) {
      throw AppError.unauthorized('El refresh token no existe');
    }

    const { accessToken, refreshToken } = await authService.refreshAccessTokenService(getRefreshToken);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Tokens renovados exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logoutService(refreshToken);
    }

    clearCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada'
    });
  } catch (error) {
    return next(error);
  }
};

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.sub;

    const user = await authService.getMeService(userId);

    return res.status(200).json({
      success: true,
      message: 'Usuario obtenido correctamente',
      data: user
    });
  } catch (error) {
    return next(error);
  }
};
