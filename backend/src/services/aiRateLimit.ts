import { AI_DAILY_LIMITS, AI_MONTHLY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { prisma } from './prisma';
import { redis } from './redis';
import { env } from '../utils/env';

/**
 * تحديد باقة الطالب — resolve the student's plan.
 * يبحث عن اشتراك فعّال؛ وإلا يعتمد AI_DEFAULT_PLAN (الافتراضي free لضبط تكلفة الـ AI).
 * بريميوم البيتا يُمنح كاشتراك فعّال عند التسجيل عبر BETA_AUTO_PREMIUM — لا عبر هذا الافتراضي.
 */
export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  const sub = await prisma.subscription.findFirst({
    where: { studentId: userId, status: 'active' },
    orderBy: { createdAt: 'desc' },
    select: { plan: true, endsAt: true },
  });
  if (!sub) return env.AI_DEFAULT_PLAN as SubscriptionPlan;
  // انتهت التجربة/الاشتراك المدفوع ⇒ يعود للمجاني (التجربة 7 أيام تُفرض هنا).
  if (sub.plan !== SubscriptionPlan.FREE && sub.endsAt && sub.endsAt.getTime() < Date.now()) {
    return SubscriptionPlan.FREE;
  }
  return (sub.plan as SubscriptionPlan) ?? (env.AI_DEFAULT_PLAN as SubscriptionPlan);
}

function dayKey(userId: string): string {
  // تاريخ اليوم بتوقيت إسرائيل — reset the daily quota at local (Asia/Jerusalem) midnight, not UTC.
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date()); // YYYY-MM-DD
  return `ai:quota:${userId}:${date}`;
}

function monthKey(userId: string): string {
  // الشهر بتوقيت إسرائيل — hard monthly cap, resets at local month boundary (YYYY-MM).
  const ym = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' })
    .format(new Date())
    .slice(0, 7); // YYYY-MM
  return `ai:quota:m:${userId}:${ym}`;
}

export interface Quota {
  plan: SubscriptionPlan;
  limit: number; // الحد اليومي
  used: number; // المستهلك اليوم
  remaining: number; // المتبقي الفعّال = min(المتبقي اليومي, المتبقي الشهري)
  monthlyLimit: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  unlimited?: boolean;
}

const UNLIMITED: Quota = {
  plan: SubscriptionPlan.PREMIUM,
  limit: -1,
  used: 0,
  remaining: -1,
  monthlyLimit: -1,
  monthlyUsed: 0,
  monthlyRemaining: -1,
  unlimited: true,
};

/** يبني كائن الحصة من العدّادين — combine daily + monthly into the effective quota. */
function buildQuota(plan: SubscriptionPlan, dailyUsed: number, monthlyUsed: number): Quota {
  const limit = AI_DAILY_LIMITS[plan];
  const monthlyLimit = AI_MONTHLY_LIMITS[plan];
  const dailyRemaining = Math.max(0, limit - dailyUsed);
  const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed);
  return {
    plan,
    limit,
    used: dailyUsed,
    remaining: Math.min(dailyRemaining, monthlyRemaining), // الأصغر يحكم
    monthlyLimit,
    monthlyUsed,
    monthlyRemaining,
  };
}

/** يقرأ الحصة الحالية بدون زيادة — read today's + this month's usage without incrementing. */
export async function getQuota(userId: string, role?: string): Promise<Quota> {
  if (role === 'admin') return UNLIMITED; // الأدمن بلا حدود
  const plan = await getUserPlan(userId);
  if (!redis) return buildQuota(plan, 0, 0);
  const dailyUsed = Number((await redis.get(dayKey(userId))) ?? 0);
  const monthlyUsed = Number((await redis.get(monthKey(userId))) ?? 0);
  return buildQuota(plan, dailyUsed, monthlyUsed);
}

/** يُرجِع سؤالاً للطالب — refund one question on both counters (e.g. when the AI call fails). */
export async function refundQuota(userId: string): Promise<void> {
  if (!redis) return;
  const dKey = dayKey(userId);
  const mKey = monthKey(userId);
  if (Number((await redis.get(dKey)) ?? 0) > 0) await redis.decr(dKey);
  if (Number((await redis.get(mKey)) ?? 0) > 0) await redis.decr(mKey);
}

/**
 * يتحقق ويزيد العدّادين — check both the daily and the hard monthly limit, then increment.
 * يرمي خطأ بكود RATE_LIMITED إذا تجاوز أيّ حد (يُبيّن أيّهما في الرسالة).
 */
export async function consumeQuota(userId: string, role?: string): Promise<Quota> {
  if (role === 'admin') return UNLIMITED; // الأدمن بلا حدود ولا عدّاد
  const plan = await getUserPlan(userId);
  const limit = AI_DAILY_LIMITS[plan];
  const monthlyLimit = AI_MONTHLY_LIMITS[plan];

  if (!redis) {
    // بدون Redis لا نحدّد (تطوير فقط) — no limiting without Redis (dev fallback)
    return buildQuota(plan, 0, 0);
  }

  const dKey = dayKey(userId);
  const mKey = monthKey(userId);

  const dailyUsed = await redis.incr(dKey);
  if (dailyUsed === 1) await redis.expire(dKey, 60 * 60 * 48); // يومان كأمان
  const monthlyUsed = await redis.incr(mKey);
  if (monthlyUsed === 1) await redis.expire(mKey, 60 * 60 * 24 * 40); // 40 يوماً كأمان

  const overDaily = dailyUsed > limit;
  const overMonthly = monthlyUsed > monthlyLimit;
  if (overDaily || overMonthly) {
    await redis.decr(dKey); // تراجع — don't count the blocked request
    await redis.decr(mKey);
    const err = new Error(
      overMonthly ? 'تجاوزت حدّك الشهري من الأسئلة' : 'تجاوزت حدّك اليومي من الأسئلة',
    ) as Error & { code?: string };
    err.code = 'RATE_LIMITED';
    throw err;
  }

  return buildQuota(plan, dailyUsed, monthlyUsed);
}
