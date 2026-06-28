import type { Request, Response } from 'express';
import { updateProfileSchema, changePasswordSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { hashPassword, verifyPassword } from '../utils/password';
import { toPublicUser } from '../services/userMapper';
import { ApiError } from '../utils/ApiError';

/** PUT /api/users/profile — تحديث الملف الشخصي. */
export async function updateProfile(req: Request, res: Response) {
  const input = updateProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.grade !== undefined && { grade: input.grade }),
      ...(input.level !== undefined && { level: input.level }),
      ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
    },
  });

  res.json({ success: true, data: toPublicUser(user) });
}

/** PUT /api/users/password — تغيير كلمة السر. */
export async function changePassword(req: Request, res: Response) {
  const input = changePasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user?.passwordHash) throw ApiError.badRequest('لا يمكن تغيير كلمة السر لهذا الحساب');

  const ok = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!ok) throw ApiError.badRequest('كلمة السر الحالية غير صحيحة');

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(input.newPassword) },
  });

  res.json({ success: true, data: { message: 'تم تغيير كلمة السر' } });
}
