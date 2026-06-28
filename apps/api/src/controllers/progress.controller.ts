import type { Request, Response } from 'express';
import { saveProgressSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';

const ok = <T>(res: Response, data: T) => res.json({ success: true, data });

/** POST /api/lessons/:id/progress — حفظ تقدّم المشاهدة (طالب). */
export async function saveProgress(req: Request, res: Response) {
  const input = saveProgressSchema.parse(req.body);
  const studentId = req.user!.id;
  const lessonId = req.params.id;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw ApiError.notFound('الدرس غير موجود');

  const progress = await prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId, lessonId } },
    create: {
      studentId,
      lessonId,
      watchTimeSeconds: input.watchTimeSeconds,
      completedAt: input.completed ? new Date() : null,
    },
    update: {
      watchTimeSeconds: input.watchTimeSeconds,
      ...(input.completed ? { completedAt: new Date() } : {}),
    },
  });
  ok(res, progress);
}

/** GET /api/me/progress — كل تقدّم الطالب (لعرض الحالات). */
export async function myProgress(req: Request, res: Response) {
  const rows = await prisma.lessonProgress.findMany({
    where: { studentId: req.user!.id },
    select: { lessonId: true, watchTimeSeconds: true, completedAt: true },
  });
  ok(res, rows);
}

/** GET /api/me/dashboard — ملخّص لوحة الطالب. */
export async function studentDashboard(req: Request, res: Response) {
  const studentId = req.user!.id;

  const [last, completedCount, inProgressCount] = await Promise.all([
    prisma.lessonProgress.findFirst({
      where: { studentId, completedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: { lesson: { include: { topic: true } } },
    }),
    prisma.lessonProgress.count({ where: { studentId, completedAt: { not: null } } }),
    prisma.lessonProgress.count({ where: { studentId, completedAt: null } }),
  ]);

  ok(res, {
    lastLesson: last
      ? {
          id: last.lesson.id,
          title: last.lesson.title,
          topicId: last.lesson.topicId,
          topicName: last.lesson.topic.nameAr,
          watchTimeSeconds: last.watchTimeSeconds,
          durationMinutes: last.lesson.durationMinutes,
        }
      : null,
    completedCount,
    inProgressCount,
  });
}
