import type { Request, Response } from 'express';
import { saveProgressSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';
import { computeStudentStats } from '../services/stats';

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

/**
 * GET /api/me/progress/subjects — لكل مادة: عدد دروس صفّ الطالب المنشورة وكم أكمل منها.
 * - طالب 7-9: دروس صفّه فقط. طالب ثانوي: دروس مسارات الوحدات (ومساره فقط إن اختاره وكان له دروس).
 * - غير ذلك (ولي أمر/مدير/طالب بلا صف): كل الدروس.
 * المادة تُستنتج من: topic → level → (grade → subject | subject) أو topic → questionnaire → level → subject.
 */
export async function subjectProgress(req: Request, res: Response) {
  const me = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { role: true, grade: true, level: true },
  });
  const student = me?.role === 'student';
  const grade = student ? (me?.grade ?? null) : null;
  const level = student ? (me?.level ?? null) : null;
  const restricted = grade != null || level != null;
  const highSchool = level != null || (grade != null && grade >= 10);

  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      topic: {
        select: {
          level: {
            select: {
              subjectId: true,
              unitLevel: true,
              grade: { select: { subjectId: true, gradeNumber: true } },
            },
          },
          questionnaire: { select: { level: { select: { subjectId: true, unitLevel: true } } } },
        },
      },
    },
  });
  const done = new Set(
    (
      await prisma.lessonProgress.findMany({
        where: { studentId: req.user!.id, completedAt: { not: null } },
        select: { lessonId: true },
      })
    ).map((r) => r.lessonId),
  );

  interface Item { id: string; subjectId: string; gradeNumber: number | null; unit: string | null }
  const items: Item[] = [];
  for (const l of lessons) {
    const lv = l.topic.level;
    const track = lv?.grade ? null : (lv ?? l.topic.questionnaire?.level ?? null);
    const subjectId = lv?.grade?.subjectId ?? track?.subjectId ?? null;
    if (!subjectId) continue;
    items.push({
      id: l.id,
      subjectId,
      gradeNumber: lv?.grade?.gradeNumber ?? null,
      unit: track?.unitLevel ? `${track.unitLevel} وحدات` : null,
    });
  }

  // مسار الوحدات الخاص بالطالب؛ إن لم يكن له دروس في المادة نعدّ كل مسارات الثانوي (كما في الواجهة).
  const hasMyTrack = (subjectId: string) =>
    level != null && items.some((i) => i.subjectId === subjectId && i.gradeNumber == null && i.unit === level);

  const mine = items.filter((i) => {
    if (!restricted) return true;
    if (!highSchool) return i.gradeNumber === grade;
    if (i.gradeNumber != null) return false;
    return level == null || !hasMyTrack(i.subjectId) || i.unit === level;
  });

  const bySubject = new Map<string, { subjectId: string; total: number; completed: number }>();
  for (const i of mine) {
    const row = bySubject.get(i.subjectId) ?? { subjectId: i.subjectId, total: 0, completed: 0 };
    row.total += 1;
    if (done.has(i.id)) row.completed += 1;
    bySubject.set(i.subjectId, row);
  }
  ok(res, [...bySubject.values()]);
}

/** GET /api/progress/me — إحصائيات الطالب الكاملة (نقاط، إنجازات، سلسلة…). */
export async function fullProgress(req: Request, res: Response) {
  ok(res, await computeStudentStats(req.user!.id));
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
