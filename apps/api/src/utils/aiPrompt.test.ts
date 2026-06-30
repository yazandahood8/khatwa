import { describe, it, expect } from 'vitest';
import { buildTutorSystemPrompt, buildCodeJudgePrompt } from './aiPrompt';

const ctx = {
  subject: 'رياضيات',
  grade: 9,
  level: '4יח׳',
  topic: 'المعادلة التربيعية',
  question: 'x² + 5x + 6 = 0',
  finalAnswer: 'x = -2 أو x = -3',
  methods: [
    {
      name: 'التحليل',
      isRecommended: true,
      steps: [{ stepNumber: 1, description: 'd', expression: 'e', hint: 'ht' }],
    },
  ],
  commonMistakes: [{ description: 'd', wrongExample: 'w', correction: 'c' }],
  attemptsCount: 0,
};

describe('buildTutorSystemPrompt', () => {
  const p = buildTutorSystemPrompt(ctx);

  it('forbids revealing the final answer', () => {
    expect(p).toMatch(/لا تعطِ الجواب/);
  });

  it('flags the final answer as secret while still providing it to the tutor', () => {
    expect(p).toContain('سرّية');
    expect(p).toContain(ctx.finalAnswer);
  });

  it('includes the [NEW_METHOD] and [SOLVED] protocol tags', () => {
    expect(p).toContain('[NEW_METHOD]');
    expect(p).toContain('[SOLVED]');
  });

  it('embeds the problem context', () => {
    expect(p).toContain(ctx.question);
    expect(p).toContain(ctx.topic);
  });
});

describe('buildCodeJudgePrompt', () => {
  const p = buildCodeJudgePrompt({
    subject: 'علوم الحاسوب',
    topic: 'المصفوفات',
    question: 'اكتب دالة',
    language: 'csharp',
    starterCode: null,
    referenceSolution: 'static int F() => 0;',
  });

  it('emits the three verdict tags', () => {
    expect(p).toContain('[CORRECT]');
    expect(p).toContain('[PARTIAL]');
    expect(p).toContain('[INCORRECT]');
  });

  it('keeps the reference solution secret', () => {
    expect(p).toMatch(/سرّي/);
  });
});
