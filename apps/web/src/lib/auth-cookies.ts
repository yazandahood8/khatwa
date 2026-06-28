import type { UserRole } from '@khatwa/shared';

/**
 * تخزين بسيط للجلسة في الكوكيز — lightweight cookie session store.
 * - khatwa_token: الـ JWT (يُرسل للـ API)
 * - khatwa_role : دور المستخدم (يقرأه middleware لإعادة التوجيه)
 *
 * ملاحظة أمنية: ليست httpOnly لأن العميل يحتاج قراءتها؛ مقبول لهذه المرحلة.
 */
export const TOKEN_COOKIE = 'khatwa_token';
export const ROLE_COOKIE = 'khatwa_role';

const MAX_AGE = 60 * 60 * 24 * 7; // 7 أيام

export function setSession(token: string, role: UserRole) {
  if (typeof document === 'undefined') return;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  const attrs = `; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${TOKEN_COOKIE}=${token}${attrs}`;
  document.cookie = `${ROLE_COOKIE}=${role}${attrs}`;
}

export function clearSession() {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0`;
  document.cookie = `${ROLE_COOKIE}=; Path=/; Max-Age=0`;
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
