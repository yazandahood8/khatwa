import { describe, it, expect } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../src/services/prisma';
import { api, auth, seedUser, freshIp } from './helpers';

/**
 * اختبارات المصادقة التكاملية — auth flow end-to-end.
 * كل نداء يحمل X-Forwarded-For فريداً كي لا يتداخل مع محدِّد المعدل (5/دقيقة/IP).
 */

const register = (body: Record<string, unknown>, ip = freshIp()) =>
  api().post('/api/auth/register').set('X-Forwarded-For', ip).send(body);

const login = (body: Record<string, unknown>, ip = freshIp()) =>
  api().post('/api/auth/login').set('X-Forwarded-For', ip).send(body);

const studentBody = (over: Record<string, unknown> = {}) => ({
  name: 'سالم',
  email: `salem${Math.random().toString(36).slice(2, 8)}@test.khatwa`,
  password: 'password123',
  role: 'student',
  grade: 7,
  ...over,
});

describe('POST /api/auth/register', () => {
  it('creates a student with a 7-day premium trial and returns a token', async () => {
    const body = studentBody();
    const res = await register(body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user).toMatchObject({ email: body.email, role: 'student' });
    // لا يُسرَّب هاش كلمة السر — never leak the password hash.
    expect(res.body.data.user.passwordHash).toBeUndefined();

    // التجربة: اشتراك بريميوم فعّال ينتهي خلال ~7 أيام.
    const sub = await prisma.subscription.findFirst({ where: { student: { email: body.email } } });
    expect(sub).toMatchObject({ plan: 'premium', status: 'active' });
    expect(sub?.endsAt).toBeTruthy();
  });

  it('rejects a duplicate email with 400', async () => {
    const body = studentBody();
    await register(body);
    const dup = await register(body);
    expect(dup.status).toBe(400);
    expect(dup.body.success).toBe(false);
  });

  it('rejects invalid input (short password) with 400 VALIDATION_ERROR', async () => {
    const res = await register(studentBody({ password: 'short' }));
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a student with neither grade nor level', async () => {
    const res = await register(studentBody({ grade: undefined, level: undefined }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials (200 + token)', async () => {
    const body = studentBody();
    await register(body);

    const res = await login({ email: body.email, password: body.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.email).toBe(body.email);
  });

  it('rejects a wrong password with 401', async () => {
    const body = studentBody();
    await register(body);

    const res = await login({ email: body.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects an unknown email with 401', async () => {
    const res = await login({ email: 'nobody@test.khatwa', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user with a valid token', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get('/api/auth/me').set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: student.id, email: student.email });
  });

  it('rejects a missing token with 401', async () => {
    const res = await api().get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a malformed token with 401', async () => {
    const res = await api().get('/api/auth/me').set({ Authorization: 'Bearer not-a-jwt' });
    expect(res.status).toBe(401);
  });
});

describe('role guards (requireRole)', () => {
  it('forbids a student from an admin-only route with 403', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api()
      .post('/api/subjects')
      .set(auth(student.token))
      .send({ nameAr: 'فيزياء' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('allows an admin to reach the admin-only route', async () => {
    const admin = await seedUser({ role: UserRole.ADMIN });
    const res = await api()
      .post('/api/subjects')
      .set(auth(admin.token))
      .send({ nameAr: 'فيزياء' });
    expect(res.status).toBeLessThan(300);
  });
});

describe('auth rate limiting', () => {
  it('blocks the 6th login attempt from the same IP within a minute (429)', async () => {
    const ip = '203.0.113.77'; // عنوان ثابت — bucket واحد لكل هذه المحاولات.
    const attempt = () => login({ email: 'x@test.khatwa', password: 'password123' }, ip);

    // 5 مسموحة (تفشل 401 لأن المستخدم غير موجود، لكنها تُحتسب على الحدّ).
    for (let i = 0; i < 5; i++) {
      const r = await attempt();
      expect(r.status).toBe(401);
    }
    const sixth = await attempt();
    expect(sixth.status).toBe(429);
    expect(sixth.body.error.code).toBe('RATE_LIMITED');
  });
});
