import { Router } from 'express';
import {
  registerController,
  loginController,
  googleAuthController,
  googleCallbackController,
  refreshTokenController,
  logoutController,
  getMeController
} from './auth.controller.js';

import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/google', googleAuthController);
router.get('/google/callback', googleCallbackController);
router.post('/refresh', refreshTokenController);
router.post('/logout', logoutController);
router.get('/me', authMiddleware, getMeController);

export default router;
