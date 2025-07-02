/**
 * Custom error classes for application-specific error handling.
 * Includes UnauthorizedError, ValidationError, NotFoundError, etc.
 * @module utils/errors
 */

/**
 * Clase base para errores personalizados de la aplicación.
 */
export class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

/**
 * Error para respuestas 401 Unauthorized.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error para respuestas 400 Bad Request (validación).
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Error para respuestas 404 Not Found.
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
