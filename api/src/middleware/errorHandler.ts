import logger from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import {
  isErrorWithMessage,
  isErrorWithName,
  isErrorWithStatus
} from './typeGuards';

/**
 * Express error-handling middleware. Centralizes error responses and logging.
 * Handles known error types (Mongoose, JWT, custom errors) and logs unexpected errors.
 *
 * @param error - The error thrown in the request pipeline
 * @param _req - Express request object (not used)
 * @param res - Express response object
 * @param _next - Express next function (not used)
 */
export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log all errors with context

  logger.error(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    `\n### Error occurred ### \n [${err.name || 'Unknown'}] ${
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      err.message || 'No message'
    }`,
    {
      method: _req.method,
      url: _req.url,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      date: new Date().toISOString()
    },
    `\n### End of Error ###\n`
  );

  // 400 Bad Request errors
  if (isErrorWithName(err) && err.name === 'CastError') {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  if (
    isErrorWithName(err) &&
    err.name === 'ValidationError' &&
    isErrorWithMessage(err)
  ) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (
    isErrorWithName(err) &&
    err.name === 'MongoServerError' &&
    isErrorWithMessage(err) &&
    err.message.includes('E11000')
  ) {
    res.status(400).json({ error: 'Resource already exists' });
    return;
  }

  // 401 Unauthorized errors
  if (
    isErrorWithName(err) &&
    ['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)
  ) {
    const message =
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: message });
    return;
  }

  // Custom errors with status
  if (isErrorWithStatus(err)) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Generic errors
  if (isErrorWithMessage(err)) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Fallback for unexpected errors
  res.status(500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : 'Unexpected error occurred'
  });
};
