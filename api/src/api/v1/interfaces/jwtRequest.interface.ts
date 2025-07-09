/**
 * Extiende la interfaz Request de Express para incluir el usuario autenticado.
 */
import { Request } from 'express';
import { CustomJwtPayload } from './index';

export interface IJwtRequest extends Request {
  user?: CustomJwtPayload;
}
