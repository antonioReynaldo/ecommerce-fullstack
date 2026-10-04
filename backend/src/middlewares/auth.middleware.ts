import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import { ROLE_NAMES } from '../constants/roles.js';

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw AppError.unauthorized('No estas autenticado');
    }

    const payload = verifyAccessToken(accessToken);

    if (payload.role === ROLE_NAMES.EMPLOYEE) {
      const employee = await prisma.employee.findUnique({
        where: { userId: payload.sub },
        select: { terminatedAt: true, isActive: true }
      });

      if (!employee || !employee.isActive || employee.terminatedAt !== null) {
        throw AppError.unauthorized('Tu cuenta ha sido desactivada');
      }
    }

    req.user = payload;

    return next();
  } catch (error) {
    return next(error);
  }
};
