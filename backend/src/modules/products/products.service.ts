import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../lib/prisma.js';
import { generateSkuProduct } from '../../utils/generateSkuProduct.js';
import type { CreateProductType } from './products.schema.js';

export const productsService = {
  // Crear Producto
  async createProduct(dataProduct: CreateProductType) {
    const category = await prisma.category.findUnique({
      where: {
        id: dataProduct.categoryId
      }
    });

    if (!category) throw AppError.badRequest('Ese ID de categoria no existe');

    if (dataProduct.barcode !== undefined) {
      const product = await prisma.product.findUnique({
        where: {
          barcode: dataProduct.barcode
        }
      });

      if (product) throw AppError.conflict('Este codigo de barras ya esta en uso');
    }

    const sku = generateSkuProduct(category.name);

    const newProduct = await prisma.product.create({
      data: {
        categoryId: dataProduct.categoryId,
        name: dataProduct.name,
        description: dataProduct.description ?? null,
        price: dataProduct.price,
        sku,
        barcode: dataProduct.barcode ?? null,
        isActive: dataProduct.isActive
      }
    });

    return newProduct;
  },

  async getAllProducts() {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        categoryId: true,
        name: true,
        description: true,
        sku: true,
        barcode: true,
        price: true,
        isActive: true,
        createdAt: true,
        images: {
          select: {
            productId: true,
            position: true,
            url: true,
            alt: true
          }
        }
      }
    });

    return products;
  }
};
