import { z } from 'zod';

export const productAttributeValueSchema = z.object({
  categoryAttributeId: z.coerce
    .number('El id del atributo debe ser un número')
    .int('El id del atributo debe ser entero')
    .positive('El id del atributo debe ser positivo'),

  value: z
    .string('El valor del atributo debe ser texto')
    .trim()
    .min(1, 'El valor del atributo no puede estar vacío')
    .max(255, 'El valor del atributo no debe exceder los 255 caracteres')
});

export const createProductSchema = z.object({
  categoryId: z.coerce.number().int('El id de categoria debe ser entero').positive('El id de categoria debe ser positivo'),
  name: z
    .string()
    .trim()
    .min(3, 'El nombre del producto debe tener minimo 3 caracteres')
    .max(150, 'El nombre del producto no debe exceder los 150 caracteres'),

  description: z
    .string()
    .trim()
    .max(5000, 'La descripcion no debe exceder los 5000 caracteres')
    .transform((value) => (value === '' ? null : value))
    .optional(),

  barcode: z
    .string()
    .trim()
    .regex(/^(\d{8}|\d{12}|\d{13}|\d{14})$/, 'El código de barras debe tener solo números y 8, 12, 13 o 14 dígitos')
    .optional(),

  price: z
    .string()
    .trim()
    .regex(/^\d{1,8}(\.\d{1,2})?$/, 'El precio debe tener hasta 8 enteros y 2 decimales (ej: 99.90)'),

  stock: z.coerce.number('El stock debe ser un número').int('El stock debe ser entero').min(0).default(0),

  isActive: z.boolean().default(true),

  attributes: z.array(productAttributeValueSchema).default([])
});

export type CreateProductType = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .pick({ name: true, description: true, barcode: true, price: true, stock: true, isActive: true, attributes: true })
  .partial()
  .extend({
    stock: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    attributes: z.array(productAttributeValueSchema).optional()
  });

export type UpdateProductType = z.infer<typeof updateProductSchema>;

export const productQuerySchema = z.object({
  page: z.coerce
    .number('La query page debe ser número')
    .int('La query página debe ser entero')
    .min(1, 'La query page debe ser positivo minimo 1')
    .default(1),

  limit: z.coerce
    .number('El limit debe ser un número')
    .int('El limit debe ser un número entero')
    .min(1, 'La query limit debe ser mínimo 1')
    .max(100, 'El limit debe ser como maximo 100')
    .default(20),

  search: z.string().trim().optional(),

  categoryId: z.coerce
    .number('La query categoryId debe ser de un número')
    .int('La query categoryId debe ser un número entero')
    .positive('La query categoryId debe ser un número positivo')
    .optional(),

  isActive: z.stringbool('El query isActive debe tener un valor booleano').optional(),

  minPrice: z.coerce.number('minPrice debe ser un número').min(0, 'minPrice no puede ser nengativo').optional(),

  maxPrice: z.coerce.number('maxPrice debe ser un número').min(0, 'maxPrice no puede ser nengativo').optional(),

  minStock: z.coerce
    .number('minStock debe ser un número')
    .int('minStock debe ser un número entero')
    .min(0, 'minStock no puede ser negativo')
    .optional(),

  maxStock: z.coerce
    .number('maxStock debe ser un número')
    .int('maxStock debe ser un número entero')
    .min(0, 'maxStock no puede ser negativo')
    .optional()
});

export type ProductQueryType = z.infer<typeof productQuerySchema>;

export const productParamsSchema = z.object({
  idProduct: z.coerce.number().int().positive()
});

export const changeProductStatusSchema = z.object({
  status: z.boolean()
});
