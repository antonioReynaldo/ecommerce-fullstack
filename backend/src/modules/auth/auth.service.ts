import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { createSession } from '../../utils/createSession.js';
import { verifyRefreshtoken } from '../../utils/jwt.js';
import { hashToken } from '../../utils/hashToken.js';
import { assertEmployeeActive } from '../../utils/assertEmployeeActive.js';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginData = {
  email: string;
  password: string;
};

export const authService = {
  async registerService(data: RegisterData) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (existingUser) {
      throw AppError.conflict('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        authProvider: 'local',
        role: {
          connect: {
            name: 'customer'
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return user;
  },

  async loginService(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true }
    });

    if (!user || user.authProvider !== 'local' || !user.passwordHash) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    await assertEmployeeActive(user.id, user.role.name);

    return createSession(user);
  },

  async refreshAccessTokenService(refreshToken: string) {
    let decoded;

    try {
      decoded = verifyRefreshtoken(refreshToken);
    } catch (error) {
      throw AppError.unauthorized('Refresh token inválido o expirado.');
    }

    const hashRefreshToken = hashToken(refreshToken);

    const existingRefreshtoken = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashRefreshToken }
    });

    if (!existingRefreshtoken) {
      throw AppError.unauthorized('Refresh token no encontrado.');
    }

    await prisma.refreshToken.delete({
      where: { tokenHash: hashRefreshToken }
    });

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { role: true }
    });

    if (!user) {
      throw AppError.unauthorized('Sesión no valida');
    }

    await assertEmployeeActive(user.id, user.role.name);

    return createSession(user);
  },

  async logoutService(refreshToken: string) {
    const hashRefreshToken = hashToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: {
        tokenHash: hashRefreshToken
      }
    });
  },

  async getMeService(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }

    return user;
  }
};
