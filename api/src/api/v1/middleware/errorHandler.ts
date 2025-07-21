import type { NextFunction, Request, Response } from 'express';
import { errorResponse } from '@/api/v1/utils/responses';
import config from '@/config';
import logger from '@/logger';
import {
  isErrorWithMessage,
  isErrorWithName,
  isErrorWithStatus,
} from './typeGuards';

/**
 * Express error-handling middleware. Centralizes error responses and logging.
 * Handles known error types (Mongoose, JWT, custom errors) and logs unexpected errors.
 *
 * @param err - The error thrown in the request pipeline
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (not used)
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
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
    date: new Date().toISOString(),
  });

  // 400 Bad Request errors
  if (isErrorWithName(err) && err.name === 'CastError') {
    errorResponse({ res, status: 400, error: 'Invalid ID format' });
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
        errorResponse({
          res,
          status: 400,
          error: 'Validation error',
          details: parsed,
        });
        return;
      }
      errorResponse({ res, status: 400, error: err.message });
      return;
    } catch {
      errorResponse({ res, status: 400, error: err.message });
      return;
    }
  }

  if (
    isErrorWithName(err) &&
    err.name === 'MongoServerError' &&
    isErrorWithMessage(err) &&
    err.message.includes('E11000')
  ) {
    errorResponse({ res, status: 409, error: 'Resource already exists' });
    return;
  }

  // 401 Unauthorized errors
  if (
    isErrorWithName(err) &&
    ['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)
  ) {
    const message =
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    errorResponse({ res, status: 401, error: message });
    return;
  }

  // Custom errors with status
  if (isErrorWithStatus(err)) {
    errorResponse({ res, status: err.status, error: err.message });
    return;
  }

  // Generic errors
  if (isErrorWithMessage(err)) {
    errorResponse({ res, status: 400, error: err.message });
    return;
  }

  errorResponse({
    res,
    status: 500,
    error: 'Internal server error',
    details: config.env !== 'production' ? errorObj : undefined,
  });
};
