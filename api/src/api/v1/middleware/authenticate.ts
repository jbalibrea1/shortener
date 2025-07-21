import type { NextFunction, Response } from 'express';
import type { IJwtRequest } from '@/api/v1/interfaces';
import { UnauthorizedError } from '@/api/v1/utils/errors';
import token from '@/api/v1/utils/token';

/**
 * Middleware de autenticación JWT.
 * Extrae el usuario del token y lo añade a la request.
 * Lanza UnauthorizedError si el token es inválido o no existe.
 *
 * @param req - Request extendida con posible usuario
 * @param _res - Response de Express (no usado)
 * @param next - Siguiente middleware
 */
export function authenticate(
  req: IJwtRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const user = token.extractToken(req);
    if (!user) throw new UnauthorizedError('No token provided');
    req.user = user;
    next();
  } catch {
    next(new UnauthorizedError('Invalid token'));
  }
}

/**
 * Middleware para requerir un rol específico en la request.
 * Lanza UnauthorizedError si el usuario no tiene el rol requerido.
 *
 * @param role - Rol requerido (por ejemplo, 'admin')
 * @returns Middleware Express
 */
export function requireRole(role: string) {
  return (req: IJwtRequest, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || user.role !== role) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }
    next();
  };
}
