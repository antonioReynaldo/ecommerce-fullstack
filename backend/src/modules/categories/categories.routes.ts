import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeRole } from '../../middlewares/authorizeRole.middleware.js';
import {
  createCategoryController,
  getVisibleCategoriesController,
  getCategoriesTreeController,
  getCategoriesAllController,
  getCategoryBreadcrumbController,
  getCategoryByIdController,
  updateCategoryController,
  updateCategoryStatusController,
  updateCategoryImageUrlController,
  deleteCategoryController,
  createCategoryAttributeController,
  getCategoryAttributesController,
  updateCategoryAttributeController,
  deleteCategoryAttributeController
} from './categories.controller.js';

const router = Router();

// ---------- Públicas ----------
router.get('/', getVisibleCategoriesController);
router.get('/tree', getCategoriesTreeController);
router.get('/:id/breadcrumb', getCategoryBreadcrumbController);

// ---------- Solo admin (todo lo que se defina debajo queda protegido) ----------
router.use(authMiddleware, authorizeRole('admin'));

router.get('/all', getCategoriesAllController);
router.get('/:id', getCategoryByIdController);
router.post('/', createCategoryController);
router.patch('/:id', updateCategoryController);
router.patch('/:id/status', updateCategoryStatusController);
router.patch('/:id/image', updateCategoryImageUrlController);
router.delete('/:id', deleteCategoryController);

router.post('/:id/attributes', createCategoryAttributeController);
router.get('/:id/attributes', getCategoryAttributesController);
router.patch('/:id/attributes/:attributeId', updateCategoryAttributeController);
router.delete('/:id/attributes/:attributeId', deleteCategoryAttributeController);

export default router;
