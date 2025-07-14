import { NextFunction, Request, Response } from 'express';
import { shortUrlBodySchema } from '@/api/v1/schemas/shorturl.schema';
import { ValidationError } from '@/api/v1/utils/errors';
import parsedURL from '@/api/v1/utils/parsedURL';

export async function validateShortUrlBody(
  req: Request<Record<string, string>, unknown, { url: string }>,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Normaliza y parsea la URL antes de validar
    if (req.body?.url) {
      const parsed = await parsedURL({ url: req.body.url });
      req.body = { ...req.body, ...parsed };
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
