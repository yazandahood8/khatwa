'use client';

import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useMemo } from 'react';
import { toLatex } from '@/lib/math-latex';

/** يعرض تعبيراً رياضياً عبر KaTeX — renders a math expression with KaTeX. */
export function Math({ expr, block = false }: { expr: string; block?: boolean }) {
  const html = useMemo(() => {
    if (!expr) return '';
    try {
      return katex.renderToString(toLatex(expr), { throwOnError: false, displayMode: block });
    } catch {
      return expr;
    }
  }, [expr, block]);

  return <span dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />;
}
