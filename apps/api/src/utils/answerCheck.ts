/**
 * تطبيع ومقارنة الإجابات — answer normalization & comparison (no AI).
 * يقبل صياغات مختلفة: "x=-2 أو x=-3" == "x=-3 أو x=-2" == "-2,-3"
 */

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function toAsciiDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

/** يحوّل الإجابة لمجموعة رموز موحّدة قابلة للمقارنة. */
function normalize(s: string): string[] {
  const cleaned = toAsciiDigits(s)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/(أو|،|,|;|\bor\b|\|)/g, '|');

  return cleaned
    .split('|')
    .map((p) => p.replace(/^x=/, '').replace(/^=/, '')) // drop "x=" / "=" prefix
    .filter((p) => p.length > 0)
    .sort();
}

function asNumber(s: string): number | null {
  const n = Number(toAsciiDigits(s).replace(/\s+/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** يقارن إجابة الطالب بالإجابة الصحيحة (مع هامش للأرقام العشرية). */
export function isAnswerCorrect(student: string, correct: string, tolerance = 0): boolean {
  if (!student.trim()) return false;

  const a = normalize(student);
  const b = normalize(correct);

  // مقارنة رمزية مباشرة — exact set match
  if (a.length === b.length && a.every((v, i) => v === b[i])) return true;

  // مقارنة عددية مع هامش — numeric tolerance (single values)
  if (tolerance > 0 && a.length === 1 && b.length === 1) {
    const na = asNumber(a[0]);
    const nb = asNumber(b[0]);
    if (na !== null && nb !== null) return Math.abs(na - nb) <= tolerance;
  }

  return false;
}
