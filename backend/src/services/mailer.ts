import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

/**
 * بريد المعاملات — provider-agnostic transactional email over SMTP.
 * يعمل مع أي مزوّد (Resend / SES / Mailgun / Gmail…) عبر متغيرات SMTP.
 * إن لم يُضبط SMTP، تُسجَّل الرسالة في اللوج بدل إرسالها (مناسب للتطوير).
 */

let transporter: Transporter | null = null;

/** هل البريد مهيأ للإرسال الفعلي؟ — is SMTP configured for real delivery? */
export function isMailConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.MAIL_FROM);
}

function getTransport(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // 465 = TLS مباشر؛ 587 = STARTTLS
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * يرسل بريداً — sends an email via SMTP, or logs it when SMTP is unset.
 * لا يرمي للأعلى عند فشل الإرسال حتى لا يُسقِط طلب المستخدم؛ يكتفي بتسجيل الخطأ.
 */
export async function sendEmail(msg: MailMessage): Promise<void> {
  const t = getTransport();
  if (!t) {
    logger.info(`📧 [mail disabled] to=${msg.to} subject="${msg.subject}" (اضبط SMTP_* للإرسال الفعلي)`);
    return;
  }
  try {
    await t.sendMail({
      from: env.MAIL_FROM,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    });
    logger.info(`📧 sent "${msg.subject}" → ${msg.to}`);
  } catch (err) {
    logger.error('email send failed', err instanceof Error ? err.message : err);
  }
}
