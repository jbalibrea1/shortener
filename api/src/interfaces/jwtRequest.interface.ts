/**
 * Extiende la interfaz Request de Express para incluir el usuario autenticado.
 */
import { Request } from 'express';

export interface IJwtRequest extends Request {
  user?: {
    user?: string;
    role: string;
    id?: string;
  };
}
