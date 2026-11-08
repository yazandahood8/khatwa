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

  it('accepts equivalent fractions (unreduced == reduced)', () => {
    expect(isAnswerCorrect('75/216', '25/72')).toBe(true);
    expect(isAnswerCorrect('6/8', '3/4')).toBe(true);
  });

  it('accepts a fraction that equals a decimal', () => {
    expect(isAnswerCorrect('1/2', '0.5')).toBe(true);
    expect(isAnswerCorrect('0.5', '1/2')).toBe(true);
  });

  it('accepts a percent that equals a decimal or fraction', () => {
    expect(isAnswerCorrect('50%', '0.5')).toBe(true);
    expect(isAnswerCorrect('50%', '1/2')).toBe(true);
  });

  it('treats trailing-zero and integer forms as equal', () => {
    expect(isAnswerCorrect('2.0', '2')).toBe(true);
  });

  it('strips a leading variable prefix other than x', () => {
    expect(isAnswerCorrect('y=5', '5')).toBe(true);
  });

  it('matches equivalent-value multi-root sets in any order', () => {
    expect(isAnswerCorrect('1/2 , 3/4', '0.75 أو 0.5')).toBe(true);
  });

  it('accepts a reasonable 2+ decimal rounding of a fraction', () => {
    // 25/72 = 0.3472…  → الطالب يقرّب لمنزلتين/ثلاث
    expect(isAnswerCorrect('0.35', '25/72')).toBe(true);
    expect(isAnswerCorrect('0.347', '25/72')).toBe(true);
    expect(isAnswerCorrect('0.38', '0.384')).toBe(true);
  });

  it('rejects a too-coarse (1 decimal) rounding', () => {
    // 0.3 لـ 1/3 تقريب فضفاض — يُرفض
    expect(isAnswerCorrect('0.3', '1/3')).toBe(false);
    // 0.35 ليس تقريباً صحيحاً لـ 1/3 (=0.33)
    expect(isAnswerCorrect('0.35', '1/3')).toBe(false);
  });

  it('rejects a wrong fraction', () => {
    expect(isAnswerCorrect('1/3', '1/2')).toBe(false);
  });

  it('does not numerically merge distinct roots into one', () => {
    // مجموعتان بأحجام مختلفة يجب ألّا تتطابقا
    expect(isAnswerCorrect('0.5', '1/2 أو 3/4')).toBe(false);
  });
});
