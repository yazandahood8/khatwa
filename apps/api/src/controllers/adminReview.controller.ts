import type { Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';

const ok = <T>(res: Response, data: T) => res.json({ success: true, data });

/** يعلّم إشعارات الطريقة كمقروءة — mark notifications for a method as read. */
async function markNotifRead(methodId: string) {
  await prisma.adminNotification.updateMany({
    where: { type: 'new_method', data: { path: ['methodId'], equals: methodId } },
    data: { isRead: true },
  });
}

/** GET /api/admin/new-methods — الطرق الجديدة المنتظرة للمراجعة. */
export async function listNewMethods(_req: Request, res: Response) {
  const methods = await prisma.solutionMethod.findMany({
    where: { isApproved: false, discoveredByStudent: { not: null } },
    orderBy: { createdAt: 'desc' },
    include: {
      steps: { orderBy: { stepNumber: 'asc' } },
      discoverer: { select: { name: true, email: true } },
      problem: { select: { id: true, question: true, finalAnswer: true, topicId: true } },
    },
  });
  ok(res, methods);
}

/** POST /api/admin/new-methods/:id/approve — اعتماد الطريقة كرسمية. */
export async function approveNewMethod(req: Request, res: Response) {
  const method = await prisma.solutionMethod.findUnique({ where: { id: req.params.id } });
  if (!method) throw ApiError.notFound('الطريقة غير موجودة');
  const updated = await prisma.solutionMethod.update({
    where: { id: req.params.id },
    data: { isApproved: true, name: req.body?.name?.trim() || method.name },
  });
  await markNotifRead(req.params.id);
  ok(res, updated);
}

/** POST /api/admin/new-methods/:id/reject — رفض وحذف الطريقة. */
export async function rejectNewMethod(req: Request, res: Response) {
  await markNotifRead(req.params.id);
  await prisma.solutionMethod.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}

/** GET /api/admin/notifications/count — عدد الإشعارات غير المقروءة (للشارة). */
export async function notificationCount(_req: Request, res: Response) {
  const newMethods = await prisma.adminNotification.count({
    where: { type: 'new_method', isRead: false },
  });
  ok(res, { newMethods });
}
