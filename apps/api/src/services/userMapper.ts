import type { User } from '@prisma/client';
import type { PublicUser } from '@khatwa/shared';
import { UserRole } from '@khatwa/shared';

/** يحوّل مستخدم Prisma إلى الشكل العام (بدون كلمة السر) — strip sensitive fields. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    grade: user.grade ?? null,
    level: user.level ?? null,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}
