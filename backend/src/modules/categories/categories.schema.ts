import { z } from 'zod';

// ---------- Params ----------
export const categoryIdParamsSchema = z.object({
  id: z.coerce.number().int('El id de categoría debe ser entero').positive('El id de categoría debe ser positivo')
});

export type CategoryIdParamsType = z.infer<typeof categoryIdParamsSchema>;

export const categoryAttributeParamsSchema = categoryIdParamsSchema.extend({
  attributeId: z.coerce.number().int('El id de atributo debe ser entero').positive('El id de atributo debe ser positivo')
});

export type CategoryAttributeParamsType = z.infer<typeof categoryAttributeParamsSchema>;

// ---------- Categorías ----------
export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'El nombre de la categoría debe tener mínimo 3 caracteres')
    .max(100, 'El nombre de la categoría debe tener máximo 100 caracteres'),
  description: z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .optional(),
  parentId: z.number().int('El parentId debe ser entero').positive('El parentId debe ser positivo').nullable().optional()
});

export type CreateCategoryType = z.infer<typeof createCategorySchema>;

export const categoryUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'El nombre de la categoría debe tener mínimo 3 caracteres')
      .max(100, 'El nombre de la categoría debe tener máximo 100 caracteres')
      .optional(),
    description: z
      .string()
      .trim()
      .transform((value) => (value === '' ? null : value))
      .nullable()
      .optional(),
    parentId: z.number().int('El parentId debe ser entero o null').positive('El parentId debe ser positivo o null').nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'No hay datos para actualizar' });

export type CategoryUpdateType = z.infer<typeof categoryUpdateSchema>;

export const statusCategorySchema = z.object({
  isActive: z.boolean()
});

export const categoryQuerySchema = z.object({
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100, 'Máximo de resultados por página es 100').default(20)
});

export type CategoryQueryType = z.infer<typeof categoryQuerySchema>;

export const categoryImageUrlSchema = z.object({
  imageUrl: z.url({ protocol: /^https?$/, error: 'La imagen debe ser una URL http o https válida' }).nullable()
});

export type CategoryImageUrlType = z.infer<typeof categoryImageUrlSchema>;

// ---------- Atributos ----------
const attributeTypeSchema = z.enum(['TEXT', 'NUMBER', 'BOOLEAN', 'SELECT']);
const attributeOptionsSchema = z.array(z.string().trim().min(1).max(100)).max(50);

export const createCategoryAttributeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'El nombre del atributo debe tener como mínimo 3 caracteres')
      .max(100, 'El nombre del atributo debe tener como máximo 100 caracteres'),
    type: attributeTypeSchema,
    required: z.boolean().optional(),
    options: attributeOptionsSchema.optional()
  })
  .refine((data) => data.type !== 'SELECT' || (data.options !== undefined && data.options.length > 0), {
    message: 'Un atributo de tipo SELECT requiere al menos una opción',
    path: ['options']
  })
  .refine((data) => data.type === 'SELECT' || data.options === undefined || data.options.length === 0, {
    message: 'Solo los atributos de tipo SELECT admiten opciones',
    path: ['options']
  });

export type CreateCategoryAttributeType = z.infer<typeof createCategoryAttributeSchema>;

export const updateCategoryAttributesSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'El nombre del atributo debe tener como mínimo 3 caracteres')
      .max(100, 'El nombre del atributo debe tener como máximo 100 caracteres')
      .optional(),
    type: attributeTypeSchema.optional(),
    required: z.boolean().optional(),
    options: attributeOptionsSchema.optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'No hay datos para actualizar' });

export type UpdateCategoryAttributesType = z.infer<typeof updateCategoryAttributesSchema>;
