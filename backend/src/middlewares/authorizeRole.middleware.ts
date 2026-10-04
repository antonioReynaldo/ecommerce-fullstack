import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('No tienes permisos para esta acción');
    }

    return next();
  };
};
