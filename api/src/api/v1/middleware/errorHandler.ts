import config from '@/config';
import logger from '@/logger';
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
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log all errors with context
  const errorObj =
    typeof err === 'object' && err !== null
      ? (err as Record<string, unknown>)
      : {};
  logger.error('Error occurred', {
    name: errorObj.name || 'Unknown',
    message: errorObj.message || 'No message',
    method: req.method,
    url: req.url,
    stack: config.env !== 'production' ? errorObj.stack : undefined,
    date: new Date().toISOString()
  });

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
    // Si el mensaje es un string JSON, lo parseamos y devolvemos como objeto
    try {
      const parsed: unknown = JSON.parse(err.message);
      if (typeof parsed === 'object' && parsed !== null) {
        res.status(400).json(parsed);
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    } catch {
      res.status(400).json({ error: err.message });
      return;
    }
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

  res.status(500).json({
    error:
      config.env === 'production'
        ? 'Internal server error'
        : errorObj.message || 'Unexpected error occurred'
  });
};
