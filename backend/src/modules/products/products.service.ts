import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../lib/prisma.js';
import { generateSkuProduct } from '../../utils/generateSkuProduct.js';
import type { CreateProductType, ProductQueryType, UpdateProductType } from './products.schema.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { validateProductAttributes } from '../../utils/validateProductAttributes.js';

const select = {
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
  attributeValues: {
    select: {
      value: true,
      categoryAttribute: {
        select: {
          id: true,
          name: true,
          key: true,
          type: true
        }
      }
    }
  },
  images: {
    select: {
      productId: true,
      position: true,
      url: true,
      alt: true
    }
  }
} satisfies Prisma.ProductSelect;

export const productsService = {
  // Crear Producto
  async createProduct(dataProduct: CreateProductType) {
    const category = await prisma.category.findUnique({
      where: {
        id: dataProduct.categoryId
      }
    });

    if (!category) throw AppError.badRequest('Ese ID de categoria no existe');

    const categoryAttributes = await prisma.categoryAttribute.findMany({
      where: {
        categoryId: category.id
      }
    });

    validateProductAttributes(categoryAttributes, dataProduct.attributes, true);

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
        isActive: dataProduct.isActive,
        attributeValues: {
          create: dataProduct.attributes.map((attribute) => ({
            categoryAttributeId: attribute.categoryAttributeId,
            value: attribute.value
          }))
        }
      },
      select
    });

    return newProduct;
  },
  // Obtener todos los productos (admin)
  async getAllProducts({ limit, page, search, categoryId, isActive, minPrice, maxPrice, minStock, maxStock }: ProductQueryType) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const priceFilter: { gte?: number; lte?: number } = {};

    if (minPrice !== undefined) {
      priceFilter.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      priceFilter.lte = maxPrice;
    }

    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }

    const stockFilter: { gte?: number; lte?: number } = {};

    if (minStock !== undefined) {
      stockFilter.gte = minStock;
    }

    if (maxStock !== undefined) {
      stockFilter.lte = maxStock;
    }

    if (Object.keys(stockFilter).length > 0) {
      where.stock = stockFilter;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select,
        orderBy: { id: 'asc' },
        skip,
        take: limit
      }),

      prisma.product.count({ where })
    ]);

    return {
      products,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  },
  // Obtener todos los productos (public - solo activos)
  async getAllActiveProducts({ page, limit, search, categoryId, minPrice, maxPrice, minStock, maxStock }: ProductQueryType) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(categoryId !== undefined && { categoryId })
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice })
      };
    }

    if (minStock !== undefined || maxStock !== undefined) {
      where.stock = {
        ...(minStock !== undefined && { gte: minStock }),
        ...(maxStock !== undefined && { lte: maxStock })
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select,
        orderBy: { id: 'asc' },
        skip,
        take: limit
      }),

      prisma.product.count({
        where
      })
    ]);

    return {
      products,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  },
  // Obtener un producto
  async getProductById(idProduct: number, onlyActive = false) {
    const product = await prisma.product.findUnique({
      where: {
        id: idProduct,
        ...(onlyActive && { isActive: true })
      },
      select
    });

    if (!product) throw AppError.notFound('El Producto no existe');

    return product;
  },
  // Actualziar producto
  async updateProduct(idProduct: number, dataProduct: UpdateProductType) {
    const { name, description, barcode, stock, isActive, price, attributes } = dataProduct;

    const product = await prisma.product.findUnique({
      where: {
        id: idProduct
      }
    });

    if (!product) throw AppError.notFound('El Producto no existe');

    if (attributes !== undefined) {
      const categoryAttributes = await prisma.categoryAttribute.findMany({
        where: { categoryId: product.categoryId }
      });

      validateProductAttributes(categoryAttributes, attributes, false);
    }

    if (barcode !== undefined) {
      const barcodeInUse = await prisma.product.findFirst({
        where: {
          barcode,
          NOT: { id: product.id }
        }
      });

      if (barcodeInUse) throw AppError.conflict('Este código de barras ya esta en uso');
    }

    const data: Prisma.ProductUpdateInput = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(barcode !== undefined && { barcode }),
      ...(stock !== undefined && { stock }),
      ...(isActive !== undefined && { isActive }),
      ...(price !== undefined && { price }),
      ...(attributes !== undefined && {
        attributeValues: {
          upsert: attributes.map((attribute) => ({
            where: { productId_categoryAttributeId: { productId: product.id, categoryAttributeId: attribute.categoryAttributeId } },
            create: { categoryAttributeId: attribute.categoryAttributeId, value: attribute.value },
            update: { value: attribute.value }
          }))
        }
      })
    };

    return await prisma.product.update({
      where: {
        id: idProduct
      },
      data,
      select
    });
  },
  //
  async changeProductStatus(idProduct: number, status: boolean) {
    const product = await prisma.product.findUnique({
      where: {
        id: idProduct
      }
    });

    if (!product) throw AppError.notFound('El producto no existe');

    const statusProduct = await prisma.product.update({
      where: { id: product.id },
      data: { isActive: status },
      select: { id: true, name: true, isActive: true }
    });

    return statusProduct;
  },

  async deleteProduct(idProduct: number) {
    const product = await prisma.product.findUnique({
      where: {
        id: idProduct
      }
    });

    if (!product) throw AppError.notFound('El producto no existe');

    if (!product.isActive) throw AppError.conflict('El producto ya esta desactivado');

    await prisma.product.update({
      where: {
        id: idProduct
      },
      data: {
        isActive: false
      }
    });

    return;
  },

  async deteProductAttribute() {},

  async addImagesProducts() {}
};
