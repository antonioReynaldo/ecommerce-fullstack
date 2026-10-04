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

  isActive: z.boolean().default(true)
});

export type CreateProductType = z.infer<typeof createProductSchema>;
