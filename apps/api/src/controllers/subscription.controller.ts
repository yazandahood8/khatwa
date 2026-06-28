import type { Request, Response } from 'express';
import { z } from 'zod';
import { SubscriptionPlan, AI_DAILY_LIMITS } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';

const ok = <T>(res: Response, data: T) => res.json({ success: true, data });

const PAID = [SubscriptionPlan.BASIC, SubscriptionPlan.PREMIUM] as const;
const upgradeSchema = z.object({ plan: z.enum(PAID) });
const adminSetSchema = z.object({ plan: z.nativeEnum(SubscriptionPlan) });

function monthFromNow(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
}

/** يضبط باقة الطالب (يستبدل الاشتراك الفعّال) — sets a student's plan. */
async function setPlan(studentId: string, plan: SubscriptionPlan) {
  const active = await prisma.subscription.findFirst({ where: { studentId, status: 'active' } });
  const data = {
    plan,
    status: 'active' as const,
    endsAt: plan === SubscriptionPlan.FREE ? null : monthFromNow(),
  };
  return active
    ? prisma.subscription.update({ where: { id: active.id }, data })
    : prisma.subscription.create({ data: { studentId, ...data } });
}

/** GET /api/subscriptions/current — اشتراك الطالب الحالي + حد الأسئلة. */
export async function getCurrent(req: Request, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { studentId: req.user!.id, status: 'active' },
    orderBy: { createdAt: 'desc' },
  });
  const plan = (sub?.plan as SubscriptionPlan) ?? SubscriptionPlan.FREE;
  ok(res, {
    plan,
    status: sub?.status ?? 'active',
    endsAt: sub?.endsAt ?? null,
    aiDailyLimit: AI_DAILY_LIMITS[plan],
  });
}

/** POST /api/subscriptions/upgrade — ترقية (تجريبي حتى ربط PayPlus). */
export async function upgrade(req: Request, res: Response) {
  const { plan } = upgradeSchema.parse(req.body);
  // ملاحظة: هذا مسار تجريبي بدون دفع فعلي — سيُستبدل بـ webhook من PayPlus في الجزء الثاني.
  const sub = await setPlan(req.user!.id, plan);
  ok(res, { plan: sub.plan, status: sub.status, endsAt: sub.endsAt, mock: true });
}

/** POST /api/subscriptions/cancel — إلغاء (العودة للمجاني). */
export async function cancel(req: Request, res: Response) {
  const sub = await setPlan(req.user!.id, SubscriptionPlan.FREE);
  ok(res, { plan: sub.plan, status: sub.status });
}

// ----------------------- Admin -----------------------

/** GET /api/admin/subscriptions — كل الاشتراكات + الإيراد الشهري. */
export async function adminList(_req: Request, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    include: { student: { select: { id: true, name: true, email: true } } },
  });
  const PRICE: Record<string, number> = { free: 0, basic: 49, premium: 79 };
  const monthlyRevenue = subs.reduce((sum, s) => sum + (PRICE[s.plan] ?? 0), 0);
  const counts = subs.reduce<Record<string, number>>((acc, s) => {
    acc[s.plan] = (acc[s.plan] ?? 0) + 1;
    return acc;
  }, {});
  ok(res, { subscriptions: subs, monthlyRevenue, counts });
}

/** PUT /api/admin/subscriptions/:studentId — منح/تغيير باقة طالب. */
export async function adminSetPlan(req: Request, res: Response) {
  const { plan } = adminSetSchema.parse(req.body);
  const student = await prisma.user.findUnique({ where: { id: req.params.studentId } });
  if (!student) throw ApiError.notFound('الطالب غير موجود');
  const sub = await setPlan(req.params.studentId, plan);
  ok(res, { plan: sub.plan, status: sub.status });
}
