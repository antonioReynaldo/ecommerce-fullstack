import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeRole } from '../../middlewares/authorizeRole.middleware.js';
import {
  createEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deleteEmployeeController,
  getEmployeeByDocumentIdController,
  updateEmployeeStatusController,
  updateEmployeePhotoController,
  terminateEmployeeController,
  rehireEmployeeController
} from './employess.controller.js';

const router = Router();

router.post('/', authMiddleware, authorizeRole('admin'), createEmployeeController);
router.get('/', authMiddleware, authorizeRole('admin'), getAllEmployeesController);
router.get('/document/:documentId', authMiddleware, authorizeRole('admin'), getEmployeeByDocumentIdController);
router.get('/:id', authMiddleware, authorizeRole('admin'), getEmployeeByIdController);
router.patch('/:id', authMiddleware, authorizeRole('admin'), updateEmployeeController);
router.delete('/:id', authMiddleware, authorizeRole('admin'), deleteEmployeeController);
router.post('/:id/photo', authMiddleware, authorizeRole('admin'), updateEmployeePhotoController); // falta testear en insomnia
router.patch('/:id/status', authMiddleware, authorizeRole('admin'), updateEmployeeStatusController); // falta testear en insomnia
router.patch('/:id/terminate', authMiddleware, authorizeRole('admin'), terminateEmployeeController); // falta testear en insomnia
router.patch('/:id/rehire', authMiddleware, authorizeRole('admin'), rehireEmployeeController); // falta testear en insomnia

export default router;
