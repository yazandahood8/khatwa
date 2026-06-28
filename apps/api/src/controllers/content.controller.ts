import type { Request, Response } from 'express';
import {
  createSubjectSchema,
  updateSubjectSchema,
  createGradeSchema,
  createLevelSchema,
  createTopicSchema,
  updateTopicSchema,
  createLessonSchema,
  updateLessonSchema,
} from '@khatwa/shared';
import { SubscriptionPlan } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';
import { presignUpload, presignDownload, isStorageConfigured } from '../services/storage';
import { getUserPlan } from '../services/aiRateLimit';

/**
 * بوابة الوصول للدرس حسب الباقة — lesson access gate by plan.
 * المجاني: أول درس فقط في كل موضوع. المدفوع/الأدمن: كل الدروس.
 */
async function assertLessonAccess(req: Request, lesson: { id: string; topicId: string }) {
  if (req.user?.role === 'admin') return;
  const plan = await getUserPlan(req.user!.id);
  if (plan !== SubscriptionPlan.FREE) return;
  const first = await prisma.lesson.findFirst({
    where: { topicId: lesson.topicId, isPublished: true },
    orderBy: { orderIndex: 'asc' },
    select: { id: true },
  });
  if (first && lesson.id !== first.id) {
    throw new ApiError(403, 'UPGRADE_REQUIRED', 'هذا الدرس للباقات المدفوعة — رقّ باقتك للمتابعة');
  }
}

const ok = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({ success: true, data });

// ----------------------- Subjects -----------------------

export async function listSubjects(_req: Request, res: Response) {
  const subjects = await prisma.subject.findMany({
    orderBy: { orderIndex: 'asc' },
    include: { _count: { select: { grades: true } } },
  });
  ok(res, subjects);
}

export async function createSubject(req: Request, res: Response) {
  const input = createSubjectSchema.parse(req.body);
  const subject = await prisma.subject.create({ data: input });
  ok(res, subject, 201);
}

export async function updateSubject(req: Request, res: Response) {
  const input = updateSubjectSchema.parse(req.body);
  const subject = await prisma.subject.update({ where: { id: req.params.id }, data: input });
  ok(res, subject);
}

export async function deleteSubject(req: Request, res: Response) {
  await prisma.subject.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}

// ----------------------- Grades -----------------------

export async function listGrades(req: Request, res: Response) {
  const subjectId = req.query.subjectId as string | undefined;
  const grades = await prisma.grade.findMany({
    where: subjectId ? { subjectId } : undefined,
    orderBy: { gradeNumber: 'asc' },
    include: { _count: { select: { levels: true } } },
  });
  ok(res, grades);
}

export async function createGrade(req: Request, res: Response) {
  const input = createGradeSchema.parse(req.body);
  const exists = await prisma.grade.findUnique({
    where: { subjectId_gradeNumber: { subjectId: input.subjectId, gradeNumber: input.gradeNumber } },
  });
  if (exists) throw ApiError.badRequest('هذا الصف موجود بالفعل لهذه المادة');
  const grade = await prisma.grade.create({ data: input });
  ok(res, grade, 201);
}

export async function deleteGrade(req: Request, res: Response) {
  await prisma.grade.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}

// ----------------------- Levels -----------------------

export async function listLevels(req: Request, res: Response) {
  const gradeId = req.query.gradeId as string | undefined;
  const levels = await prisma.level.findMany({
    where: gradeId ? { gradeId } : undefined,
    include: { _count: { select: { topics: true } } },
  });
  ok(res, levels);
}

export async function createLevel(req: Request, res: Response) {
  const input = createLevelSchema.parse(req.body);
  const level = await prisma.level.create({ data: input });
  ok(res, level, 201);
}

export async function deleteLevel(req: Request, res: Response) {
  await prisma.level.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}

// ----------------------- Topics -----------------------

export async function listTopics(req: Request, res: Response) {
  const levelId = req.query.levelId as string | undefined;
  const topics = await prisma.topic.findMany({
    where: levelId ? { levelId } : undefined,
    orderBy: { orderIndex: 'asc' },
    include: { _count: { select: { lessons: true, problems: true } } },
  });
  ok(res, topics);
}

export async function createTopic(req: Request, res: Response) {
  const input = createTopicSchema.parse(req.body);
  const topic = await prisma.topic.create({ data: input });
  ok(res, topic, 201);
}

export async function updateTopic(req: Request, res: Response) {
  const input = updateTopicSchema.parse(req.body);
  const topic = await prisma.topic.update({ where: { id: req.params.id }, data: input });
  ok(res, topic);
}

export async function deleteTopic(req: Request, res: Response) {
  await prisma.topic.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}

// ----------------------- Lessons -----------------------

export async function listLessons(req: Request, res: Response) {
  const topicId = req.query.topicId as string | undefined;
  const publishedOnly = req.query.published === 'true';
  const lessons = await prisma.lesson.findMany({
    where: {
      ...(topicId ? { topicId } : {}),
      ...(publishedOnly ? { isPublished: true } : {}),
    },
    orderBy: { orderIndex: 'asc' },
  });
  ok(res, lessons);
}

export async function getLesson(req: Request, res: Response) {
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
  if (!lesson) throw ApiError.notFound('الدرس غير موجود');
  ok(res, lesson);
}

export async function createLesson(req: Request, res: Response) {
  const input = createLessonSchema.parse(req.body);
  const lesson = await prisma.lesson.create({ data: input });
  ok(res, lesson, 201);
}

export async function updateLesson(req: Request, res: Response) {
  const input = updateLessonSchema.parse(req.body);
  const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: input });
  ok(res, lesson);
}

export async function deleteLesson(req: Request, res: Response) {
  await prisma.lesson.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}

export async function setLessonPublish(req: Request, res: Response) {
  const isPublished = Boolean(req.body?.isPublished);
  const lesson = await prisma.lesson.update({
    where: { id: req.params.id },
    data: { isPublished },
  });
  ok(res, lesson);
}

// ----------------------- Lesson video (R2) -----------------------

/** POST /api/lessons/:id/upload-url — رابط رفع موقّع للفيديو (admin). */
export async function getLessonUploadUrl(req: Request, res: Response) {
  if (!isStorageConfigured()) throw ApiError.internal('التخزين غير مهيأ بعد');
  const contentType = String(req.body?.contentType ?? '');
  if (!contentType.startsWith('video/')) {
    throw ApiError.badRequest('نوع الملف غير مدعوم — فيديو فقط');
  }
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
  if (!lesson) throw ApiError.notFound('الدرس غير موجود');

  const safe = String(req.body?.filename ?? 'video')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(-60);
  const key = `lessons/${lesson.id}/${Date.now()}-${safe}`;
  const uploadUrl = await presignUpload(key, contentType);
  ok(res, { uploadUrl, key });
}

/** POST /api/lessons/:id/attach-video — حفظ مفتاح الفيديو بعد الرفع (admin). */
export async function attachLessonVideo(req: Request, res: Response) {
  const key = String(req.body?.key ?? '');
  if (!key) throw ApiError.badRequest('مفتاح الفيديو مطلوب');
  const lesson = await prisma.lesson.update({
    where: { id: req.params.id },
    data: { videoUrl: key, durationMinutes: req.body?.durationMinutes ?? undefined },
  });
  ok(res, lesson);
}

/** GET /api/lessons/:id/playback — رابط مشاهدة موقّع (any authed user). */
export async function getLessonPlayback(req: Request, res: Response) {
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
  if (!lesson) throw ApiError.notFound('الدرس غير موجود');
  await assertLessonAccess(req, lesson); // بوابة الباقة
  if (!lesson.videoUrl) throw ApiError.notFound('لا يوجد فيديو لهذا الدرس بعد');
  const url = await presignDownload(lesson.videoUrl);
  ok(res, { url });
}

// ----------------------- Search -----------------------

/** GET /api/search?q= — بحث في الدروس المنشورة والمواضيع. */
export async function searchContent(req: Request, res: Response) {
  const q = String(req.query.q ?? '').trim();
  if (q.length < 2) {
    ok(res, { lessons: [], topics: [] });
    return;
  }
  const [lessons, topics] = await Promise.all([
    prisma.lesson.findMany({
      where: { isPublished: true, title: { contains: q, mode: 'insensitive' } },
      select: { id: true, title: true, topicId: true },
      take: 10,
    }),
    prisma.topic.findMany({
      where: { nameAr: { contains: q, mode: 'insensitive' } },
      select: { id: true, nameAr: true, levelId: true },
      take: 10,
    }),
  ]);
  ok(res, { lessons, topics });
}

// ----------------------- Admin stats -----------------------

export async function adminStats(_req: Request, res: Response) {
  const [students, subjects, lessons, problems] = await Promise.all([
    prisma.user.count({ where: { role: 'student' } }),
    prisma.subject.count(),
    prisma.lesson.count(),
    prisma.problem.count(),
  ]);
  ok(res, { students, subjects, lessons, problems });
}
