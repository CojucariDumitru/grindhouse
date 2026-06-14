import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, AdminTokenPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

/**
 * Requires a valid admin JWT in the `Authorization: Bearer <token>` header.
 * Attaches the decoded payload to `req.admin`.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing authentication token');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }
}
