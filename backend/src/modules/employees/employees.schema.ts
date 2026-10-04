import z from 'zod';

export const createEmployeeSchema = z.object({
  // Datos que van a User
  name: z.string().trim().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  email: z.email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),

  // Datos que van a Employee
  positionId: z.coerce.number().int('Puesto inválido').positive('Debes seleccionar un puesto'),
  salary: z.coerce.number().positive('El salario debe ser mayor a 0'),
  documentId: z.string().trim().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'El DNI solo debe contener números'),
  phone: z
    .string()
    .trim()
    .regex(/^(\+51)?9\d{8}$/, 'Teléfono inválido')
    .optional()
});
export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();
export type UpdateEmployeeType = z.infer<typeof updateEmployeeSchema>;

export const employeeParamsSchema = z.object({
  id: z.coerce.number().int('Id de empleado invalido').positive('Id de empleado invalido')
});
export type EmployeeParamsType = z.infer<typeof employeeParamsSchema>;

// Query params para GET /employees (filtros de búsqueda)
export const employeeQuerySchema = z.object({
  isActive: z
    .enum(['true', 'false'], { message: 'isActive debe ser true o false' })
    .transform((val) => val === 'true')
    .optional(),
  positionId: z.coerce.number().int('Puesto inválido').positive('Puesto inválido').optional(),
  terminatedAt: z.enum(['true', 'false', 'all']).default('false'),
  page: z.coerce.number().int('Página inválida').positive('La página debe ser mayor a 0').default(1),
  limit: z.coerce.number().int('Límite inválido').positive('El límite debe ser mayor a 0').max(100, 'El límite máximo es 100').default(20)
});
export type EmployeeQueryType = z.infer<typeof employeeQuerySchema>;

export const employeeDocumentIdParamsSchema = z.object({
  documentId: z.string().trim().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'El DNI solo debe contener números')
});

export type EmployeeDocumentIdParamsType = z.infer<typeof employeeDocumentIdParamsSchema>;

export const statusEmployeeSchema = z.object({
  isActive: z.boolean()
});

export const photoEmployeeSchema = z.object({
  photoUrl: z.url()
});

export type PhotoEmployeeType = z.infer<typeof photoEmployeeSchema>;
