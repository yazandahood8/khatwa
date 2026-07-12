import { describe, it, expect } from 'vitest';
import { evaluateGuided, type GuidedGraph } from './guidedSolve';

// رسم حلّ: "ثمن 3 دفاتر وقلمين (قلم=4)، ثم عند x=6"
const GRAPH: GuidedGraph = {
  milestones: [
    { id: 'notebooks', label: '3 دفاتر = 3x', targetExpr: '3x', required: false, praise: 'تمام 👍', nextHint: 'احسب القلمين.' },
    { id: 'pens', label: 'قلمين = 8', targetExpr: '2*4', required: false, praise: 'صح 👍', nextHint: 'اجمعهم بتعبير.' },
    { id: 'expr', label: 'التعبير 3x+8', targetExpr: '3x+8', required: true, praise: 'ممتاز 🎯', nextHint: 'عوّض x=6.' },
    { id: 'value', label: 'القيمة 26', targetExpr: '26', required: true, praise: 'أحسنت ✅' },
  ],
  wrong: [
    { matchExpr: '5x', message: 'ما بتجمع الدفاتر مع الأقلام.' },
    { matchExpr: '3x+4', message: 'عندك قلمين مش واحد: 2×4=8.' },
    { matchExpr: '36', message: '3×6=18 مش 36.' },
    { matchExpr: '24', message: 'راجع الجمع 18+8.' },
  ],
  fallbackHint: 'ابدأ بثمن 3 دفاتر.',
};

const run = (steps: string[]) => {
  const priors: string[] = [];
  const out: { kind: string | null }[] = [];
  for (const s of steps) {
    const v = evaluateGuided(GRAPH, priors, s);
    out.push({ kind: v ? v.kind : null });
    priors.push(s);
  }
  return out;
};

describe('evaluateGuided', () => {
  it('S1 — clean stepwise path solves', () => {
    const r = run(['3x', '2·4', '3x+8', '3·6+8']);
    expect(r.map((x) => x.kind)).toEqual(['correct', 'correct', 'correct', 'solved']);
  });

  it('S2 — catches 5x mistake, then recovers and solves', () => {
    const r = run(['5x', '3x+8', '26']);
    expect(r.map((x) => x.kind)).toEqual(['mistake', 'correct', 'solved']);
  });

  it('S3 — jump to expression then value', () => {
    expect(run(['3x+8', '26']).map((x) => x.kind)).toEqual(['correct', 'solved']);
  });

  it('S4 — value first is not "solved" until required expression is also given', () => {
    const r = run(['26', '3x+8']);
    expect(r[0].kind).toBe('correct'); // value done but expr still required
    expect(r[1].kind).toBe('solved');
  });

  it('S5 — arithmetic slip caught, then solves', () => {
    const r = run(['3x+4', '3x+8', '18+8=24', '18+8']);
    expect(r.map((x) => x.kind)).toEqual(['mistake', 'correct', 'mistake', 'solved']);
  });

  it('S6 — unrecognized step returns null (falls back to AI)', () => {
    const r = run(['3x+8', 'ما بعرف', '26']);
    expect(r[1].kind).toBe(null);
    expect(r[2].kind).toBe('solved');
  });

  it('S7 — equivalent forms match (order, ·, substitution)', () => {
    expect(run(['8+3·x', '8+3*6']).map((x) => x.kind)).toEqual(['correct', 'solved']);
  });

  it('repeating a done milestone is "already", not "solved"', () => {
    const r = run(['3x+8', '3x+8']);
    expect(r[1].kind).toBe('already');
  });
});
