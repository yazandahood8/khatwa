import { describe, it, expect } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../apps/api/src/services/prisma';
import { ipnSignature } from '../../apps/api/src/services/payplus';
import { api, auth, seedUser } from './helpers';

/**
 * الاشتراكات — plan status, trial/expiry semantics, mock checkout/cancel,
 * admin revenue, and the signed PayPlus IPN webhook.
 */

const future = () => new Date(Date.now() + 20 * 86_400_000);
const past = () => new Date(Date.now() - 86_400_000);

describe('GET /api/subscriptions/current', () => {
  it('defaults to free for a student with no subscription', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get('/api/subscriptions/current').set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ plan: 'free', aiDailyLimit: 10, isTrial: false });
  });

  it('reports an active premium trial (paid plan, no PayPlus ref) with days left', async () => {
    const student = await seedUser({ role: UserRole.STUDENT, plan: 'premium', planEndsAt: future() });
    const res = await api().get('/api/subscriptions/current').set(auth(student.token));
    expect(res.body.data).toMatchObject({ plan: 'premium', isTrial: true });
    expect(res.body.data.trialDaysLeft).toBeGreaterThan(0);
  });

  it('shows an expired paid subscription as free/expired', async () => {
    const student = await seedUser({ role: UserRole.STUDENT, plan: 'premium', planEndsAt: past() });
    const res = await api().get('/api/subscriptions/current').set(auth(student.token));
    expect(res.body.data).toMatchObject({ plan: 'free', status: 'expired' });
  });
});

describe('checkout / cancel (mock, PayPlus not configured)', () => {
  it('checkout activates the plan directly when PayPlus is unconfigured', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api()
      .post('/api/subscriptions/checkout')
      .set(auth(student.token))
      .send({ plan: 'premium' });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ mock: true, plan: 'premium', status: 'active' });

    const current = await api().get('/api/subscriptions/current').set(auth(student.token));
    expect(current.body.data.plan).toBe('premium');
  });

  it('cancel returns the student to free', async () => {
    const student = await seedUser({ role: UserRole.STUDENT, plan: 'premium', planEndsAt: future() });
    const res = await api().post('/api/subscriptions/cancel').set(auth(student.token));
    expect(res.body.data.plan).toBe('free');

    const current = await api().get('/api/subscriptions/current').set(auth(student.token));
    expect(current.body.data.plan).toBe('free');
  });
});

describe('admin subscriptions', () => {
  it('adminSetPlan grants a plan; adminList counts real revenue from paid subs only', async () => {
    const admin = await seedUser({ role: UserRole.ADMIN });
    const paidStudent = await seedUser({ role: UserRole.STUDENT });
    const trialStudent = await seedUser({ role: UserRole.STUDENT, plan: 'premium', planEndsAt: future() });

    // اشتراك مدفوع فعلاً (payplusSubscriptionId) — real paid subscription.
    await prisma.subscription.create({
      data: {
        studentId: paidStudent.id,
        plan: 'premium',
        status: 'active',
        payplusSubscriptionId: 'TX-REAL',
        endsAt: future(),
      },
    });

    const list = await api().get('/api/admin/subscriptions').set(auth(admin.token));
    expect(list.status).toBe(200);
    expect(list.body.data.monthlyRevenue).toBe(99); // بريميوم مدفوع واحد
    expect(list.body.data.paying).toBe(1);
    expect(list.body.data.trials).toBe(1); // التجربة لا تُحتسب إيراداً

    // منح الأدمن باقة لطالب — admin grant.
    const grant = await api()
      .put(`/api/admin/subscriptions/${trialStudent.id}`)
      .set(auth(admin.token))
      .send({ plan: 'basic' });
    expect(grant.body.data.plan).toBe('basic');
  });

  it('rejects a non-admin from the admin list with 403', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get('/api/admin/subscriptions').set(auth(student.token));
    expect(res.status).toBe(403);
  });
});

describe('POST /api/webhooks/payplus (signed IPN)', () => {
  const secret = 'test-payplus-secret'; // يطابق PAYPLUS_SECRET_KEY في إعداد الاختبار.

  it('activates a subscription on a valid, approved IPN', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const body = {
      transaction: { status_code: '000', uid: 'TX-777', more_info: `${student.id}:premium` },
    };
    const res = await api()
      .post('/api/webhooks/payplus')
      .set('user-agent', 'PayPlus')
      .set('hash', ipnSignature(body, secret))
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const sub = await prisma.subscription.findFirst({ where: { studentId: student.id } });
    expect(sub).toMatchObject({ plan: 'premium', status: 'active', payplusSubscriptionId: 'TX-777' });
  });

  it('rejects an IPN with a bad signature (400) and does not activate', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const body = {
      transaction: { status_code: '000', uid: 'TX-BAD', more_info: `${student.id}:premium` },
    };
    const res = await api()
      .post('/api/webhooks/payplus')
      .set('user-agent', 'PayPlus')
      .set('hash', 'not-the-real-hash')
      .send(body);

    expect(res.status).toBe(400);
    const sub = await prisma.subscription.findFirst({ where: { studentId: student.id } });
    expect(sub).toBeNull();
  });

  it('rejects an IPN with the wrong user-agent (400)', async () => {
    const body = { transaction: { status_code: '000', uid: 'TX-UA', more_info: 'x:premium' } };
    const res = await api()
      .post('/api/webhooks/payplus')
      .set('user-agent', 'curl/8')
      .set('hash', ipnSignature(body, secret))
      .send(body);
    expect(res.status).toBe(400);
  });
});
