import { describe, it, expect } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../apps/api/src/services/prisma';
import { api, auth, seedUser, seedContentTree } from './helpers';

/**
 * التقدّم ولوحة الطالب — lesson progress, dashboard summary, and the daily-goal ring.
 */

describe('POST /api/lessons/:id/progress', () => {
  it('records watch progress (in-progress) and reflects it in reads', async () => {
    const { lesson } = await seedContentTree();
    const student = await seedUser({ role: UserRole.STUDENT });

    const save = await api()
      .post(`/api/lessons/${lesson.id}/progress`)
      .set(auth(student.token))
      .send({ watchTimeSeconds: 120 });
    expect(save.status).toBe(200);
    expect(save.body.data).toMatchObject({ watchTimeSeconds: 120, completedAt: null });

    const mine = await api().get('/api/me/progress').set(auth(student.token));
    expect(mine.body.data).toEqual([
      expect.objectContaining({ lessonId: lesson.id, watchTimeSeconds: 120, completedAt: null }),
    ]);

    const dash = await api().get('/api/me/dashboard').set(auth(student.token));
    expect(dash.body.data).toMatchObject({ completedCount: 0, inProgressCount: 1 });
    expect(dash.body.data.lastLesson).toMatchObject({ id: lesson.id, watchTimeSeconds: 120 });
  });

  it('marks completion and upserts the same row (no duplicates)', async () => {
    const { lesson } = await seedContentTree();
    const student = await seedUser({ role: UserRole.STUDENT });
    const save = (body: object) =>
      api().post(`/api/lessons/${lesson.id}/progress`).set(auth(student.token)).send(body);

    await save({ watchTimeSeconds: 60 });
    await save({ watchTimeSeconds: 300, completed: true });

    const rows = await prisma.lessonProgress.findMany({ where: { studentId: student.id } });
    expect(rows).toHaveLength(1); // upsert — لا صف مكرّر
    expect(rows[0].completedAt).toBeTruthy();

    const dash = await api().get('/api/me/dashboard').set(auth(student.token));
    expect(dash.body.data).toMatchObject({ completedCount: 1, inProgressCount: 0, lastLesson: null });
  });

  it('returns 404 for an unknown lesson', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api()
      .post('/api/lessons/nope/progress')
      .set(auth(student.token))
      .send({ watchTimeSeconds: 10 });
    expect(res.status).toBe(404);
  });

  it('requires authentication', async () => {
    const { lesson } = await seedContentTree();
    const res = await api().post(`/api/lessons/${lesson.id}/progress`).send({ watchTimeSeconds: 10 });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/progress/me (full stats + daily goal ring)', () => {
  it('aggregates completed lessons and solved problems', async () => {
    const { lesson, problem } = await seedContentTree();
    const student = await seedUser({ role: UserRole.STUDENT });

    await prisma.lessonProgress.create({
      data: { studentId: student.id, lessonId: lesson.id, watchTimeSeconds: 600, completedAt: new Date() },
    });
    await prisma.problemAttempt.create({
      data: { studentId: student.id, problemId: problem.id, isCorrect: true, attemptsCount: 1, completedAt: new Date() },
    });

    const res = await api().get('/api/progress/me').set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      completedLessons: 1,
      problemsSolved: 1,
      firstTrySolved: 1,
      accuracy: 100,
    });
  });

  it('daily-goal ring counts only problems solved TODAY, not earlier ones (guards 4f1363e)', async () => {
    const { topic } = await seedContentTree();
    const student = await seedUser({ role: UserRole.STUDENT });
    const p1 = await prisma.problem.create({ data: { question: 'q1', finalAnswer: '1', topicId: topic.id } });
    const p2 = await prisma.problem.create({ data: { question: 'q2', finalAnswer: '2', topicId: topic.id } });

    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);
    // محلولة اليوم — solved today
    await prisma.problemAttempt.create({
      data: { studentId: student.id, problemId: p1.id, isCorrect: true, attemptsCount: 1, completedAt: new Date() },
    });
    // محلولة قبل 3 أيام — solved 3 days ago (داخل الأسبوع، خارج اليوم)
    await prisma.problemAttempt.create({
      data: { studentId: student.id, problemId: p2.id, isCorrect: true, attemptsCount: 1, completedAt: threeDaysAgo, createdAt: threeDaysAgo },
    });

    const res = await api().get('/api/progress/me').set(auth(student.token));
    expect(res.body.data.problemsSolved).toBe(2); // إجمالي
    expect(res.body.data.today.problemsSolved).toBe(1); // اليوم فقط
    expect(res.body.data.week.problemsSolved).toBe(2); // كلاهما ضمن الأسبوع
  });
});
