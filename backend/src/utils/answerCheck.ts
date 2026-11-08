/**
 * تطبيع ومقارنة الإجابات — answer normalization & comparison (no AI).
 * يقبل صياغات مختلفة: "x=-2 أو x=-3" == "x=-3 أو x=-2" == "-2,-3"
 * ويقبل القيم المتكافئة عددياً: "75/216" == "25/72" == "0.347222…"، و"1/2" == "0.5" == "50%".
 * وإذا لم يضبط المؤلّف هامشاً، يَقبل تقريب الطالب لعددٍ عشريّ بمنزلتين فأكثر (0.38 لـ 0.384).
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
    .map((p) => p.replace(/^[a-z]=/, '').replace(/^=/, '')) // drop leading "x="/"y="/"=" prefix
    .filter((p) => p.length > 0)
    .sort();
}

/**
 * يقيّم رمزاً واحداً كقيمة عددية إن أمكن — عدد عادي، أو كسر a/b، أو نسبة مئوية x%.
 * يُرجع null إن لم يكن قيمة عددية (مثل "(x-2)(x-3)").
 */
function toValue(token: string): number | null {
  const s = toAsciiDigits(token).replace(/\s+/g, '');
  const pct = s.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (pct) return Number(pct[1]) / 100;
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const denom = Number(frac[2]);
    return denom !== 0 ? Number(frac[1]) / denom : null;
  }
  const n = Number(s);
  return Number.isFinite(n) && s !== '' ? n : null;
}

/** عدد المنازل العشرية في رمز عشريّ صريح (يحوي نقطة)، وإلا -1. */
function decimalPlaces(token: string): number {
  const s = toAsciiDigits(token).replace(/\s+/g, '');
  const m = s.match(/^-?\d+\.(\d+)$/);
  return m ? m[1].length : -1;
}

function roundTo(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}

/**
 * أقلّ عدد منازل يُقبل عنده تقريب الطالب — نمنع التساهل عند منزلة واحدة (0.3 لـ 1/3).
 */
const MIN_ROUND_PLACES = 2;

/**
 * هل القيمتان متطابقتان عددياً؟ تطابق ضمن الهامش، أو (بلا هامص) تقريب أحدهما
 * لعدد منازل الآخر (بمنزلتين فأكثر) — لقبول تقريب الطالب المعقول دون فتح الباب لإجابات خاطئة.
 */
function numericMatch(aTok: string, bTok: string, tolerance: number): boolean {
  const a = toValue(aTok);
  const b = toValue(bTok);
  if (a === null || b === null) return false;

  if (tolerance > 0) return Math.abs(a - b) <= tolerance;

  // تطابق تامّ (مع هامش ضئيل لأخطاء الفاصلة العائمة) — exact within float epsilon
  if (Math.abs(a - b) <= Math.max(1e-9, 1e-9 * Math.abs(b))) return true;

  // قبول التقريب: إن كتب أحدهما عشرياً بمنزلتين فأكثر وطابق تقريبُ الآخر لتلك المنازل.
  const da = decimalPlaces(aTok);
  if (da >= MIN_ROUND_PLACES && roundTo(b, da) === a) return true;
  const db = decimalPlaces(bTok);
  if (db >= MIN_ROUND_PLACES && roundTo(a, db) === b) return true;

  return false;
}

/** يقارن إجابة الطالب بالإجابة الصحيحة (رمزياً أو عددياً، مع قبول تقريب معقول). */
export function isAnswerCorrect(student: string, correct: string, tolerance = 0): boolean {
  if (!student.trim()) return false;

  const a = normalize(student);
  const b = normalize(correct);
  if (a.length !== b.length) return false;

  // طابق كل رمز في الإجابة الصحيحة برمز مميّز من إجابة الطالب: تطابق رمزي أو عددي.
  const used = new Array(a.length).fill(false);
  return b.every((bTok) => {
    for (let i = 0; i < a.length; i++) {
      if (used[i]) continue;
      if (a[i] === bTok || numericMatch(a[i], bTok, tolerance)) {
        used[i] = true;
        return true;
      }
    }
    return false;
  });
}
