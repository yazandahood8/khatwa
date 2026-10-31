import { describe, it, expect } from 'vitest';
import { matchStep } from './stepMatch';

const methods = [
  {
    name: 'التحليل',
    steps: [
      { stepNumber: 1, expression: 'x² + 5x + 6 = 0', hint: 'h1' },
      { stepNumber: 2, expression: '(x + 2)(x + 3) = 0', hint: 'h2' },
      { stepNumber: 3, expression: 'x = -2 أو x = -3', hint: 'h3' },
    ],
  },
];
const mistakes = [{ wrongExample: '(x - 2)(x - 3) = 0', correction: 'الإشارتين موجبتين' }];

describe('matchStep', () => {
  it('matches a non-final correct step and hints the next one', () => {
    const r = matchStep('(x+2)(x+3)=0', methods, mistakes);
    expect(r?.kind).toBe('correct');
    expect(r?.reply).toContain('h3'); // next step's hint
  });

  it('matches the first step regardless of spacing', () => {
    expect(matchStep('x²+5x+6=0', methods, mistakes)?.kind).toBe('correct');
  });

  it('defers the LAST step to the AI (returns null)', () => {
    expect(matchStep('x = -2 أو x = -3', methods, mistakes)).toBeNull();
  });

  it('catches a known common mistake', () => {
    const r = matchStep('(x-2)(x-3)=0', methods, mistakes);
    expect(r?.kind).toBe('mistake');
    expect(r?.reply).toContain('الإشارتين');
  });

  it('returns null for unrelated input', () => {
    expect(matchStep('y = 3x + 1', methods, mistakes)).toBeNull();
  });

  it('returns null for too-short input', () => {
    expect(matchStep('x', methods, mistakes)).toBeNull();
  });
});
