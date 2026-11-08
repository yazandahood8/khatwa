import { describe, it, expect } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../backend/src/services/prisma';
import { api, auth, seedUser, seedContentTree } from './helpers';

/**
 * بقية السطح — users profile, parent linking, cross-device pairing, admin new-method review, TTS status.
 */

describe('users profile & password', () => {
  it('updates the profile and returns the public user (no hash)', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api()
      .put('/api/users/profile')
      .set(auth(student.token))
      .send({ name: 'اسم جديد', grade: 9 });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ name: 'اسم جديد', grade: 9 });
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('changes the password with the correct current one; rejects a wrong current', async () => {
    const student = await seedUser({ role: UserRole.STUDENT, password: 'oldpassword1' });

    const wrong = await api()
      .put('/api/users/password')
      .set(auth(student.token))
      .send({ currentPassword: 'nope', newPassword: 'newpassword1' });
    expect(wrong.status).toBe(400);

    const okRes = await api()
      .put('/api/users/password')
      .set(auth(student.token))
      .send({ currentPassword: 'oldpassword1', newPassword: 'newpassword1' });
    expect(okRes.status).toBe(200);

    // كلمة السر الجديدة تعمل — the new password logs in.
    const login = await api()
      .post('/api/auth/login')
      .set('X-Forwarded-For', '198.51.100.9')
      .send({ email: student.email, password: 'newpassword1' });
    expect(login.status).toBe(200);
  });
});

describe('parent linking & reports', () => {
  it('links a student, lists children, and returns a report', async () => {
    const parent = await seedUser({ role: UserRole.PARENT });
    const student = await seedUser({ role: UserRole.STUDENT, name: 'ابن', grade: 8 });

    const link = await api()
      .post('/api/parent/link-student')
      .set(auth(parent.token))
      .send({ studentEmail: student.email });
    expect(link.status).toBe(201);
    expect(link.body.data.student).toMatchObject({ id: student.id });

    const list = await api().get('/api/parent/students').set(auth(parent.token));
    expect(list.body.data.map((s: { id: string }) => s.id)).toEqual([student.id]);

    const report = await api().get(`/api/parent/report/${student.id}`).set(auth(parent.token));
    expect(report.status).toBe(200);
    expect(report.body.data.student).toMatchObject({ name: 'ابن', grade: 8 });
    expect(report.body.data.stats).toHaveProperty('problemsSolved');
  });

  it('rejects linking an unknown email (404) and a non-parent from the parent routes (403)', async () => {
    const parent = await seedUser({ role: UserRole.PARENT });
    const unknown = await api()
      .post('/api/parent/link-student')
      .set(auth(parent.token))
      .send({ studentEmail: 'ghost@test.khatwa' });
    expect(unknown.status).toBe(404);

    const student = await seedUser({ role: UserRole.STUDENT });
    const forbidden = await api().get('/api/parent/students').set(auth(student.token));
    expect(forbidden.status).toBe(403);
  });

  it("forbids a report for a student not linked to the parent", async () => {
    const parent = await seedUser({ role: UserRole.PARENT });
    const other = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get(`/api/parent/report/${other.id}`).set(auth(parent.token));
    expect(res.status).toBe(403);
  });
});

describe('cross-device pairing (Redis handoff)', () => {
  const pairId = 'abcdEFGH12345678'; // يطابق ^[a-zA-Z0-9]{16,64}$

  it('runs the full desktop↔mobile photo handoff with one-shot delivery', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const { problem } = await seedContentTree();

    const create = await api()
      .post('/api/pair')
      .set(auth(student.token))
      .send({ pairId, problemId: problem.id });
    expect(create.status).toBe(200);

    const waiting = await api().get(`/api/pair/${pairId}`).set(auth(student.token));
    expect(waiting.body.data.status).toBe('waiting');

    const upload = await api()
      .post(`/api/pair/${pairId}/photo`)
      .set(auth(student.token))
      .send({ image: 'ZmFrZS1iYXNlNjQ=', mediaType: 'image/jpeg' });
    expect(upload.status).toBe(200);

    const ready = await api().get(`/api/pair/${pairId}`).set(auth(student.token));
    expect(ready.body.data).toMatchObject({ status: 'ready', image: 'ZmFrZS1iYXNlNjQ=' });

    // تسليم لمرة واحدة — the session is cleared after delivery.
    const after = await api().get(`/api/pair/${pairId}`).set(auth(student.token));
    expect(after.body.data.status).toBe('expired');
  });

  it('forbids a different user from uploading to the session', async () => {
    const owner = await seedUser({ role: UserRole.STUDENT });
    const intruder = await seedUser({ role: UserRole.STUDENT });
    await api().post('/api/pair').set(auth(owner.token)).send({ pairId, problemId: 'p1' });

    const res = await api()
      .post(`/api/pair/${pairId}/photo`)
      .set(auth(intruder.token))
      .send({ image: 'eA==' });
    expect(res.status).toBe(403);
  });
});

describe('admin new-method review', () => {
  it('lists a student-discovered method, approves it, and clears its notification', async () => {
    const admin = await seedUser({ role: UserRole.ADMIN });
    const student = await seedUser({ role: UserRole.STUDENT });
    const { topic } = await seedContentTree();
    const problem = await prisma.problem.create({
      data: { question: 'q', finalAnswer: '1', topicId: topic.id },
    });
    const method = await prisma.solutionMethod.create({
      data: {
        problemId: problem.id,
        name: 'طريقة الطالب',
        isApproved: false,
        discoveredByStudent: student.id,
        steps: { create: { stepNumber: 1, description: 'خطوة', expression: 'x', hint: '' } },
      },
    });
    await prisma.adminNotification.create({
      data: { type: 'new_method', data: { methodId: method.id }, isRead: false },
    });

    const list = await api().get('/api/admin/new-methods').set(auth(admin.token));
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]).toMatchObject({ id: method.id, name: 'طريقة الطالب' });

    const before = await api().get('/api/admin/notifications/count').set(auth(admin.token));
    expect(before.body.data.newMethods).toBe(1);

    const approve = await api()
      .post(`/api/admin/new-methods/${method.id}/approve`)
      .set(auth(admin.token))
      .send({});
    expect(approve.status).toBe(200);
    expect(approve.body.data.isApproved).toBe(true);

    const after = await api().get('/api/admin/notifications/count').set(auth(admin.token));
    expect(after.body.data.newMethods).toBe(0);
  });
});

describe('TTS status', () => {
  it('reports not-configured when Azure keys are absent', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get('/api/tts/status').set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ configured: false });
  });

  it('validates the body (empty text → 400) and requires auth', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const bad = await api().post('/api/tts').set(auth(student.token)).send({ text: '' });
    expect(bad.status).toBe(400);

    const noAuth = await api().post('/api/tts').send({ text: 'مرحبا' });
    expect(noAuth.status).toBe(401);
  });
});
