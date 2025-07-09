import { ValidationError } from '@/api/v1/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

// Middleware genérico
export function validateData(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return next(new ValidationError(JSON.stringify({ errorMessages })));
    }
    next();
  };
}
