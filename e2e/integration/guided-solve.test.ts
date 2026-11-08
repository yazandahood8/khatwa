import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../backend/src/services/prisma';
import { api, auth, seedUser, seedContentTree } from './helpers';

/**
 * محرّك الحلّ الموجّه عبر HTTP — guided step engine end-to-end.
 * نموّه SOLVE_GRAPHS (Proxy يرجّع رسماً واحداً لأي معرّف مسألة) كي نقود المحطّات والأخطاء
 * دون الاعتماد على معرّفات إنتاجية ثابتة. Claude مموّه لكن لا يُستدعى في هذا المسار.
 */

const ai = vi.hoisted(() => {
  const stream = vi.fn(() => ({
    on() {
      return this;
    },
    async finalMessage() {
      return { usage: { input_tokens: 1, output_tokens: 1 } };
    },
  }));
  return { stream };
});

vi.mock('../../backend/src/services/claude', () => ({
  claude: { messages: { stream: ai.stream } },
  CLAUDE_MODEL: 'claude-test',
  isAiConfigured: () => true,
  estimateCostUsd: () => 0,
}));

const testGraph = {
  milestones: [
    { id: 'expr', label: 'التعبير 3x+8', targetExpr: '3x+8', required: true, praise: 'ممتاز! 👏', pendingHint: 'كوّن التعبير 3x+8' },
    { id: 'value', label: 'القيمة 26', targetExpr: '26', required: true, praise: 'أحسنت! خلّصت 🎉' },
  ],
  wrong: [{ matchExpr: '5x', message: 'لا تجمع الدفاتر مع الأقلام' }],
  fallbackHint: 'ابدأ بالتعبير',
};

vi.mock('../../backend/src/data/solveGraphs', () => ({
  SOLVE_GRAPHS: new Proxy({}, { get: () => testGraph }),
}));

beforeEach(() => ai.stream.mockClear());

async function seedGuidedProblem() {
  const { topic } = await seedContentTree();
  return prisma.problem.create({
    data: { question: 'ثمن 3 دفاتر وقلم؟', finalAnswer: '26', topicId: topic.id },
  });
}

describe('guided step engine (deterministic, no Claude)', () => {
  it('praises a correct milestone and points at the next one', async () => {
    const problem = await seedGuidedProblem();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'خطوتي: 3x+8' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('ممتاز'); // praise
    expect(res.text).toContain('القيمة 26'); // nextGuidance → المحطّة الإجبارية الباقية
    expect(res.text).not.toContain('[SOLVED]');
    expect(ai.stream).not.toHaveBeenCalled();
    expect(res.headers['x-ai-remaining']).toBe('10');
  });

  it('flags a known wrong pattern with a [WRONG] marker', async () => {
    const problem = await seedGuidedProblem();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'خطوتي: 5x' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('لا تجمع الدفاتر مع الأقلام');
    expect(res.text).toContain('[WRONG]');
    expect(ai.stream).not.toHaveBeenCalled();
  });

  it('marks [SOLVED] once all required milestones are reached (using history)', async () => {
    const problem = await seedGuidedProblem();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({
        message: 'خطوتي: 26',
        history: [{ role: 'user', content: 'خطوتي: 3x+8' }],
      });

    expect(res.status).toBe(200);
    expect(res.text).toContain('أحسنت');
    expect(res.text).toContain('[SOLVED]');
    expect(ai.stream).not.toHaveBeenCalled();
  });

  it('accepts an equivalent algebraic form (8+3·x) for the same milestone', async () => {
    const problem = await seedGuidedProblem();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'خطوتي: 8+3·x' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('ممتاز'); // طُبّع جبريّاً وطابق 3x+8
    expect(ai.stream).not.toHaveBeenCalled();
  });
});
