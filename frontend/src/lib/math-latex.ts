/**
 * تحويل تعبير لوحة المفاتيح إلى LaTeX — best-effort transform for KaTeX preview.
 * المدخل: سلسلة مبنية برموز يونيكود (× ÷ √ ² ³ π …) من لوحة المفاتيح الرياضية.
 */
export function toLatex(expr: string): string {
  let s = expr;

  // الأقواس المعقّفة الحرفية — escape user-typed braces before we generate grouping braces below.
  s = s.replace(/\{/g, '\\lbrace ').replace(/\}/g, '\\rbrace ');

  // الدوال المثلثية — trig functions (tokens entered as "sin(", "cos(", "tan(")
  s = s.replace(/\bsin\b/g, '\\sin ').replace(/\bcos\b/g, '\\cos ').replace(/\btan\b/g, '\\tan ');

  // الجذور — roots: √(...) و √n
  s = s.replace(/√\(([^)]*)\)/g, '\\sqrt{$1}');
  s = s.replace(/√(\d+(?:\.\d+)?|[a-zA-Zπ])/g, '\\sqrt{$1}');
  s = s.replace(/√/g, '\\sqrt{}');

  // الأسس — exponents
  s = s.replace(/²/g, '^{2}').replace(/³/g, '^{3}');

  // العمليات والرموز — operators & symbols
  s = s
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/π/g, '\\pi ')
    .replace(/≤/g, '\\le ')
    .replace(/≥/g, '\\ge ')
    .replace(/≠/g, '\\neq ')
    .replace(/±/g, '\\pm ')
    .replace(/∞/g, '\\infty ');

  return s;
}
