import { Response } from 'express';

export interface SuccessPayload<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

/**
 * Send a consistent success JSON response.
 *
 * @param res - Express Response
 * @param data - payload data
 * @param message - optional human message (default: "Success")
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - optional metadata object
 */
export function sendSuccess<T = unknown>(
  res: Response,
  data?: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
): Response {
  const payload: SuccessPayload<T> = {
    success: true,
    message,
    data,
    meta,
  };

  return res.status(statusCode).json(payload);
}

export default sendSuccess;
