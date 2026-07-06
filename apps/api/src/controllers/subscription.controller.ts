import type { Request, Response } from 'express';
import { z } from 'zod';
import { SubscriptionPlan, AI_DAILY_LIMITS, AI_MONTHLY_LIMITS } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { isPayplusConfigured, createPaymentLink, verifyIpn } from '../services/payplus';

const ok = <T>(res: Response, data: T) => res.json({ success: true, data });

const PAID = [SubscriptionPlan.BASIC, SubscriptionPlan.PREMIUM] as const;
const upgradeSchema = z.object({ plan: z.enum(PAID) });
const adminSetSchema = z.object({ plan: z.nativeEnum(SubscriptionPlan) });

/** أسعار الباقات الشهرية بالشيكل — monthly plan prices (₪). */
const PRICE: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 0,
  [SubscriptionPlan.BASIC]: 49,
  [SubscriptionPlan.PREMIUM]: 79,
};

function monthFromNow(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d;
}

/** يضبط باقة الطالب (يستبدل الاشتراك الفعّال) — sets a student's plan. */
async function setPlan(studentId: string, plan: SubscriptionPlan, payplusRef?: string) {
  const active = await prisma.subscription.findFirst({ where: { studentId, status: 'active' } });
  const data = {
    plan,
    status: 'active' as const,
    endsAt: plan === SubscriptionPlan.FREE ? null : monthFromNow(),
    ...(payplusRef ? { payplusSubscriptionId: payplusRef } : {}),
  };
  return active
    ? prisma.subscription.update({ where: { id: active.id }, data })
    : prisma.subscription.create({ data: { studentId, ...data } });
}

/** GET /api/subscriptions/current — اشتراك الطالب الحالي + حد الأسئلة + حالة التجربة. */
export async function getCurrent(req: Request, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { studentId: req.user!.id, status: 'active' },
    orderBy: { createdAt: 'desc' },
  });

  const now = Date.now();
  const endsAt = sub?.endsAt ?? null;
  const rawPlan = (sub?.plan as SubscriptionPlan) ?? SubscriptionPlan.FREE;
  // انتهت التجربة/الاشتراك المدفوع ⇒ يُعرض كمجاني (نفس منطق getUserPlan).
  const expired = rawPlan !== SubscriptionPlan.FREE && !!endsAt && endsAt.getTime() < now;
  const plan = expired ? SubscriptionPlan.FREE : rawPlan;

  // تجربة = باقة مدفوعة بلا دفع فعلي عبر PayPlus (قبل ربط الدفع كلها تجارب/mock).
  const isTrial = !expired && rawPlan !== SubscriptionPlan.FREE && !sub?.payplusSubscriptionId;
  const trialDaysLeft =
    isTrial && endsAt ? Math.max(0, Math.ceil((endsAt.getTime() - now) / (1000 * 60 * 60 * 24))) : 0;

  ok(res, {
    plan,
    status: expired ? 'expired' : (sub?.status ?? 'active'),
    endsAt,
    aiDailyLimit: AI_DAILY_LIMITS[plan],
    aiMonthlyLimit: AI_MONTHLY_LIMITS[plan],
    isTrial,
    trialDaysLeft,
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

/**
 * POST /api/subscriptions/checkout — يبدأ الدفع.
 * إن كان PayPlus مهيأً يعيد { url } لتوجيه الطالب لصفحة الدفع؛ وإلا يفعّل الباقة مباشرة (تجريبي).
 */
export async function checkout(req: Request, res: Response) {
  const { plan } = upgradeSchema.parse(req.body);

  if (!isPayplusConfigured()) {
    const sub = await setPlan(req.user!.id, plan);
    ok(res, { mock: true, plan: sub.plan, status: sub.status, endsAt: sub.endsAt });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { name: true, email: true },
  });
  const { url } = await createPaymentLink({
    amount: PRICE[plan],
    description: `اشتراك ${plan} — منصّة خطوة`,
    moreInfo: `${req.user!.id}:${plan}`, // يُعاد في الـ IPN لربط الدفع بالطالب
    customerName: user?.name,
    customerEmail: user?.email,
  });
  ok(res, { url });
}

interface PayplusIpn {
  transaction?: { status_code?: string; uid?: string; more_info?: string };
  status_code?: string;
  transaction_uid?: string;
  more_info?: string;
}

/** POST /api/webhooks/payplus — إشعار PayPlus بنتيجة الدفع (IPN). بلا مصادقة، موثّق بالتوقيع. */
export async function payplusWebhook(req: Request, res: Response) {
  if (!verifyIpn(req.body, req.header('hash'), req.header('user-agent'))) {
    logger.warn('PayPlus IPN rejected — bad signature or user-agent');
    res.status(400).json({ success: false });
    return;
  }

  const body = req.body as PayplusIpn;
  const statusCode = body.transaction?.status_code ?? body.status_code;
  const moreInfo = body.more_info ?? body.transaction?.more_info;
  const txUid = body.transaction?.uid ?? body.transaction_uid;
  // سجّل لتأكيد أسماء الحقول عند أول اختبار في الـ sandbox
  logger.info(`PayPlus IPN: status=${statusCode} more_info=${moreInfo} tx=${txUid}`);

  // '000' = approved حسب توثيق PayPlus
  if (statusCode === '000' && typeof moreInfo === 'string' && moreInfo.includes(':')) {
    const [userId, plan] = moreInfo.split(':');
    if (userId && (plan === SubscriptionPlan.BASIC || plan === SubscriptionPlan.PREMIUM)) {
      const active = await prisma.subscription.findFirst({ where: { studentId: userId, status: 'active' } });
      if (!active || active.payplusSubscriptionId !== txUid) {
        await setPlan(userId, plan as SubscriptionPlan, txUid); // idempotent على نفس المعاملة
        logger.info(`✅ Subscription activated for ${userId} → ${plan} (tx ${txUid})`);
      }
    }
  }

  res.json({ success: true }); // أعد 200 دائماً بعد التحقق الناجح
}

// ----------------------- Admin -----------------------

/** GET /api/admin/subscriptions — كل الاشتراكات + الإيراد الشهري. */
export async function adminList(_req: Request, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    include: { student: { select: { id: true, name: true, email: true } } },
  });
  const monthlyRevenue = subs.reduce((sum, s) => sum + (PRICE[s.plan as SubscriptionPlan] ?? 0), 0);
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
