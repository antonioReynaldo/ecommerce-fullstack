import type { Request, Response } from 'express';
import {
  createCategorySchema,
  categoryIdParamsSchema,
  categoryAttributeParamsSchema,
  categoryUpdateSchema,
  statusCategorySchema,
  categoryQuerySchema,
  categoryImageUrlSchema,
  createCategoryAttributeSchema,
  updateCategoryAttributesSchema
} from './categories.schema.js';
import { categoriesService } from './categories.service.js';

export const createCategoryController = async (req: Request, res: Response) => {
  const dataCategory = createCategorySchema.parse(req.body);

  const category = await categoriesService.createCategory(dataCategory);

  return res.status(201).json({
    success: true,
    message: 'Categoría creada exitosamente',
    data: category
  });
};

export const getVisibleCategoriesController = async (_req: Request, res: Response) => {
  const categoriesVisibles = await categoriesService.getVisibleCategories();

  return res.status(200).json({
    success: true,
    message: 'Categorías obtenidas correctamente',
    data: categoriesVisibles
  });
};

export const getCategoriesTreeController = async (_req: Request, res: Response) => {
  const categoryTree = await categoriesService.getCategoriesTree();

  return res.status(200).json({
    success: true,
    message: 'Árbol de categorías obtenido',
    data: categoryTree
  });
};

export const getCategoriesAllController = async (req: Request, res: Response) => {
  const filters = categoryQuerySchema.parse(req.query);

  const { data, meta } = await categoriesService.getCategoriesAll(filters);

  return res.status(200).json({
    success: true,
    message: 'Categorías obtenidas correctamente',
    data,
    meta
  });
};

export const getCategoryBreadcrumbController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);

  const categoryBreadcrumb = await categoriesService.getCategoryBreadcrumb(idCategory);

  return res.status(200).json({
    success: true,
    message: 'Migas de pan obtenidas',
    data: categoryBreadcrumb
  });
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);

  const category = await categoriesService.getCategoryById(idCategory);

  return res.status(200).json({
    success: true,
    message: 'Categoría obtenida exitosamente',
    data: category
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);
  const updateDataCategory = categoryUpdateSchema.parse(req.body);

  const category = await categoriesService.updateCategory(idCategory, updateDataCategory);

  return res.status(200).json({
    success: true,
    message: 'Categoría actualizada correctamente',
    data: category
  });
};

export const updateCategoryStatusController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);
  const { isActive } = statusCategorySchema.parse(req.body);

  const statusCategory = await categoriesService.updateStatusCategory(idCategory, isActive);

  return res.status(200).json({
    success: true,
    message: 'Estado actualizado',
    data: statusCategory
  });
};

export const updateCategoryImageUrlController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);
  const { imageUrl } = categoryImageUrlSchema.parse(req.body);

  const urlPhoto = await categoriesService.updateCategoryImageUrl(idCategory, imageUrl);

  return res.status(200).json({
    success: true,
    message: 'URL de imagen de la categoría actualizada correctamente',
    data: urlPhoto
  });
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);

  await categoriesService.deleteCategory(idCategory);

  return res.status(200).json({
    success: true,
    message: 'Categoría eliminada exitosamente'
  });
};

export const createCategoryAttributeController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);
  const dataAttribute = createCategoryAttributeSchema.parse(req.body);

  const categoryAttribute = await categoriesService.createCategoryAttribute(idCategory, dataAttribute);

  return res.status(201).json({
    success: true,
    message: 'Atributo creado',
    data: categoryAttribute
  });
};

export const getCategoryAttributesController = async (req: Request, res: Response) => {
  const { id: idCategory } = categoryIdParamsSchema.parse(req.params);

  const categoryAttributes = await categoriesService.getCategoryAttributes(idCategory);

  return res.status(200).json({
    success: true,
    message: 'Atributos obtenidos',
    data: categoryAttributes
  });
};

export const updateCategoryAttributeController = async (req: Request, res: Response) => {
  const { id: idCategory, attributeId } = categoryAttributeParamsSchema.parse(req.params);
  const dataAttribute = updateCategoryAttributesSchema.parse(req.body);

  const attributeUpdated = await categoriesService.updateCategoryAttribute(idCategory, attributeId, dataAttribute);

  return res.status(200).json({
    success: true,
    message: 'Se actualizó el atributo',
    data: attributeUpdated
  });
};

export const deleteCategoryAttributeController = async (req: Request, res: Response) => {
  const { id: idCategory, attributeId } = categoryAttributeParamsSchema.parse(req.params);

  await categoriesService.deleteCategoryAttribute(idCategory, attributeId);

  return res.status(200).json({
    success: true,
    message: 'Se eliminó el atributo correctamente'
  });
};
