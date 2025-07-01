import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

// Esquema para login
export const loginSchema = z.object({
  user: z.string().min(3, 'Usuario requerido'),
  password: z.string().min(6, 'Contraseña mínima 6 caracteres')
});

export function validateLoginBody(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  console.log('EL BODY RECIBIDO ES:', req.body);
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    next(
      new ValidationError(result.error.errors.map((e) => e.message).join(', '))
    );
    return;
  }
  next();
}

// Esquema para registro
export const registerSchema = z.object({
  user: z.string().min(3, 'Usuario requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  password: z.string().min(6, 'Contraseña mínima 6 caracteres')
});

export function validateRegisterBody(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return next(
      new ValidationError(
        result.error.errors
          .map(
            (e) => `${e.path.length ? e.path.join('.') : 'url'}: ${e.message}`
          )
          .join(', ')
      )
    );
  }
  next();
}
