import type { RequestHandler } from 'express';

/**
 * مُعالج المسارات غير الموجودة — 404 handler.
 * يُسجَّل بعد كل المسارات وقبل error handler.
 */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `المسار غير موجود: ${req.method} ${req.originalUrl}`,
    },
  });
};
