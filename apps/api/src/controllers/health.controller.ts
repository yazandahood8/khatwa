import type { Request, Response } from 'express';
import type { HealthResponse } from '@khatwa/shared';
import { SOLVE_GRAPHS } from '../data/solveGraphs';
import { evaluateGuided } from '../services/guidedSolve';

/**
 * فحص صحة الخادم — Health check (+ تشخيص المحرّك الموجّه مؤقّتاً).
 * GET /health → { status: "ok", ... }
 */
export function getHealth(_req: Request, res: Response<HealthResponse>) {
  // تشخيص: هل المحرّك الموجّه المنشور يعمل فعلاً؟ يشغّله على مدخل معروف.
  const pid = 'cmqzjp1vo0042nbs81w2wx0d4';
  let guidedSelftest = 'n/a';
  try {
    const graph = SOLVE_GRAPHS[pid];
    const g = graph ? evaluateGuided(graph, [], '5x') : null;
    guidedSelftest = g ? g.kind : 'null';
  } catch (e) {
    guidedSelftest = 'err:' + (e instanceof Error ? e.message : String(e));
  }
  const body = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    build: 'guided-2',
    guidedGraphs: Object.keys(SOLVE_GRAPHS).length,
    guidedSelftest,
  };
  res.status(200).json(body);
}
