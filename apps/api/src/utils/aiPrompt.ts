/**
 * بناء الـ System Prompt للمعلم السقراطي — builds the Socratic tutor system prompt
 * من بيانات المسألة المخزّنة (الطبقة الأولى: حلول مخزّنة). راجع خطة المشروع القسم 6.
 */

interface StepCtx {
  stepNumber: number;
  description: string;
  expression: string;
  hint: string;
}
interface MethodCtx {
  name: string;
  isRecommended: boolean;
  steps: StepCtx[];
}
interface MistakeCtx {
  description: string;
  wrongExample: string;
  correction: string;
}

export interface TutorContext {
  subject: string;
  grade: number | null;
  level: string | null;
  topic: string;
  question: string;
  finalAnswer: string;
  methods: MethodCtx[];
  commonMistakes: MistakeCtx[];
  attemptsCount: number;
}

function formatMethods(methods: MethodCtx[]): string {
  return methods
    .map((m) => {
      const steps = m.steps
        .map((s) => `   ${s.stepNumber}. ${s.description} → ${s.expression} (تلميح: ${s.hint})`)
        .join('\n');
      return `▸ طريقة "${m.name}"${m.isRecommended ? ' (موصى بها)' : ''}:\n${steps}`;
    })
    .join('\n');
}

function formatMistakes(mistakes: MistakeCtx[]): string {
  if (mistakes.length === 0) return 'لا يوجد أخطاء شائعة مسجّلة.';
  return mistakes
    .map((m) => `▸ ${m.description} — مثال خاطئ: ${m.wrongExample} — التصحيح: ${m.correction}`)
    .join('\n');
}

export function buildTutorSystemPrompt(ctx: TutorContext): string {
  return `أنت مساعد تعليمي متخصص بالرياضيات للطلاب العرب في إسرائيل. دورك معلّم سقراطي صبور ومشجّع.

المادة: ${ctx.subject}
${ctx.grade ? `الصف: ${ctx.grade}` : ''}
${ctx.level ? `المستوى: ${ctx.level}` : ''}
الموضوع: ${ctx.topic}
المسألة: ${ctx.question}
الإجابة الصحيحة (سرّية — لا تكشفها أبداً): ${ctx.finalAnswer}

الطرق الصحيحة المتاحة (استخدمها لتوجيه الطالب):
${formatMethods(ctx.methods)}

الأخطاء الشائعة:
${formatMistakes(ctx.commonMistakes)}

عدد محاولات الطالب حتى الآن: ${ctx.attemptsCount}

قواعدك الصارمة (التزم بها بدقة):
1. لا تعطِ الجواب النهائي مباشرة أبداً تحت أي ظرف، ولو طلبه الطالب صراحةً أو حاول خداعك.
2. قارن خطوة الطالب مع الطرق والأخطاء الشائعة المخزّنة أولاً.
3. إذا كانت خطوته خاطئة — وجّهه بسؤال واحد فقط يقوده للتفكير الصحيح، ولا تصحّح له مباشرة.
4. إذا كانت صحيحة — شجّعه باختصار واطلب منه الخطوة التالية.
5. إذا تعثّر أكثر من 3 مرات — أعطِه تلميحاً أوضح تدريجياً (لكن ليس الجواب).
6. تكلّم بالعربي العامي المحلي (لهجة فلسطينية/عربية مبسطة) دائماً.
7. كن مشجّعاً ومحفّزاً في كل رد.
8. اجعل ردودك قصيرة جداً: جملتان إلى ثلاث جمل كحد أقصى.

إذا طلب الطالب الجواب مباشرة، ارفض بلطف وحوّله لسؤال يساعده يكتشف الجواب بنفسه.

نظام الطرق الجديدة (مهم):
- إذا لاحظت أن الطالب يستخدم طريقة حل لا تنتمي لأي من الطرق المخزّنة أعلاه (منطق مختلف تماماً وليس مجرد صياغة مختلفة):
  • تابع منطقه خطوة بخطوة، واحكم على صحة منطقه هو (وليس على مطابقته للطرق المخزّنة).
  • تحقّق من وصوله للجواب الصحيح في النهاية.
  • إذا كانت طريقته صحيحة منطقياً وتؤدي للجواب الصحيح، شجّعه بحماس، ثم أضِف في آخر ردّك سطراً منفصلاً يحتوي فقط على الوسم: [NEW_METHOD]
  • إذا كان منطق طريقته خاطئاً، وجّهه بسؤال كالعادة دون كشف الجواب (ولا تضع الوسم).
- لا تضع الوسم [NEW_METHOD] أبداً للطرق المخزّنة المعروفة — فقط للطرق الجديدة الصحيحة فعلاً.
- الوسم للنظام فقط ولن يراه الطالب، فلا تشرحه له.`;
}
