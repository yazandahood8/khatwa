/**
 * وضع الصيانة — يحجب جميع المستخدمين إلا قائمة مسموح بها (allowlist).
 * يُتحكَّم به عبر متغيّري البيئة MAINTENANCE_MODE و ALLOWED_EMAILS (بدون تعديل كود).
 */
import { env } from './env';

const allowed = new Set(
  env.ALLOWED_EMAILS.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

/** هل وضع الصيانة مفعّل؟ */
export const maintenanceOn = (): boolean => env.MAINTENANCE_MODE;

/** هل هذا البريد ضمن القائمة المسموح لها أثناء الصيانة؟ */
export const isEmailAllowed = (email: string): boolean => allowed.has(email.trim().toLowerCase());

/** خطأ الصيانة الموحّد — الكود MAINTENANCE يلتقطه العميل ليسجّل الخروج فوراً. */
import { ApiError } from './ApiError';
export const maintenanceError = () =>
  new ApiError(503, 'MAINTENANCE', 'الموقع تحت الصيانة حالياً. سيعود قريباً بإذن الله.');
