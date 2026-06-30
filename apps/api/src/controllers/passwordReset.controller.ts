import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { forgotPasswordSchema, resetPasswordSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { redis } from '../services/redis';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { env, isProduction } from '../utils/env';
import { sendEmail, isMailConfigured } from '../services/mailer';

const RESET_TTL_SECONDS = 60 * 60; // ساعة واحدة
const redisKey = (token: string) => `pwreset:${token}`;

/** قالب بريد إعادة التعيين (RTL) — reset-password email template. */
function resetEmail(resetUrl: string, name: string) {
  const html = `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1f2937;line-height:1.7">
  <h2 style="color:#6c63ff;margin:0 0 12px">منصّة خطوة</h2>
  <p>مرحباً ${name},</p>
  <p>وصلنا طلب لإعادة تعيين كلمة السر لحسابك. اضغط الزر أدناه لتعيين كلمة سر جديدة:</p>
  <p style="text-align:center;margin:24px 0">
    <a href="${resetUrl}" style="background:#6c63ff;color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;display:inline-block">إعادة تعيين كلمة السر</a>
  </p>
  <p style="color:#6b7280;font-size:13px">الرابط صالح لمدة ساعة واحدة. إذا لم تطلب هذا، تجاهل الرسالة وكلمة سرّك تبقى كما هي.</p>
</div>`;
  const text = `مرحباً ${name}،\nلإعادة تعيين كلمة السر افتح الرابط التالي (صالح لمدة ساعة):\n${resetUrl}\nإذا لم تطلب هذا، تجاهل الرسالة.`;
  return { subject: 'إعادة تعيين كلمة السر — خطوة', html, text };
}

/**
 * POST /api/auth/forgot-password — يطلب رابط إعادة التعيين ويُرسله بالبريد.
 * عند غياب إعداد SMTP يُسجَّل الرابط في اللوج، وفي التطوير يُعاد ضمن الاستجابة لتسهيل الاختبار.
 * لا نكشف أبداً إن كان البريد مسجّلاً (نفس الرسالة في كل الحالات).
 */
export async function forgotPassword(req: Request, res: Response) {
  const { email } = forgotPasswordSchema.parse(req.body);

  if (!redis) throw ApiError.internal('خدمة إعادة التعيين غير مهيأة (Redis مطلوب)');

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(redisKey(token), user.id, 'EX', RESET_TTL_SECONDS);

    const resetUrl = `${env.WEB_ORIGIN}/reset-password?token=${token}`;
    logger.info(`🔑 Password reset requested for ${email}`);

    const { subject, html, text } = resetEmail(resetUrl, user.name);
    await sendEmail({ to: email, subject, html, text });

    // تسهيل التطوير فقط: أعِد الرابط عندما لا يوجد بريد فعلي مُهيأ.
    if (!isProduction && !isMailConfigured()) {
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
