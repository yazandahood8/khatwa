/**
 * تجزئة نصّ يخلط العربية مع الرياضيات إلى مقاطع — split mixed Arabic/math text.
 *
 * المشكلة: نصّ السؤال يخلط العربية (RTL) بتعبيرات رياضية (LTR) في سطر واحد،
 * فتعيد خوارزمية bidi ترتيب الرموز المحايدة (= + − ∫ [ ] → /) بشكل مشوّش.
 * الحلّ: نعزل كل «مقطع رياضي» في span مستقلّ (dir="ltr" + unicode-bidi: isolate)
 * كي لا يتداخل ترتيبه مع العربية المحيطة.
 */

export interface BidiSegment {
  kind: 'ar' | 'math';
  text: string;
}

// رمز «قوي» يثبّت المقطع كرياضي (حرف لاتيني/رقم/رمز رياضي أساسي)
const STRONG = /[A-Za-z0-9²³ⁿˣπΠθ∞√∫∑∏Δ]/;

// تسلسل من محارف «الفئة الرياضية»: حروف/أرقام/عوامل/أقواس/مسافات — بلا حروف عربية
// وبلا علامات ترقيم الجُمَل (: ; ! ؟) كي تبقى ملتصقة بالعربية.
const MATH_RUN = /[A-Za-z0-9²³ⁿˣ°πΠθ∞√∫∑∏Δ+\-−±×÷*/^=<>≤≥≠≈()[\]{}.,'"|→%_\s]+/g;

/**
 * يُرجع النصّ مقسّماً إلى مقاطع عربية ورياضية بالترتيب.
 * المسافات المحيطة بأي مقطع رياضي تُعاد إلى تدفّق العربية حتى لا تنزاح المباعدة.
 */
export function segmentBidi(text: string): BidiSegment[] {
  const segments: BidiSegment[] = [];
  let lastIndex = 0;

  const pushAr = (s: string) => {
    if (!s) return;
    // ادمج مع مقطع عربي سابق متجاور إن وُجد
    const prev = segments[segments.length - 1];
    if (prev && prev.kind === 'ar') prev.text += s;
    else segments.push({ kind: 'ar', text: s });
  };

  for (const m of text.matchAll(MATH_RUN)) {
    const raw = m[0];
    const start = m.index ?? 0;
    const core = raw.trim();

    // تسلسل من عوامل/مسافات فقط بلا رمز قوي → اتركه ضمن العربية
    if (!STRONG.test(core)) continue;

    const leadWs = raw.length - raw.trimStart().length;
    const trailWs = raw.length - raw.trimEnd().length;

    // العربية قبل المقطع + أي مسافة بادئة للمقطع
    pushAr(text.slice(lastIndex, start) + raw.slice(0, leadWs));
    segments.push({ kind: 'math', text: core });
    lastIndex = start + raw.length - trailWs;
  }

  pushAr(text.slice(lastIndex));
  return segments;
}
