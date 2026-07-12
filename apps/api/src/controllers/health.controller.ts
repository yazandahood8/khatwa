import type { Request, Response } from 'express';
import type { HealthResponse } from '@khatwa/shared';

/**
 * فحص صحة الخادم — Health check.
 * GET /health → { status: "ok", ... }
 */
export function getHealth(_req: Request, res: Response<HealthResponse>) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
