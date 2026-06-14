import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Zod validation errors -> 400 with field details
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
  }

  // Known application errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'A record with that value already exists.' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found.' });
    }
  }

  // Fallback
  // eslint-disable-next-line no-console
  console.error('[unhandled error]', err);
  return res.status(500).json({
    error: 'Internal server error',
    ...(env.isProd ? {} : { message: err instanceof Error ? err.message : String(err) }),
  });
}
