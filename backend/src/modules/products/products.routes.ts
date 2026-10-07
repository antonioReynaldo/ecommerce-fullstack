import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeRole } from '../../middlewares/authorizeRole.middleware.js';
import { createProductController, getAllActiveProductsController, getAllProducts } from './products.controller.js';

const router = Router();
router.get('/', getAllActiveProductsController);
router.use(authMiddleware, authorizeRole('admin'));
router.post('/', createProductController);
router.get('/all', getAllProducts);
export default router;
