'use client';

import { JudgedTextSolve } from '@/components/solve/judged-text-solve';
import type { ProblemFull, ProblemListItem } from '@/lib/problems-api';

/** مهمّة كتابة إنجليزية (مقال/رسالة/فقرة) يقيّمها الذكاء الاصطناعي بمعايير بجروت. */
export function WritingSolve({ problem, sequence }: { problem: ProblemFull; sequence: ProblemListItem[] }) {
  return <JudgedTextSolve problem={problem} sequence={sequence} variant="writing" />;
}
