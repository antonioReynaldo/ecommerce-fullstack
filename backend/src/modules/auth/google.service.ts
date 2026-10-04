import googleOAuthClient from '../../config/google.js';
import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../lib/prisma.js';
import { assertEmployeeActive } from '../../utils/assertEmployeeActive.js';
import { createSession } from '../../utils/createSession.js';

export const googleService = {
  getAuthUrl() {
    return googleOAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile']
    });
  },

  async googleLoginService(code: string) {
    const { tokens } = await googleOAuthClient.getToken(code);

    if (!tokens.id_token) {
      throw AppError.unauthorized('No se recibió el ID token de Google');
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID no está configurado');
    }

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.name) {
      throw AppError.unauthorized('Datos de Google inválidos');
    }

    const user = await prisma.user.findUnique({
      where: { googleId: payload.sub },
      include: { role: true }
    });

    let sessionUser;

    if (user) {
      sessionUser = user;
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email }
      });

      if (existingUser) {
        if (!payload.email_verified) {
          throw AppError.unauthorized('El correo de Google no está verificado');
        }

        sessionUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId: payload.sub },
          include: { role: true }
        });
      } else {
        sessionUser = await prisma.user.create({
          data: {
            name: payload.name,
            email: payload.email,
            authProvider: 'google',
            googleId: payload.sub,
            role: { connect: { name: 'customer' } }
          },
          include: { role: true }
        });
      }
    }

    await assertEmployeeActive(sessionUser.id, sessionUser.role.name);

    return createSession(sessionUser);
  }
};
