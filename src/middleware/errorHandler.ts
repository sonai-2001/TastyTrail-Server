import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const isOperational = err.isOperational || status < 500;

  logger.error(err.message || 'Unhandled error', { err, path: req.originalUrl, stack: err.stack });

  const payload: any = {
    success: false,
    message: err.exposeMessage || (isOperational ? err.message : 'Internal Server Error')
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
    if (err.details) payload.details = err.details;
  }

  res.status(status).json(payload);
}
