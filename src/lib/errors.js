export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}

export function notFoundError(message = 'Resource not found') {
  return new AppError(message, 404, 'NOT_FOUND');
}

export function unauthorizedError(message = 'Authentication required') {
  return new AppError(message, 401, 'UNAUTHORIZED');
}

export function validationError(message = 'Invalid request') {
  return new AppError(message, 400, 'VALIDATION_ERROR');
}
