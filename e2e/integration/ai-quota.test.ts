import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { api, auth, seedUser, seedContentTree } from './helpers';
import { prisma } from '../../backend/src/services/prisma';

/**
 * حصّة الذكاء الاصطناعي — quota gating (Redis حقيقي، Claude مموّه).
 * رسالة عادية (لا تبدأ بـ"خطوتي:" ولا starterHintIndex) تتخطّى الطبقات الحتمية
 * فتصل إلى consumeQuota ثم Claude المموّه — فيُخصم سؤال فعليّاً.
 */

const ai = vi.hoisted(() => {
  const stream = vi.fn(() => {
    let onText: ((t: string) => void) | undefined;
    return {
      on(ev: string, cb: (t: string) => void) {
        if (ev === 'text') onText = cb;
        return this;
      },
      async finalMessage() {
        onText?.('حسناً، لنبدأ.');
        return { usage: { input_tokens: 8, output_tokens: 12 } };
      },
    };
  });
  return { stream };
});

vi.mock('../../backend/src/services/claude', () => ({
  claude: { messages: { stream: ai.stream } },
  CLAUDE_MODEL: 'claude-test',
  isAiConfigured: () => true,
  estimateCostUsd: () => 0,
}));

beforeEach(() => ai.stream.mockClear());

async function seedProblem() {
  const { topic } = await seedContentTree();
  return prisma.problem.create({
    data: { question: 'سؤال', finalAnswer: '1', topicId: topic.id },
  });
}

const ask = (problemId: string, token: string, message = 'كيف أبدأ؟') =>
  api().post(`/api/problems/${problemId}/ai`).set(auth(token)).send({ message });

describe('GET /api/ai/quota', () => {
  it('reports the free plan daily limit for a student with no subscription', async () => {
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api().get('/api/ai/quota').set(auth(student.token));
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ plan: 'free', limit: 10, used: 0, remaining: 10, configured: true });
  });

  it('reports the premium limit for a subscribed student', async () => {
    const student = await seedUser({ role: UserRole.STUDENT, plan: 'premium' });
    const res = await api().get('/api/ai/quota').set(auth(student.token));
    expect(res.body.data).toMatchObject({ plan: 'premium', limit: 30, remaining: 30 });
  });

  it('reports unlimited for an admin', async () => {
    const admin = await seedUser({ role: UserRole.ADMIN });
    const res = await api().get('/api/ai/quota').set(auth(admin.token));
    expect(res.body.data).toMatchObject({ unlimited: true, remaining: -1 });
  });
});

describe('quota consumption', () => {
  it('decrements remaining after a real (Claude-backed) question', async () => {
    const problem = await seedProblem();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await ask(problem.id, student.token);
    expect(res.status).toBe(200);
    expect(ai.stream).toHaveBeenCalledTimes(1);
    expect(res.headers['x-ai-remaining']).toBe('9');

    const quota = await api().get('/api/ai/quota').set(auth(student.token));
    expect(quota.body.data).toMatchObject({ used: 1, remaining: 9 });
  });

  it('blocks the (limit+1)-th question of the day with 429 RATE_LIMITED', async () => {
    const problem = await seedProblem();
    const student = await seedUser({ role: UserRole.STUDENT }); // free ⇒ 10/day

    for (let i = 0; i < 10; i++) {
      const r = await ask(problem.id, student.token);
      expect(r.status).toBe(200);
    }
    const blocked = await ask(problem.id, student.token);
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe('RATE_LIMITED');
  });

  it('never blocks an admin (unlimited, no counter)', async () => {
    const problem = await seedProblem();
    const admin = await seedUser({ role: UserRole.ADMIN });

    for (let i = 0; i < 12; i++) {
      const r = await ask(problem.id, admin.token);
      expect(r.status).toBe(200);
      expect(r.headers['x-ai-remaining']).toBe('-1');
    }
  });
});
