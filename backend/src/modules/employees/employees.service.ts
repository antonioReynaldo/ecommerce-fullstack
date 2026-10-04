import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import type { CreateEmployeeType, UpdateEmployeeType, EmployeeQueryType } from './employees.schema.js';
import { ROLES } from '../../constants/roles.js';
import type { Prisma } from '../../generated/prisma/client.js';

export const employeesService = {
  // Crear empleado
  async createEmployee(dataEmployee: CreateEmployeeType) {
    const [emailExists, position, documentExists] = await Promise.all([
      prisma.user.findUnique({ where: { email: dataEmployee.email } }),
      prisma.position.findUnique({ where: { id: dataEmployee.positionId } }),
      prisma.employee.findUnique({ where: { documentId: dataEmployee.documentId } })
    ]);

    if (emailExists) throw AppError.conflict('Este correo ya esta en uso');
    if (!position) throw AppError.notFound('Puesto de empleo no encontrado');
    if (documentExists) throw AppError.conflict('El DNI ya esta en uso');

    const passwordHash = await bcrypt.hash(dataEmployee.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          roleId: ROLES.EMPLOYEE,
          name: dataEmployee.name,
          email: dataEmployee.email,
          passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true
        }
      });

      const employee = await tx.employee.create({
        data: {
          userId: user.id,
          positionId: dataEmployee.positionId,
          salary: dataEmployee.salary,
          documentId: dataEmployee.documentId,
          phone: dataEmployee.phone ?? null
        },
        select: {
          id: true,
          positionId: true,
          salary: true,
          documentId: true,
          phone: true,
          position: {
            select: {
              name: true
            }
          }
        }
      });

      return {
        id: employee.id,
        name: user.name,
        email: user.email,
        photo: user.photoUrl,
        positionId: employee.positionId,
        positionName: employee.position.name,
        salary: employee.salary,
        documentId: employee.documentId,
        phone: employee.phone
      };
    });

    return result;
  },

  // Obtener todos los empleados
  async getAllEmployees(filters: EmployeeQueryType) {
    const { isActive, positionId, terminatedAt, page, limit } = filters;

    const where: Prisma.EmployeeWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(positionId !== undefined && { positionId }),
      ...(terminatedAt === 'true' && { terminatedAt: { not: null } }),
      ...(terminatedAt === 'false' && { terminatedAt: null })
    };

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'asc'
        },
        select: {
          id: true,
          salary: true,
          isActive: true,
          documentId: true,
          positionId: true,
          phone: true,
          hireAt: true,
          terminatedAt: true,
          user: {
            select: {
              name: true,
              email: true,
              photoUrl: true
            }
          },
          position: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.employee.count({ where })
    ]);

    return {
      data: employees.map((employee) => ({
        id: employee.id,
        name: employee.user.name,
        email: employee.user.email,
        positionId: employee.positionId,
        positionName: employee.position.name,
        salary: employee.salary,
        documentId: employee.documentId,
        phone: employee.phone,
        isActive: employee.isActive,
        hireAt: employee.hireAt,
        terminatedAt: employee.terminatedAt
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Obtener un Empleado
  async getEmployeeById(idEmployee: number) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: idEmployee
      },
      select: {
        id: true,
        salary: true,
        isActive: true,
        documentId: true,
        positionId: true,
        phone: true,
        hireAt: true,
        terminatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            photoUrl: true
          }
        },
        position: {
          select: {
            name: true
          }
        }
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');

    const employeeResponse = {
      id: employee.id,
      name: employee.user.name,
      email: employee.user.email,
      positionId: employee.positionId,
      positionName: employee.position.name,
      salary: employee.salary,
      documentId: employee.documentId,
      phone: employee.phone,
      isActive: employee.isActive,
      hireAt: employee.hireAt,
      terminatedAt: employee.terminatedAt
    };

    return employeeResponse;
  },

  async getEmployeeByDocumentId(documentId: string) {
    const employee = await prisma.employee.findUnique({
      where: {
        documentId
      },
      select: {
        id: true,
        salary: true,
        isActive: true,
        positionId: true,
        documentId: true,
        phone: true,
        hireAt: true,
        terminatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            photoUrl: true
          }
        },
        position: {
          select: {
            name: true
          }
        }
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');

    return {
      id: employee.id,
      name: employee.user.name,
      email: employee.user.email,
      positionId: employee.positionId,
      positionName: employee.position.name,
      salary: employee.salary,
      isActive: employee.isActive,
      documentId: employee.documentId,
      phone: employee.phone,
      hireAt: employee.hireAt,
      terminatedAt: employee.terminatedAt
    };
  },

  // Actualizar empleado
  async updateEmployee(idEmployee: number, updateEmployeeData: UpdateEmployeeType) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: idEmployee
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');

    if (updateEmployeeData.email !== undefined) {
      const emailExists = await prisma.user.findUnique({ where: { email: updateEmployeeData.email } });
      if (emailExists && emailExists.id !== employee.userId) {
        throw AppError.conflict('Este correo ya está en uso');
      }
    }

    if (updateEmployeeData.documentId !== undefined) {
      const documentExists = await prisma.employee.findUnique({ where: { documentId: updateEmployeeData.documentId } });
      if (documentExists && documentExists.id !== employee.id) {
        throw AppError.conflict('El DNI ya está en uso');
      }
    }

    const passwordHash = updateEmployeeData.password !== undefined ? await bcrypt.hash(updateEmployeeData.password, 12) : undefined;

    const updatedEmployee = await prisma.$transaction(async (tx) => {
      if (updateEmployeeData.name !== undefined || updateEmployeeData.email !== undefined || updateEmployeeData.password !== undefined) {
        await tx.user.update({
          where: { id: employee.userId },
          data: {
            ...(updateEmployeeData.name !== undefined && { name: updateEmployeeData.name }),
            ...(updateEmployeeData.email !== undefined && { email: updateEmployeeData.email }),
            ...(passwordHash !== undefined && { passwordHash })
          }
        });
      }

      if (
        updateEmployeeData.positionId !== undefined ||
        updateEmployeeData.salary !== undefined ||
        updateEmployeeData.documentId !== undefined ||
        updateEmployeeData.phone !== undefined
      ) {
        await tx.employee.update({
          where: { id: employee.id },
          data: {
            ...(updateEmployeeData.positionId !== undefined && { positionId: updateEmployeeData.positionId }),
            ...(updateEmployeeData.salary !== undefined && { salary: updateEmployeeData.salary }),
            ...(updateEmployeeData.documentId !== undefined && { documentId: updateEmployeeData.documentId }),
            ...(updateEmployeeData.phone !== undefined && { phone: updateEmployeeData.phone })
          }
        });
      }

      return tx.employee.findUniqueOrThrow({
        where: { id: employee.id },
        select: {
          id: true,
          positionId: true,
          salary: true,
          documentId: true,
          phone: true,
          user: { select: { name: true, email: true } },
          position: { select: { name: true } }
        }
      });
    });

    return {
      id: updatedEmployee.id,
      name: updatedEmployee.user.name,
      email: updatedEmployee.user.email,
      positionId: updatedEmployee.positionId,
      position: updatedEmployee.position.name,
      salary: updatedEmployee.salary,
      documentId: updatedEmployee.documentId,
      phone: updatedEmployee.phone
    };
  },

  // Eliminar Empleado
  async deleteEmployee(idEmployee: number) {
    await prisma.employee.delete({
      where: {
        id: idEmployee
      }
    });
  },

  // Actualizar isActive de Employee
  async updateEmployeeStatus(idEmployee: number, status: boolean) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: idEmployee
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');

    if (employee.terminatedAt !== null) throw AppError.conflict('El empleado está despedido, usa el endpoint de recontratación');

    if (employee.isActive === status) throw AppError.conflict(status ? 'El empleado ya está activo' : 'El empleado ya está inactivo');

    await prisma.employee.update({
      where: {
        id: idEmployee
      },
      data: {
        isActive: status
      }
    });
  },

  // Actualizar photo de cliente
  async updateEmployeePhoto(idEmployee: number, urlPhoto: string) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: idEmployee
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');

    const user = await prisma.user.update({
      where: {
        id: employee.userId
      },
      data: {
        photoUrl: urlPhoto
      },
      select: {
        id: true,
        photoUrl: true
      }
    });

    return {
      photoUrl: user.photoUrl
    };
  },

  // Despedir empleado
  async terminateEmployee(idEmployee: number) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: idEmployee
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');
    if (employee.terminatedAt !== null) throw AppError.conflict('El empleado ya fue despedido');

    const [resultEmployee] = await prisma.$transaction([
      prisma.employee.update({
        where: {
          id: employee.id
        },
        data: {
          isActive: false,
          terminatedAt: new Date()
        },
        select: {
          id: true,
          userId: true,
          isActive: true,
          terminatedAt: true
        }
      }),

      prisma.refreshToken.deleteMany({
        where: {
          userId: employee.userId
        }
      })
    ]);

    return {
      id: resultEmployee.id,
      userId: resultEmployee.userId,
      isActive: resultEmployee.isActive,
      terminatedAt: resultEmployee.terminatedAt
    };
  },

  // Recontratar empleado
  async rehireEmployee(idEmployee: number) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: idEmployee
      }
    });

    if (!employee) throw AppError.notFound('El empleado no existe');
    if (employee.terminatedAt === null) throw AppError.conflict('El empleado ya esta contratado');

    const newEmployee = await prisma.employee.update({
      where: {
        id: employee.id
      },
      data: {
        isActive: true,
        terminatedAt: null
      },
      select: {
        id: true,
        userId: true,
        isActive: true,
        terminatedAt: true
      }
    });

    return {
      id: newEmployee.id,
      userId: newEmployee.userId,
      isActive: newEmployee.isActive,
      terminatedAt: newEmployee.terminatedAt
    };
  }
};
