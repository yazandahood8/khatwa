/* eslint-disable no-console */

/**
 * مُسجِّل بسيط — Minimal logger.
 * يُستبدل لاحقاً بـ pino/winston عند الحاجة.
 */
export const logger = {
  info: (message: string, meta?: unknown) =>
    console.log(`[INFO] ${message}`, meta ?? ''),
  warn: (message: string, meta?: unknown) =>
    console.warn(`[WARN] ${message}`, meta ?? ''),
  error: (message: string, meta?: unknown) =>
    console.error(`[ERROR] ${message}`, meta ?? ''),
};
