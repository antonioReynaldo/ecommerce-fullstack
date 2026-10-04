import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeRole } from '../../middlewares/authorizeRole.middleware.js';
import { createProductController, getAllProducts } from './products.controller.js';

const router = Router();
router.use(authMiddleware, authorizeRole('admin'));
router.post('/', createProductController);
router.get('/', getAllProducts);
export default router;
