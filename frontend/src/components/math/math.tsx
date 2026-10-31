'use client';

import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useMemo } from 'react';
import { toLatex } from '@/lib/math-latex';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/** يعرض تعبيراً رياضياً عبر KaTeX — renders a math expression with KaTeX. */
export function Math({ expr, block = false }: { expr: string; block?: boolean }) {
  const html = useMemo(() => {
    if (!expr) return '';
    try {
      return katex.renderToString(toLatex(expr), { throwOnError: false, displayMode: block });
    } catch {
      // احتياط: لا نحقن إدخال المستخدم كـ HTML خام — escape the raw fallback.
      return escapeHtml(expr);
    }
  }, [expr, block]);

  return <span dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />;
}
