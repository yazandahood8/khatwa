'use client';

import { JudgedTextSolve } from '@/components/solve/judged-text-solve';
import type { ProblemFull, ProblemListItem } from '@/lib/problems-api';

/** سؤال فهم مقروء مفتوح — قطعة + إجابة نصّية بالإنجليزية يقيّمها الذكاء الاصطناعي. */
export function ReadingSolve({ problem, sequence }: { problem: ProblemFull; sequence: ProblemListItem[] }) {
  return <JudgedTextSolve problem={problem} sequence={sequence} variant="reading" />;
}
