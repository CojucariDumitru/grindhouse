import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface AdminTokenPayload {
  sub: string; // admin user id
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
}
