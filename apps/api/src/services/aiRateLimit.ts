import { AI_DAILY_LIMITS, SubscriptionPlan } from '@khatwa/shared';
import { prisma } from './prisma';
import { redis } from './redis';
import { env } from '../utils/env';

/**
 * تحديد باقة الطالب — resolve the student's plan.
 * يبحث عن اشتراك فعّال؛ وإلا يعتمد AI_DEFAULT_PLAN (premium أثناء البيتا قبل تفعيل الدفع).
 */
export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  const sub = await prisma.subscription.findFirst({
    where: { studentId: userId, status: 'active' },
    orderBy: { createdAt: 'desc' },
    select: { plan: true },
  });
  return (sub?.plan as SubscriptionPlan) ?? (env.AI_DEFAULT_PLAN as SubscriptionPlan);
}

function dayKey(userId: string): string {
  // تاريخ اليوم بتوقيت إسرائيل — reset the daily quota at local (Asia/Jerusalem) midnight, not UTC.
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date()); // YYYY-MM-DD
  return `ai:quota:${userId}:${date}`;
}

export interface Quota {
  plan: SubscriptionPlan;
  limit: number;
  used: number;
  remaining: number;
  unlimited?: boolean;
}

const UNLIMITED: Quota = {
  plan: SubscriptionPlan.PREMIUM,
  limit: -1,
  used: 0,
  remaining: -1,
  unlimited: true,
};

/** يقرأ الحصة الحالية بدون زيادة — read today's usage without incrementing. */
export async function getQuota(userId: string, role?: string): Promise<Quota> {
  if (role === 'admin') return UNLIMITED; // الأدمن بلا حدود
  const plan = await getUserPlan(userId);
  const limit = AI_DAILY_LIMITS[plan];
  const used = redis ? Number((await redis.get(dayKey(userId))) ?? 0) : 0;
  return { plan, limit, used, remaining: Math.max(0, limit - used) };
}

/** يُرجِع سؤالاً للطالب — refund one question (e.g. when the AI call fails). */
export async function refundQuota(userId: string): Promise<void> {
  if (!redis) return;
  const used = Number((await redis.get(dayKey(userId))) ?? 0);
  if (used > 0) await redis.decr(dayKey(userId));
}

/**
 * يتحقق ويزيد العدّاد — check the daily limit and increment.
 * يرمي خطأ بكود RATE_LIMITED إذا تجاوز الحد.
 */
export async function consumeQuota(userId: string, role?: string): Promise<Quota> {
  if (role === 'admin') return UNLIMITED; // الأدمن بلا حدود ولا عدّاد
  const plan = await getUserPlan(userId);
  const limit = AI_DAILY_LIMITS[plan];

  if (!redis) {
    // بدون Redis لا نحدّد (تطوير فقط) — no limiting without Redis (dev fallback)
    return { plan, limit, used: 0, remaining: limit };
  }

  const key = dayKey(userId);
  const used = await redis.incr(key);
  if (used === 1) await redis.expire(key, 60 * 60 * 48); // ينتهي بعد يومين كأمان

  if (used > limit) {
    await redis.decr(key); // تراجع — don't count the blocked request
    const err = new Error('تجاوزت حدّك اليومي من الأسئلة') as Error & { code?: string };
    err.code = 'RATE_LIMITED';
    throw err;
  }

  return { plan, limit, used, remaining: Math.max(0, limit - used) };
}
