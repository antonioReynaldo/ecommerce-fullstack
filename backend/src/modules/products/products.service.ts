import { promise } from 'zod';
import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../lib/prisma.js';
import { generateSkuProduct } from '../../utils/generateSkuProduct.js';
import type { CreateProductType, ProductQueryType } from './products.schema.js';

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
        stock: dataProduct.stock,
        isActive: dataProduct.isActive
      }
    });

    return newProduct;
  },

  async getAllProducts({ limit, page }: ProductQueryType) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          categoryId: true,
          name: true,
          description: true,
          sku: true,
          barcode: true,
          price: true,
          stock: true,
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
        },
        orderBy: { id: 'asc' },
        skip,
        take: limit
      }),

      prisma.product.count()
    ]);

    return {
      products,
      data: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  },

  async getAllActiveProducts({ page, limit }: ProductQueryType) {
    const skip = (page - 1) * limit;

    const [productsVisible, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          categoryId: true,
          name: true,
          description: true,
          sku: true,
          barcode: true,
          price: true,
          stock: true,
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
        },
        orderBy: { id: 'asc' },
        skip,
        take: limit
      }),

      prisma.product.count({
        where: {
          isActive: true
        }
      })
    ]);

    return {
      productsVisible,
      data: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  },

  async getProductById(idProduct: number) {
    const product = await prisma.product.findUnique({
      where: {
        id: idProduct
      }
    });

    if (!product) throw AppError.notFound('El Producto no existe');

    return product;
  },

  async updateProduct(idProduct: number /*dataProduct:*/) {
    const product = await prisma.product.findUnique({
      where: {
        id: idProduct
      }
    });

    if (!product) throw AppError.notFound('El Producto no existe');
  }
};
