import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.coerce.number().int('El id de categoria debe ser entero').positive('El id de categoria debe ser positivo'),
  name: z
    .string()
    .trim()
    .min(3, 'El nombre del producto deve tener minimo 3 caracteres')
    .max(150, 'El nombre del producto no debe exceder los 100 caracteres'),

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
    .regex(/^\d{1,8}(\.\d{1,2})?$/),

  stock: z.coerce.number('El stock debe ser un número').int('El stock debe ser entero').min(0).default(0),

  isActive: z.boolean().default(true)
});

export type CreateProductType = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .pick({ name: true, description: true, barcode: true, price: true, stock: true, isActive: true })
  .partial()
  .extend({ stock: z.coerce.number().int().min(0), isActive: z.boolean().optional() });

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
    .default(20)
});

export type ProductQueryType = z.infer<typeof productQuerySchema>;
