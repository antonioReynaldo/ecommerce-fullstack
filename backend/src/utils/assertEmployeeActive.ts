import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';
import { ROLE_NAMES } from '../constants/roles.js';

export const assertEmployeeActive = async (userId: number, roleName: string) => {
  if (roleName !== ROLE_NAMES.EMPLOYEE) return;

  const employee = await prisma.employee.findUnique({
    where: { userId },
    select: { isActive: true, terminatedAt: true }
  });

  if (!employee || !employee.isActive || employee.terminatedAt !== null) {
    throw AppError.unauthorized('Tu cuenta ha sido desactivada');
  }
};
