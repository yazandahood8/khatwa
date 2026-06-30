import crypto from 'node:crypto';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

/**
 * تكامل PayPlus — Israeli PayPlus payment gateway.
 * المرجع: https://docs.payplus.co.il/reference (generateLink + IPN verification).
 * كل الدوال محميّة بالإعداد: إن لم تُضبط المفاتيح، يُستخدم المسار التجريبي بدلاً منها.
 *
 * ⚠️ صحيح حسب التوثيق لكنه غير مُختبَر بعد — يجب التحقق في بيئة PayPlus Sandbox
 * بمفاتيح حقيقية قبل التفعيل في الإنتاج (خصوصاً حقل حالة النجاح في الـ IPN).
 */

const GENERATE_LINK_PATH = '/api/v1.0/PaymentPages/generateLink';

/** هل PayPlus مهيأ للدفع الفعلي؟ — is PayPlus fully configured? */
export function isPayplusConfigured(): boolean {
  return Boolean(
    env.PAYPLUS_API_KEY && env.PAYPLUS_SECRET_KEY && env.PAYPLUS_PAYMENT_PAGE_UID && env.API_PUBLIC_URL,
  );
}

interface CreateLinkArgs {
  amount: number;
  description: string;
  /** نُعيد استقباله في الـ IPN لربط الدفع بالطالب والباقة — echoed back in the IPN. */
  moreInfo: string;
  customerName?: string | null;
  customerEmail?: string | null;
}

interface GenerateLinkResponse {
  results?: { status?: string; code?: number; description?: string };
  data?: { payment_page_link?: string; page_request_uid?: string };
}

/** يولّد رابط صفحة دفع PayPlus مستضافة — generate a hosted payment-page link. */
export async function createPaymentLink(a: CreateLinkArgs): Promise<{ url: string; pageRequestUid?: string }> {
  const body = {
    payment_page_uid: env.PAYPLUS_PAYMENT_PAGE_UID,
    amount: a.amount,
    currency_code: 'ILS',
    charge_method: 1, // 1 = تحصيل فوري (auto-renew via tokens is a follow-up)
    sendEmailApproval: true,
    refURL_success: `${env.WEB_ORIGIN}/settings/subscription?status=success`,
    refURL_failure: `${env.WEB_ORIGIN}/settings/subscription?status=failure`,
    refURL_cancel: `${env.WEB_ORIGIN}/pricing`,
    refURL_callback: `${env.API_PUBLIC_URL}/api/webhooks/payplus`,
    more_info: a.moreInfo,
    ...(a.customerName || a.customerEmail
      ? { customer: { customer_name: a.customerName ?? undefined, email: a.customerEmail ?? undefined } }
      : {}),
  };

  const res = await fetch(`${env.PAYPLUS_BASE_URL}${GENERATE_LINK_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.PAYPLUS_API_KEY as string,
      'secret-key': env.PAYPLUS_SECRET_KEY as string,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as GenerateLinkResponse;
  const url = json.data?.payment_page_link;
  if (!res.ok || !url) {
    logger.error(`PayPlus generateLink failed (${res.status}): ${JSON.stringify(json.results ?? json)}`);
    throw new Error('تعذّر إنشاء رابط الدفع');
  }
  return { url, pageRequestUid: json.data?.page_request_uid };
}

/**
 * توقيع الـ IPN — HMAC-SHA256(base64) of the JSON body with the secret key.
 * دالة نقيّة قابلة للاختبار — pure & testable (mirrors PayPlus's documented algorithm).
 */
export function ipnSignature(body: unknown, secret: string): string {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('base64');
}

/**
 * يتحقق أن الطلب جاء فعلاً من PayPlus — verify the IPN's `hash` header + `user-agent`.
 * يستخدم مقارنة ثابتة الزمن لمنع تسريب التوقيت.
 */
export function verifyIpn(body: unknown, hashHeader: string | undefined, userAgent: string | undefined): boolean {
  if (!env.PAYPLUS_SECRET_KEY || !hashHeader) return false;
  if (userAgent !== 'PayPlus') return false; // PayPlus يضبط user-agent ثابتاً
  const computed = ipnSignature(body, env.PAYPLUS_SECRET_KEY);
  const a = Buffer.from(computed);
  const b = Buffer.from(hashHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
