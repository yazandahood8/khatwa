/**
 * الطبقة الأولى الحتمية — deterministic Layer-1 step matching (خطة المشروع §6).
 * يقارن خطوة الطالب مع الخطوات/الأخطاء المخزّنة مطابقةً نصّيةً مُطبَّعة، ويعيد رداً
 * سقراطياً جاهزاً عند الثقة — فيوفّر استدعاء Claude وتكلفته. متحفّظ عمداً:
 * مطابقة تامة فقط، والخطوة الأخيرة تُترك للـ AI (لمعالجة [SOLVED]).
 */

interface StepLite {
  stepNumber: number;
  expression: string;
  hint: string;
}
interface MethodLite {
  name: string;
  steps: StepLite[];
}
interface MistakeLite {
  wrongExample: string;
  correction: string;
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** تطبيع التعبير للمقارنة — normalize an expression for comparison (favor false negatives). */
function norm(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/[.…]+$/g, ''); // نقاط زائدة في النهاية
}

export type StepMatch =
  | { kind: 'correct'; reply: string }
  | { kind: 'mistake'; reply: string }
  | null;

/**
 * يطابق خطوة الطالب حتمياً — returns a canned Socratic reply on a confident exact
 * match, or null to fall back to the AI. Never reveals the final answer.
 */
export function matchStep(
  studentExpr: string,
  methods: MethodLite[],
  mistakes: MistakeLite[],
): StepMatch {
  const target = norm(studentExpr);
  if (target.length < 2) return null; // قصير جداً — لا تخاطر، اترك للـ AI

  // 1) خطأ شائع معروف؟ — exact match against a stored common mistake.
  for (const m of mistakes) {
    if (m.wrongExample && norm(m.wrongExample) === target) {
      return { kind: 'mistake', reply: `انتبه لهالنقطة 👀 ${m.correction.trim()} — جرّب مرّة ثانية 💪` };
    }
  }

  // 2) خطوة صحيحة على مسار معروف (وليست الأخيرة)؟ — a known correct, non-final step.
  for (const method of methods) {
    const steps = method.steps;
    for (let i = 0; i < steps.length; i++) {
      if (norm(steps[i].expression) !== target) continue;
      if (i === steps.length - 1) return null; // آخر خطوة → اترك التأكيد النهائي للـ AI
      const nextHint = steps[i + 1]?.hint?.trim();
      const tail = nextHint ? ` فكّر بالخطوة الجاية: ${nextHint}` : ' كمّل للخطوة الجاية.';
      return { kind: 'correct', reply: `منيح! خطوتك صح 👍${tail}` };
    }
  }

  return null;
}
