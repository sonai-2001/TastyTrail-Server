import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message = 'Something went wrong';
  let details: any = null;

  if (err instanceof ApiError) {
    status = err.status;
    message = err.message;
    details = err.details;
  }
  else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = err.errors;
  }
  else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }
  else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  console.error(err);

  if (process.env.NODE_ENV === 'production' && !(err instanceof ApiError)) {
    details = null;
  }

  res.status(status).json({
    success: false,
    message,
    details,
  });
}
