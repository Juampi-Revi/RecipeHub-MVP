import { Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { createLogger } from '../config/logger';

const logger = createLogger();

export class ValidationError extends Error {
  public statusCode: number;
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

export class RateLimitError extends Error {
  public statusCode: number;

  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
  }
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export const sendErrorResponse = (
  res: Response,
  error: Error,
  statusCode?: number
): void => {
  const code = statusCode || (error as any).statusCode || 500;
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: error.message,
      code: error.name,
      details: (error as any).errors || undefined,
    },
    timestamp: new Date().toISOString(),
  };

  if (code >= 500) {
    logger.error('Server error:', {
      error: error.message,
      stack: error.stack,
      statusCode: code,
    });
  } else {
    logger.warn('Client error:', {
      error: error.message,
      statusCode: code,
    });
  }

  res.status(code).json(errorResponse);
};

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const successResponse: SuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(successResponse);
};

export const handleZodError = (error: ZodError): ValidationError => {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return new ValidationError('Validation failed', errors);
};

export const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): Error => {
  switch (error.code) {
    case 'P2002':
      return new ConflictError('A record with this data already exists');
    case 'P2025':
      return new NotFoundError('Record not found');
    case 'P2003':
      return new ValidationError('Foreign key constraint failed');
    case 'P2004':
      return new ValidationError('A constraint failed on the database');
    case 'P1001':
      return new InternalServerError('Database server is not reachable');
    case 'P1002':
      return new InternalServerError('Database server timeout');
    default:
      logger.error('Unhandled Prisma error:', error);
      return new InternalServerError('Database operation failed');
  }
};

export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};