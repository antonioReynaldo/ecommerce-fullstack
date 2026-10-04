import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({ error: 'El nombre es obligatorio' })
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede superar los 100 caracteres'),

    email: z.email({ error: 'Ingresa un correo electrónico válido' }).trim().toLowerCase().max(255, 'El correo no puede superar los 255 caracteres'),

    password: z
      .string({ error: 'La contraseña es obligatoria' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña no puede superar los 72 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),

    confirmPassword: z.string({ error: 'Debes confirmar tu contraseña' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.email({ error: 'Ingresa un correo electrónico válido' }).trim().toLowerCase().max(255, 'El correo no puede superar los 255 caracteres'),

  password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria')
});
