import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '../generated/prisma/client.js';
import { AppError } from '../errors/AppError.js';

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Creamos una variable mutable para poder "transformar" los errores externos
  let activeError = error;

  // A TRADUCIR ERRORES DE ZOD (.parse())
  if (error instanceof z.ZodError) {
    // Los err.errors o err.issues contienen la lista de campos fallidos
    activeError = AppError.badRequest('Datos de formulario inválidos', error.issues);
  }

  // B. TRADUCIR ERRORES DE PRISMA (Base de datos)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target;
        const targetField = Array.isArray(target) ? target.join(', ') : typeof target === 'string' ? target : 'campo';
        activeError = AppError.conflict(`El valor para el campo [${targetField}] ya está en uso.`);
        break;
      }
      case 'P2025': {
        // Registro no encontrado al actualizar/eliminar
        activeError = AppError.notFound('El registro solicitado no existe.');
        break;
      }
      case 'P2003': {
        // Error de llave foránea (relaciones)
        activeError = AppError.badRequest('La operación no es posible: el registro está relacionado con otros datos');
        break;
      }
      default:
        // Cualquier otro código de Prisma conocido lo volvemos un BadRequest genérico
        activeError = AppError.badRequest(`Error en la base de datos (Código ${error.code})`);
        break;
    }
  }

  // C. TRADUCIR ERRORES DE SINTAXIS JSON
  if (error instanceof SyntaxError && 'body' in error) {
    activeError = AppError.badRequest('El JSON enviado en el cuerpo está mal formado.');
  }

  // RESPUESTA FINAL (Tu lógica original intacta)
  if (activeError instanceof AppError) {
    return res.status(activeError.statusCode).json({
      success: false,
      message: activeError.message,
      ...(activeError.details !== null && {
        details: activeError.details
      })
    });
  }

  // Si llegó aquí, de verdad es un error imprevisto (Bug, desconexión de BD, etc.)
  console.error(error);

  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};
