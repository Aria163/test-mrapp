import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

export async function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  request.log.error(error);

  // Handle operational errors
  if (error instanceof AppError && error.isOperational) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    });
  }

  // Handle Fastify validation errors
  if ('validation' in error && error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        message: 'Validation error',
        statusCode: 400,
        details: error.validation,
      },
    });
  }

  // Handle JWT errors
  if ('statusCode' in error && error.statusCode === 401) {
    return reply.status(401).send({
      success: false,
      error: {
        message: error.message || 'Unauthorized',
        statusCode: 401,
      },
    });
  }

  // Default to 500 server error
  return reply.status(500).send({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
}
