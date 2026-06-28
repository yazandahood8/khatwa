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
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';

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
  const lessons = await prisma.lesson.findMany({
    where: topicId ? { topicId } : undefined,
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
