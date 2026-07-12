/**
 * محرّك الحلّ الموجّه (الطبقة الحتمية بلا AI) — deterministic guided step solver.
 *
 * لكل مسألة "محطّات" مرتّبة (بعضها إجباري) و"أخطاء معروفة". الطالب يكتب خطوة خطوة؛
 * نطبّع خطوته رياضياً ونقارنها بالمحطّات/الأخطاء بأي صياغة مكافئة. يرجّع رداً جاهزاً
 * (صحّ/غلط/سبق/اكتمل) عند التعرّف، أو null ليسقط النداء للـ AI عند خطوة غير معروفة.
 *
 * التطبيع خطّي بمتغيّر واحد (يُكتشف تلقائياً): يقبل "3x+8"، "8+3·x"، "3(6)+8"، "2*4".
 * ما لا يمكن تحليله خطّياً (مثل متغيّرين أو كسر معقّد) يُقارن كنصّ مطبّع (أضعف لكنه آمن).
 */

export interface GuidedMilestone {
  id: string;
  label: string;
  targetExpr: string;
  required: boolean;
  praise: string;
  /** توجيه للوصول لهذه المحطّة (يُعرض حين تكون هي المطلوب التالي فعلاً). */
  pendingHint?: string | null;
  nextHint?: string | null; // (قديم) لم يعد يُستخدم — التوجيه صار سياقياً
}
export interface GuidedWrong {
  matchExpr: string;
  message: string;
}
export interface GuidedGraph {
  milestones: GuidedMilestone[];
  wrong: GuidedWrong[];
  fallbackHint?: string | null;
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const DEFAULT_FALLBACK = 'ما قدرت أتأكّد من خطوتك — جرّب تكتبها أوضح، أو اطلب تلميح 💡';

function normalizeExpr(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[×·*]/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/([a-z\d)])\(/g, '$1*(') // ضرب ضمنيّ قبل قوس: 3( ، x( ، )(
    .replace(/\)([a-z\d])/g, ')*$1') // ضرب ضمنيّ بعد قوس: )3 ، )x
    .replace(/(\d)([a-z])/g, '$1*$2'); // معامل متغيّر: 3x ⟶ 3*x
}

/** يأخذ الطرف الأيمن إن كتب الطالب "خطوة = نتيجة". */
function rightSide(s: string): string {
  const parts = s.split('=').filter((p) => p.trim());
  return parts.length ? parts[parts.length - 1] : s;
}

type Lin = { a: number; b: number }; // a·v + b

/** يحلّل تعبيراً خطّياً بمتغيّر واحد (يُكتشف)، أو null إن تعذّر. */
function parseLinear(raw: string): Lin | null {
  const s = normalizeExpr(rightSide(raw));
  const letters = new Set(s.match(/[a-z]/g) ?? []);
  if (letters.size > 1) return null; // أكثر من متغيّر — خارج نطاق الطبقة الخطّية
  const V = [...letters][0]; // المتغيّر (قد يكون undefined = تعبير عدديّ)

  let i = 0;
  const peek = () => s[i];
  const lin = (a: number, b: number): Lin => ({ a, b });
  const mul = (x: Lin, y: Lin): Lin | null =>
    x.a !== 0 && y.a !== 0 ? null : lin(x.a * y.b + y.a * x.b, x.b * y.b);

  function num(): Lin | null {
    let j = i;
    while (j < s.length && /[\d.]/.test(s[j])) j++;
    if (j === i) return null;
    const n = Number(s.slice(i, j));
    i = j;
    return Number.isFinite(n) ? lin(0, n) : null;
  }
  function factor(): Lin | null {
    if (peek() === '(') {
      i++;
      const e = expr();
      if (peek() !== ')') return null;
      i++;
      return e;
    }
    if (V && peek() === V) { i++; return lin(1, 0); }
    return num();
  }
  function term(): Lin | null {
    let v = factor();
    if (!v) return null;
    while (peek() === '*' || peek() === '/') {
      const op = s[i++];
      const r = factor();
      if (!r) return null;
      if (op === '*') { const m = mul(v, r); if (!m) return null; v = m; }
      else { if (r.a !== 0 || r.b === 0) return null; v = lin(v.a / r.b, v.b / r.b); }
    }
    return v;
  }
  function expr(): Lin | null {
    let sign = 1;
    if (peek() === '+' || peek() === '-') sign = s[i++] === '-' ? -1 : 1;
    let v = term();
    if (!v) return null;
    if (sign === -1) v = lin(-v.a, -v.b);
    while (peek() === '+' || peek() === '-') {
      const op = s[i++];
      const r = term();
      if (!r) return null;
      v = op === '+' ? lin(v.a + r.a, v.b + r.b) : lin(v.a - r.a, v.b - r.b);
    }
    return v;
  }
  const out = expr();
  return out && i === s.length ? out : null;
}

/** مفتاح قانونيّ للمقارنة: خطّي "L:a:b"، وإلا نصّ مطبّع "S:...". */
function canonKey(expr: string): string {
  const lin = parseLinear(expr);
  if (lin) {
    const r = (n: number) => (Math.abs(n) < 1e-9 ? 0 : Math.round(n * 1e6) / 1e6);
    return `L:${r(lin.a)}:${r(lin.b)}`;
  }
  return `S:${normalizeExpr(rightSide(expr))}`;
}

export type GuidedVerdict =
  | { kind: 'correct' | 'already' | 'solved'; reply: string }
  | { kind: 'mistake'; reply: string };

/**
 * يقيّم خطوة الطالب الحالية بمعرفة خطواته السابقة (لإعادة بناء التقدّم).
 * يرجّع verdict عند التعرّف، أو null ليُكمل النداء لطبقة أدنى/الـ AI.
 */
export function evaluateGuided(
  graph: GuidedGraph,
  priorSteps: string[],
  current: string,
): GuidedVerdict | null {
  if (!graph.milestones.length) return null;

  const mByKey = new Map(graph.milestones.map((m) => [canonKey(m.targetExpr), m]));
  const wByKey = new Map(graph.wrong.map((w) => [canonKey(w.matchExpr), w]));

  // أعد بناء المحطّات المنجزة من الخطوات السابقة
  const done = new Set<string>();
  for (const prev of priorSteps) {
    const m = mByKey.get(canonKey(prev));
    if (m) done.add(m.id);
  }

  const key = canonKey(current);

  const wrong = wByKey.get(key);
  if (wrong) return { kind: 'mistake', reply: `👀 ${wrong.message}` };

  const hit = mByKey.get(key);
  if (!hit) return null; // غير معروفة — اسقط للـ AI

  // توجيه سياقيّ: يشير دائماً لأوّل محطّة إجبارية ما زالت ناقصة (لا خطوة أنجزها الطالب).
  const nextGuidance = (): string => {
    const next = graph.milestones.find((m) => m.required && !done.has(m.id));
    if (!next) return '';
    return next.pendingHint ?? `باقي: ${next.label}.`;
  };

  if (done.has(hit.id)) {
    return { kind: 'already', reply: `هاي خطوة عملناها 👍 ${nextGuidance()}`.trim() };
  }
  done.add(hit.id);

  const allRequiredDone = graph.milestones.filter((m) => m.required).every((m) => done.has(m.id));
  if (allRequiredDone) return { kind: 'solved', reply: `${hit.praise}\n[SOLVED]` };

  return { kind: 'correct', reply: `${hit.praise} ${nextGuidance()}`.trim() };
}

export { DEFAULT_FALLBACK };
