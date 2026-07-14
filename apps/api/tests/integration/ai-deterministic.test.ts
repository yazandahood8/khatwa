import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@khatwa/shared';
import { prisma } from '../../src/services/prisma';
import { api, auth, seedUser, seedContentTree } from './helpers';

/**
 * الطبقات الحتمية للمساعد (بلا Claude ولا حصة) — starter-hint + step-match layers.
 * نُهيّئ Claude (كي يمرّ حارس askTutor) لكن هذه المسارات ترجع قبل استدعائه إطلاقاً.
 * SOLVE_GRAPHS غير مموّه هنا، فمسار "الحلّ الموجّه" يُتخطّى ويصل النداء إلى matchStep.
 */

const ai = vi.hoisted(() => {
  const state = { text: 'رد من Claude (يجب ألا يظهر في المسارات الحتمية)', inTok: 5, outTok: 7 };
  const stream = vi.fn(() => {
    let onText: ((t: string) => void) | undefined;
    return {
      on(ev: string, cb: (t: string) => void) {
        if (ev === 'text') onText = cb;
        return this;
      },
      async finalMessage() {
        onText?.(state.text);
        return { usage: { input_tokens: state.inTok, output_tokens: state.outTok } };
      },
    };
  });
  return { state, stream };
});

vi.mock('../../src/services/claude', () => ({
  claude: { messages: { stream: ai.stream } },
  CLAUDE_MODEL: 'claude-test',
  isAiConfigured: () => true,
  estimateCostUsd: () => 0,
}));

beforeEach(() => ai.stream.mockClear());

/** يزرع مسألة رياضيات مع طريقة موصى بها (خطوات بتلميحات) وخطأ شائع. */
async function seedMathProblemWithMethod() {
  const { topic } = await seedContentTree();
  return prisma.problem.create({
    data: {
      question: 'ثمن 3 دفاتر وقلم؟',
      finalAnswer: '26',
      topicId: topic.id,
      methods: {
        create: {
          name: 'الطريقة المباشرة',
          isRecommended: true,
          isApproved: true,
          steps: {
            create: [
              { stepNumber: 1, description: 'كوّن التعبير', expression: '3x+8', hint: 'اجمع أثمان الدفاتر مع القلم' },
              { stepNumber: 2, description: 'عوّض', expression: '3*6+8', hint: 'عوّض قيمة x' },
              { stepNumber: 3, description: 'النتيجة', expression: '26', hint: '' },
            ],
          },
        },
      },
      commonMistakes: {
        create: { description: 'جمع خاطئ', wrongExample: '5x', correction: 'الدفاتر ثمنها 3x لا 5x' },
      },
    },
  });
}

describe('starter-hint layer (Layer 0)', () => {
  it('serves the stored step hint with no Claude call and no quota consumed', async () => {
    const problem = await seedMathProblemWithMethod();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'ساعدني', starterHintIndex: 0 });

    expect(res.status).toBe(200);
    expect(res.text).toContain('تلميح للبداية');
    expect(res.text).toContain('اجمع أثمان الدفاتر مع القلم'); // أول تلميح مخزّن
    expect(ai.stream).not.toHaveBeenCalled();
    // الحصة الكاملة للطالب المجاني = 10 (لم تُستهلك) — deterministic ⇒ لا خصم.
    expect(res.headers['x-ai-remaining']).toBe('10');
  });

  it('serves the second hint at index 1', async () => {
    const problem = await seedMathProblemWithMethod();
    const student = await seedUser({ role: UserRole.STUDENT });
    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'كمان', starterHintIndex: 1 });
    expect(res.text).toContain('عوّض قيمة x');
    expect(ai.stream).not.toHaveBeenCalled();
  });
});

describe('step-match fast path (Layer 1)', () => {
  it('recognizes a correct non-final step with no Claude call', async () => {
    const problem = await seedMathProblemWithMethod();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'خطوتي: 3x+8' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('خطوتك صح');
    expect(ai.stream).not.toHaveBeenCalled();
    expect(res.headers['x-ai-remaining']).toBe('10');
  });

  it('recognizes a known common mistake with a targeted correction (no Claude)', async () => {
    const problem = await seedMathProblemWithMethod();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'خطوتي: 5x' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('الدفاتر ثمنها 3x لا 5x');
    expect(ai.stream).not.toHaveBeenCalled();
  });

  it('falls through to Claude for an unrecognized step', async () => {
    const problem = await seedMathProblemWithMethod();
    const student = await seedUser({ role: UserRole.STUDENT });

    const res = await api()
      .post(`/api/problems/${problem.id}/ai`)
      .set(auth(student.token))
      .send({ message: 'خطوتي: 999+1' });

    expect(res.status).toBe(200);
    // خطوة غير معروفة ⟹ استُدعي Claude (المموّه) وظهر نصّه.
    expect(ai.stream).toHaveBeenCalledTimes(1);
    expect(res.text).toContain('رد من Claude');
  });
});
