import type { Request, Response } from 'express';
import type { HealthResponse } from '@khatwa/shared';

/**
 * فحص صحة الخادم — Health check.
 * GET /health → { status: "ok", ... }
 */
export function getHealth(_req: Request, res: Response<HealthResponse>) {
  // build marker — يؤكّد أيّ نسخة كود تخدم فعلاً (guided step solver)
  const body = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    build: 'guided-1',
  };
  res.status(200).json(body);
}
