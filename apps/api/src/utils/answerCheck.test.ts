import { describe, it, expect } from 'vitest';
import { isAnswerCorrect } from './answerCheck';

describe('isAnswerCorrect', () => {
  it('accepts an exact match', () => {
    expect(isAnswerCorrect('x = -2', 'x = -2')).toBe(true);
  });

  it('ignores the "x=" prefix and whitespace', () => {
    expect(isAnswerCorrect('x=-2', '-2')).toBe(true);
    expect(isAnswerCorrect('  x = -2 ', 'x=-2')).toBe(true);
  });

  it('accepts multiple roots in any order / separator', () => {
    expect(isAnswerCorrect('x=-2 أو x=-3', 'x=-3 أو x=-2')).toBe(true);
    expect(isAnswerCorrect('-2,-3', '-3,-2')).toBe(true);
  });

  it('normalizes Arabic-Indic digits', () => {
    expect(isAnswerCorrect('٥', '5')).toBe(true);
  });

  it('rejects a wrong answer', () => {
    expect(isAnswerCorrect('x=2', 'x=-2')).toBe(false);
  });

  it('rejects an empty answer', () => {
    expect(isAnswerCorrect('', 'x=5')).toBe(false);
  });

  it('applies numeric tolerance for decimals', () => {
    expect(isAnswerCorrect('3.14', '3.1416', 0.01)).toBe(true);
    expect(isAnswerCorrect('3.0', '3.1416', 0.01)).toBe(false);
  });
});
