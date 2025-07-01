import { ValidationError } from '@/utils/errors';
import parsedURL from '@/utils/parsedURL';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

// Esquema Zod para validar el body de creación de shortURL
export const shortUrlBodySchema = z.object({
  url: z.string().url({ message: 'Debe ser una URL válida' })
});

export async function validateShortUrlBody(
  req: Request<Record<string, string>, unknown, { url: string }>,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Normaliza y parsea la URL antes de validar
    if (req.body && req.body.url) {
      req.body.url = (await parsedURL({ url: req.body.url })).url;
    }
    const result = shortUrlBodySchema.safeParse(req.body);
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
  } catch {
    next(new ValidationError('Invalid or unparseable URL'));
  }
}
