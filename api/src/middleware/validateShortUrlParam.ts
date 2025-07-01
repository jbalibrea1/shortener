import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

// Esquema para validar el parámetro :shortUrl
const shortUrlParamSchema = z.object({
  shortUrl: z
    .string()
    .min(4, 'El shortURL debe tener al menos 4 caracteres')
    .max(16, 'El shortURL es demasiado largo')
});

export function validateShortUrlParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const result = shortUrlParamSchema.safeParse(req.params);
  if (!result.success) {
    return next(
      new ValidationError(
        result.error.errors
          .map(
            (e) =>
              `${e.path.length ? e.path.join('.') : 'shortUrl'}: ${e.message}`
          )
          .join(', ')
      )
    );
  }
  next();
}
