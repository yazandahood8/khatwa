import rateLimit from 'express-rate-limit';

/**
 * تحديد محاولات المصادقة — auth rate limiter.
 * 5 محاولات لكل دقيقة لكل IP (خطة Sprint 2).
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'محاولات كثيرة جداً — حاول مرة أخرى بعد دقيقة',
    },
  },
});
