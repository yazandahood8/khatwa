import type { Request, Response } from 'express';
import { registerSchema, loginSchema, UserRole, type AuthResponse } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { toPublicUser } from '../services/userMapper';
import { ApiError } from '../utils/ApiError';
import { env } from '../utils/env';
import { maintenanceOn, isEmailAllowed, maintenanceError } from '../utils/maintenance';

/** اشتراك الطالب الافتراضي عند التسجيل — free, أو premium لشهر أثناء البيتا المغلقة. */
function defaultStudentSubscription() {
  if (!env.BETA_AUTO_PREMIUM) return { plan: 'free' as const, status: 'active' as const };
  const endsAt = new Date();
  endsAt.setMonth(endsAt.getMonth() + 1); // شهر بريميوم مجاني للبيتا
  return { plan: 'premium' as const, status: 'active' as const, endsAt };
}

/** POST /api/auth/register — إنشاء حساب جديد (طالب أو ولي أمر). */
export async function register(req: Request, res: Response<{ success: true; data: AuthResponse }>) {
  const input = registerSchema.parse(req.body);

  // أثناء الصيانة: امنع تسجيل غير المسموح لهم
  if (maintenanceOn() && !isEmailAllowed(input.email)) throw maintenanceError();

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.badRequest('هذا البريد الإلكتروني مسجّل بالفعل');
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      role: input.role,
      grade: input.role === UserRole.STUDENT ? (input.grade ?? null) : null,
      level: input.role === UserRole.STUDENT ? (input.level ?? null) : null,
      // اشتراك الطالب الافتراضي — free (أو premium للبيتا عبر BETA_AUTO_PREMIUM)
      ...(input.role === UserRole.STUDENT
        ? { subscriptions: { create: defaultStudentSubscription() } }
        : {}),
    },
  });

  const token = signToken({ sub: user.id, role: user.role as UserRole });
  res.status(201).json({ success: true, data: { user: toPublicUser(user), token } });
}

/** POST /api/auth/login — تسجيل الدخول. */
export async function login(req: Request, res: Response<{ success: true; data: AuthResponse }>) {
  const input = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized('البريد الإلكتروني أو كلمة السر غير صحيحة');
  }

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) {
    throw ApiError.unauthorized('البريد الإلكتروني أو كلمة السر غير صحيحة');
  }

  // أثناء الصيانة: امنع دخول غير المسموح لهم
  if (maintenanceOn() && !isEmailAllowed(user.email)) throw maintenanceError();

  await prisma.user.update({ where: { id: user.id }, data: { lastActive: new Date() } });

  const token = signToken({ sub: user.id, role: user.role as UserRole });
  res.status(200).json({ success: true, data: { user: toPublicUser(user), token } });
}

/** GET /api/auth/me — بيانات المستخدم الحالي. */
export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) throw ApiError.notFound('المستخدم غير موجود');
  res.json({ success: true, data: toPublicUser(user) });
}

/** POST /api/auth/logout — الخروج (إبطال من جهة العميل). */
export async function logout(_req: Request, res: Response) {
  // التوكن عديم الحالة — العميل يحذفه. (قائمة إبطال يمكن إضافتها لاحقاً عبر Redis)
  res.json({ success: true, data: { message: 'تم تسجيل الخروج' } });
}
