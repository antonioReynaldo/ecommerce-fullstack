import { createProductSchema, productQuerySchema, productParamsSchema, updateProductSchema } from './products.schema.js';
import type { Request, Response } from 'express';
import { productsService } from './products.service.js';

export const createProductController = async (req: Request, res: Response) => {
  const dataProduct = createProductSchema.parse(req.body);

  const newProduct = await productsService.createProduct(dataProduct);

  return res.status(201).json({
    success: true,
    message: 'Producto creado correctamente',
    data: newProduct
  });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);

  const { products, meta } = await productsService.getAllProducts(query);

  return res.status(200).json({
    success: true,
    message: 'Todos los productos obtenidos',
    data: products,
    meta
  });
};

export const getAllActiveProductsController = async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);

  const { products, meta } = await productsService.getAllActiveProducts(query);

  return res.status(200).json({
    success: true,
    message: 'Productos activos obtenidos',
    data: products,
    meta
  });
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const { idProduct } = productParamsSchema.parse(req.params);

  const product = await productsService.getProductById(idProduct);

  return res.status(200).json({
    success: true,
    message: 'Producto obtenido correctamente',
    data: product
  });
};

export const getActiveProductByIdController = async (req: Request, res: Response) => {
  const { idProduct } = productParamsSchema.parse(req.params);

  const product = await productsService.getProductById(idProduct, true);

  return res.status(200).json({
    success: true,
    message: 'Producto obtenido correctamente',
    data: product
  });
};

export const updateProductController = async (req: Request, res: Response) => {
  const { idProduct } = productParamsSchema.parse(req.params);

  const dataProduct = updateProductSchema.parse(req.body);

  const product = await productsService.updateProduct(idProduct, dataProduct);

  return res.status(200).json({
    success: true,
    message: 'Producto actualizado correctamente',
    data: product
  });
};
