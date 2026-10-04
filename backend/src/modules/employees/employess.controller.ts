import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeParamsSchema,
  employeeDocumentIdParamsSchema,
  employeeQuerySchema,
  statusEmployeeSchema,
  photoEmployeeSchema
} from './employees.schema.js';
import { employeesService } from './employees.service.js';
import type { Request, Response } from 'express';

export const createEmployeeController = async (req: Request, res: Response) => {
  const dataEmployee = createEmployeeSchema.parse(req.body);

  const employee = await employeesService.createEmployee(dataEmployee);

  return res.status(201).json({
    success: true,
    message: 'Empleado creado correctamente',
    data: employee
  });
};

export const getAllEmployeesController = async (req: Request, res: Response) => {
  const filters = employeeQuerySchema.parse(req.query);

  const result = await employeesService.getAllEmployees(filters);

  return res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta
  });
};

export const getEmployeeByIdController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);

  const employee = await employeesService.getEmployeeById(idEmployee);

  return res.status(200).json({
    success: true,
    data: employee
  });
};

export const getEmployeeByDocumentIdController = async (req: Request, res: Response) => {
  const { documentId } = employeeDocumentIdParamsSchema.parse(req.params);

  const employee = await employeesService.getEmployeeByDocumentId(documentId);

  return res.status(200).json({
    success: true,
    data: employee
  });
};

export const updateEmployeeController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);
  const updateEmployeeData = updateEmployeeSchema.parse(req.body);

  const updatedEmployee = await employeesService.updateEmployee(idEmployee, updateEmployeeData);

  return res.status(200).json({
    success: true,
    message: 'Empleado actualizado correctamente',
    data: updatedEmployee
  });
};

export const deleteEmployeeController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);

  await employeesService.deleteEmployee(idEmployee);

  return res.status(200).json({
    success: true,
    message: 'Empleado eliminado correctamente'
  });
};

export const updateEmployeeStatusController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);
  const { isActive: status } = statusEmployeeSchema.parse(req.body);

  await employeesService.updateEmployeeStatus(idEmployee, status);

  res.status(200).json({
    success: true,
    message: 'Estatus actualziado correctamente'
  });
};

export const updateEmployeePhotoController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);
  const { photoUrl } = photoEmployeeSchema.parse(req.body);

  const urlPhoto = await employeesService.updateEmployeePhoto(idEmployee, photoUrl);

  return res.status(200).json({
    success: true,
    data: urlPhoto
  });
};

export const terminateEmployeeController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);

  const employee = await employeesService.terminateEmployee(idEmployee);

  return res.status(200).json({
    success: true,
    message: 'Empleado despedido correctamente',
    data: employee
  });
};

export const rehireEmployeeController = async (req: Request, res: Response) => {
  const { id: idEmployee } = employeeParamsSchema.parse(req.params);

  const employee = await employeesService.rehireEmployee(idEmployee);

  return res.status(200).json({
    success: true,
    message: 'Empleado recontratado correctamente',
    data: employee
  });
};
