import jwt from 'jsonwebtoken';
import type { UserRole } from '@khatwa/shared';
import { env, isProduction } from './env';

/** الحمولة المخزّنة في الـ JWT — token payload */
export interface JwtPayload {
  sub: string; // user id
  role: UserRole;
}

const TOKEN_TTL = '7d';

function getSecret(): string {
  if (env.JWT_SECRET) return env.JWT_SECRET;
  if (isProduction) {
    throw new Error('JWT_SECRET مطلوب في الإنتاج — set JWT_SECRET env var');
  }
  // قيمة تطوير فقط — dev-only fallback
  return 'khatwa-dev-secret-not-for-production';
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getSecret());
  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('Invalid token payload');
  }
  return { sub: String(decoded.sub), role: (decoded as JwtPayload).role };
}
