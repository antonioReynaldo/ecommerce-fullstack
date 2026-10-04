import type { PayloadAccessToken } from '../utils/jwt.ts';

declare global {
  namespace Express {
    interface Request {
      user: PayloadAccessToken;
    }
  }
}

export {};
