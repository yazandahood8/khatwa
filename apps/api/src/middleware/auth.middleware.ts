import type { RequestHandler } from 'express';
import type { UserRole } from '@khatwa/shared';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

/**
 * يتطلب تسجيل دخول — requires a valid Bearer token.
 * يضع req.user = { id, role } عند النجاح.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('مطلوب تسجيل الدخول'));
  }
  try {
    const payload = verifyToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized('جلسة غير صالحة أو منتهية'));
  }
};

/**
 * يتطلب دوراً محدداً — restricts to one of the given roles.
 * يجب أن يأتي بعد requireAuth.
 */
export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized('مطلوب تسجيل الدخول'));
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('ليس لديك صلاحية للوصول'));
    }
    next();
  };
}
