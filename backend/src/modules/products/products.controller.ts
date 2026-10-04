import { createProductSchema } from './products.schema.js';
import type { Request, Response } from 'express';
import { productsService } from './products.service.js';

export const createProductController = async (req: Request, res: Response) => {
  const dataProduct = createProductSchema.parse(req.body);

  const newProducto = await productsService.createProduct(dataProduct);

  return res.status(201).json({
    success: true,
    message: 'Producto creado correctamente',
    data: newProducto
  });
};

export const getAllProducts = async (_req: Request, res: Response) => {
  const allProductos = await productsService.getAllProducts();

  return res.status(200).json({
    success: true,
    message: 'Todos los productos obtenidos',
    data: allProductos
  });
};
