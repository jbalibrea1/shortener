/**
 * Custom error classes for application-specific error handling.
 * Includes UnauthorizedError, ValidationError, NotFoundError, etc.
 * @module utils/errors
 */

/**
 * Error para respuestas 401 Unauthorized.
 */
export class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

/**
 * Error para respuestas 400 Bad Request (validación).
 */
export class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

/**
 * Error para respuestas 404 Not Found.
 */
export class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
