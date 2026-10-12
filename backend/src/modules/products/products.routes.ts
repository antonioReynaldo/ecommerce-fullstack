import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeRole } from '../../middlewares/authorizeRole.middleware.js';
import {
  createProductController,
  getAllActiveProductsController,
  getAllProducts,
  getProductByIdController,
  getActiveProductByIdController,
  updateProductController
} from './products.controller.js';

const router = Router();
const adminOnly = [authMiddleware, authorizeRole('admin')];

// Admin
router.get('/all', adminOnly, getAllProducts);
router.get('/admin/:idProduct', adminOnly, getProductByIdController);
router.post('/', adminOnly, createProductController);
router.patch('/:idProduct', adminOnly, updateProductController);
// Public
router.get('/', getAllActiveProductsController);
router.get('/:idProduct', getActiveProductByIdController);

export default router;
