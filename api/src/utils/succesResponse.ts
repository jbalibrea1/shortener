import { Response } from 'express';
/**
 * @param res Response
 * @param status Status code
 * @param data data (opcional)
 * @param message
 * @returns
 */
export function successResponse<T>(
  res: Response,
  status = 200,
  data?: T,
  message = 'Operación exitosa'
) {
  const response = {
    success: true,
    message,
    data
  };
  return res.status(status).json(response);
}
