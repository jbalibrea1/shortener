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
  pagination
}: SuccessResponseOptions<T, P>) {
  const response: Record<string, unknown> = {
    success: true,
    message: msg,
    data
  };
  if (pagination !== undefined) {
    response.pagination = pagination;
  }
  return res.status(status).json(response);
}