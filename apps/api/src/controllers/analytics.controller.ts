import type { Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { CLAUDE_MODEL, estimateCostUsd } from '../services/claude';

/** GET /api/admin/analytics — إحصائيات المنصة للأدمن. */
export async function adminAnalytics(_req: Request, res: Response) {
  const dayAgo = new Date(Date.now() - 86_400_000);

  const [students, activeToday, lessons, problems, aiCount, subs, tokensAgg, attempts] =
    await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'student', lastActive: { gte: dayAgo } } }),
      prisma.lesson.count(),
      prisma.problem.count(),
      prisma.aiSession.count(),
      prisma.subscription.findMany({ where: { status: 'active' }, select: { plan: true } }),
      prisma.aiSession.aggregate({ _sum: { tokensUsed: true } }),
      prisma.problemAttempt.count(),
    ]);

  const planCounts = subs.reduce<Record<string, number>>((acc, s) => {
    acc[s.plan] = (acc[s.plan] ?? 0) + 1;
    return acc;
  }, {});
  const paid = (planCounts.basic ?? 0) + (planCounts.premium ?? 0);
  const conversion = students ? Math.round((paid / students) * 100) : 0;

  const totalTokens = tokensAgg._sum.tokensUsed ?? 0;
  // تقدير التكلفة: نفترض ~85% إدخال 15% إخراج — rough split for cost estimate
  const aiCostUsd = estimateCostUsd(CLAUDE_MODEL, totalTokens * 0.85, totalTokens * 0.15);

  res.json({
    success: true,
    data: {
      students,
      activeToday,
      lessons,
      problems,
      attempts,
      aiSessions: aiCount,
      aiTokens: totalTokens,
      aiCostUsd: Number(aiCostUsd.toFixed(2)),
      planCounts,
      paid,
      conversion,
    },
  });
}
