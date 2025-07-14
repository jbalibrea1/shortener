import { Response } from 'express';

/**
 * @param res Response
 * @param status Status code
 * @param data data (opcional)
 * @param message
 * @returns
 */

interface SuccessResponseOptions<T, P = undefined> {
  res: Response;
  status?: number;
  data?: T;
  msg?: string;
  pagination?: P;
}

export function successResponse<T, P = undefined>({
  res,
  status = 200,
  data,
  msg = 'Operación exitosa',
  pagination,
}: SuccessResponseOptions<T, P>) {
  const response: Record<string, unknown> = {
    success: true,
    message: msg,
    data,
  };
  if (pagination !== undefined) {
    response.pagination = pagination;
  }
  return res.status(status).json(response);
}

interface ErrorResponseOptions {
  res: Response;
  status?: number;
  error: string;
  details?: unknown;
}

/**
 * Envía una respuesta de error estándar.
 * @param res - Response de Express
 * @param status - Código de estado HTTP (por defecto 400)
 * @param error - Mensaje de error
 * @param details - Detalles adicionales del error (opcional)
 * @returns La respuesta JSON de error
 */
export function errorResponse({
  res,
  status = 400,
  error,
  details,
}: ErrorResponseOptions) {
  const response: Record<string, unknown> = {
    success: false,
    error,
  };
  if (details !== undefined) {
    response.details = details;
  }
  return res.status(status).json(response);
}
