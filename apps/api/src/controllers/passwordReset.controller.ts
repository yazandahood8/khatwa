import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { forgotPasswordSchema, resetPasswordSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { redis } from '../services/redis';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { env, isProduction } from '../utils/env';

const RESET_TTL_SECONDS = 60 * 60; // ساعة واحدة
const redisKey = (token: string) => `pwreset:${token}`;

/**
 * POST /api/auth/forgot-password — يطلب رابط إعادة التعيين.
 * ملاحظة: إرسال البريد غير مفعّل بعد (يحتاج مزود بريد) — يُسجَّل الرابط في اللوج،
 * وفي بيئة التطوير يُعاد ضمن الاستجابة لتسهيل الاختبار.
 */
export async function forgotPassword(req: Request, res: Response) {
  const { email } = forgotPasswordSchema.parse(req.body);

  if (!redis) throw ApiError.internal('خدمة إعادة التعيين غير مهيأة (Redis مطلوب)');

  const user = await prisma.user.findUnique({ where: { email } });

  // لا نكشف إن كان البريد مسجّلاً أم لا — same response either way.
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(redisKey(token), user.id, 'EX', RESET_TTL_SECONDS);

    const resetUrl = `${env.WEB_ORIGIN}/reset-password?token=${token}`;
    logger.info(`🔑 Password reset link for ${email}: ${resetUrl}`);

    if (!isProduction) {
      return res.json({ success: true, data: { message: 'تم إنشاء رابط إعادة التعيين', resetUrl } });
    }
  }

  res.json({
    success: true,
    data: { message: 'إذا كان البريد مسجّلاً، فستصلك رسالة لإعادة التعيين' },
  });
}

/** POST /api/auth/reset-password — يعيّن كلمة سر جديدة باستخدام الرمز. */
export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = resetPasswordSchema.parse(req.body);

  if (!redis) throw ApiError.internal('خدمة إعادة التعيين غير مهيأة (Redis مطلوب)');

  const userId = await redis.get(redisKey(token));
  if (!userId) throw ApiError.badRequest('رابط غير صالح أو منتهي الصلاحية');

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  await redis.del(redisKey(token));

  res.json({ success: true, data: { message: 'تم تعيين كلمة السر الجديدة' } });
}
