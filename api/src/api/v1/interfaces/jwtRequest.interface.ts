/**
 * Extiende la interfaz Request de Express para incluir el usuario autenticado.
 */
import type { Request } from 'express';
import type { CustomJwtPayload } from './index';

export interface IJwtRequest extends Request {
  user?: CustomJwtPayload;
}
