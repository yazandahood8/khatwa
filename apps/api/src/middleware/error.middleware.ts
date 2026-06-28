import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { isProduction } from '../utils/env';

/**
 * مُعالج الأخطاء المركزي — Central error handler.
 * يجب تسجيله بعد كل المسارات (last middleware).
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // أخطاء التحقق من Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'بيانات غير صالحة',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // أخطاء API المعروفة
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // أخطاء غير متوقعة
  logger.error('Unhandled error', err instanceof Error ? err.stack : err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'خطأ داخلي في الخادم',
      ...(isProduction ? {} : { details: err instanceof Error ? err.message : String(err) }),
    },
  });
};
