import { describe, it, expect } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../backend/src/services/prisma';
import { api, auth, seedUser, seedContentTree } from './helpers';

/**
 * حل المسائل (رياضيات) — problem reads never leak the answer; /check validates & records attempts.
 */

describe('problem reads', () => {
  it('never ships finalAnswer to a student, but does to an admin', async () => {
    const { problem } = await seedContentTree({ problem: { finalAnswer: '42' } });
    const student = await seedUser({ role: UserRole.STUDENT });
    const admin = await seedUser({ role: UserRole.ADMIN });

    const asStudent = await api().get(`/api/problems/${problem.id}`).set(auth(student.token));
    expect(asStudent.status).toBe(200);
    expect(asStudent.body.data.finalAnswer).toBeUndefined();

    const asAdmin = await api().get(`/api/problems/${problem.id}`).set(auth(admin.token));
    expect(asAdmin.body.data.finalAnswer).toBe('42');
  });

  it('GET /api/problems?topicId= lists topic problems (answer stripped for students)', async () => {
    const { topic, problem } = await seedContentTree({ problem: { finalAnswer: '7' } });
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api().get('/api/problems').query({ topicId: topic.id }).set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data.map((p: { id: string }) => p.id)).toContain(problem.id);
    expect(res.body.data.every((p: { finalAnswer?: string }) => p.finalAnswer === undefined)).toBe(true);
  });

  it('by-code lookup resolves a scanned code to its id; unknown → 404', async () => {
    const { problem } = await seedContentTree({ problem: { code: 'MATH-7-EQ-Q1' } });
    const student = await seedUser({ role: UserRole.STUDENT });

    const found = await api().get('/api/problems/by-code/MATH-7-EQ-Q1').set(auth(student.token));
    expect(found.status).toBe(200);
    expect(found.body.data.id).toBe(problem.id);

    const missing = await api().get('/api/problems/by-code/NOPE').set(auth(student.token));
    expect(missing.status).toBe(404);
  });

  it('requires authentication', async () => {
    const { problem } = await seedContentTree();
    const res = await api().get(`/api/problems/${problem.id}`);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/problems/:id/check', () => {
  it('accepts a correct answer, marks completed, and records an attempt row', async () => {
    const { problem } = await seedContentTree({ problem: { finalAnswer: '2', answerTolerance: 0 } });
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/check`)
      .set(auth(student.token))
      .send({ answer: '2' });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ correct: true, completed: true, attemptsCount: 1 });

    const attempt = await prisma.problemAttempt.findFirst({
      where: { studentId: student.id, problemId: problem.id },
    });
    expect(attempt).toMatchObject({ isCorrect: true, attemptsCount: 1 });
    expect(attempt?.completedAt).toBeTruthy();
  });

  it('rejects a wrong answer and increments attemptsCount on retry', async () => {
    const { problem } = await seedContentTree({ problem: { finalAnswer: '2' } });
    const student = await seedUser({ role: UserRole.STUDENT });
    const post = (answer: string) =>
      api().post(`/api/problems/${problem.id}/check`).set(auth(student.token)).send({ answer });

    const first = await post('5');
    expect(first.body.data).toMatchObject({ correct: false, completed: false, attemptsCount: 1 });

    const second = await post('9');
    expect(second.body.data).toMatchObject({ correct: false, attemptsCount: 2 });

    // بعد الإجابة الصحيحة: يبقى العدّاد تراكمياً ويُوسم مكتملاً.
    const third = await post('2');
    expect(third.body.data).toMatchObject({ correct: true, completed: true, attemptsCount: 3 });
  });

  it('accepts an answer within the author tolerance', async () => {
    const { problem } = await seedContentTree({
      problem: { finalAnswer: '2', answerTolerance: 0.5 },
    });
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/check`)
      .set(auth(student.token))
      .send({ answer: '2.3' });
    expect(res.body.data.correct).toBe(true);
  });

  it('accepts Arabic-digit answers (normalization)', async () => {
    const { problem } = await seedContentTree({ problem: { finalAnswer: '2' } });
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/check`)
      .set(auth(student.token))
      .send({ answer: '٢' });
    expect(res.body.data.correct).toBe(true);
  });

  it('validates the body (empty answer → 400)', async () => {
    const { problem } = await seedContentTree();
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api()
      .post(`/api/problems/${problem.id}/check`)
      .set(auth(student.token))
      .send({ answer: '' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/problems/:id/attempt', () => {
  it('reflects the student’s recorded attempt after checking', async () => {
    const { problem } = await seedContentTree({ problem: { finalAnswer: '2' } });
    const student = await seedUser({ role: UserRole.STUDENT });

    await api().post(`/api/problems/${problem.id}/check`).set(auth(student.token)).send({ answer: '2' });

    const res = await api().get(`/api/problems/${problem.id}/attempt`).set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ isCorrect: true, attemptsCount: 1 });
  });

  it('returns null when no attempt exists yet', async () => {
    const { problem } = await seedContentTree();
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get(`/api/problems/${problem.id}/attempt`).set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });
});
