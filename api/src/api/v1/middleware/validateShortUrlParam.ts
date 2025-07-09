import { shortUrlParamSchema } from '@/api/v1/schemas/shorturl.schema';
import { ValidationError } from '@/api/v1/utils/errors';
import { NextFunction, Request, Response } from 'express';

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
