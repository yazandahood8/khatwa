import { z } from 'zod';
import { Difficulty } from './enums';

/**
 * مخطط المسألة الكاملة — full problem with nested methods/steps/mistakes.
 * يُرسَل دفعة واحدة من محرر المسائل في لوحة الأدمن.
 */

export const solutionStepSchema = z.object({
  stepNumber: z.coerce.number().int().min(1),
  description: z.string().trim().min(1, 'وصف الخطوة مطلوب'),
  expression: z.string().trim().min(1, 'التعبير الرياضي مطلوب'),
  hint: z.string().trim().min(1, 'التلميح مطلوب'),
});

export const solutionMethodSchema = z.object({
  name: z.string().trim().min(1, 'اسم الطريقة مطلوب').max(80),
  isRecommended: z.boolean().optional(),
  steps: z.array(solutionStepSchema).min(1, 'أضف خطوة واحدة على الأقل'),
});

export const commonMistakeSchema = z.object({
  description: z.string().trim().min(1, 'وصف الخطأ مطلوب'),
  wrongExample: z.string().trim().min(1, 'مثال الخطأ مطلوب'),
  correction: z.string().trim().min(1, 'التصحيح مطلوب'),
});

// خيار سؤال اختيار من متعدّد/إكمال — MCQ/cloze option
export const choiceSchema = z.object({ text: z.string().trim().min(1, 'نص الخيار مطلوب').max(500) });

// الحقول المشتركة للمسألة — مسائل الرياضيات تتطلّب طرقاً؛ الإنجليزي/البرمجة لا.
const problemBase = z.object({
  topicId: z.string().min(1),
  code: z.string().trim().max(60).optional(),
  question: z.string().trim().min(2, 'نص السؤال مطلوب'),
  finalAnswer: z.string().trim().min(1, 'الجواب النهائي مطلوب'),
  answerTolerance: z.coerce.number().min(0).optional(),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  allowFreeMethod: z.boolean().optional(),
  orderIndex: z.coerce.number().int().min(0).optional(),
  // نوع المسألة وتخصّصها — null/undefined = رياضيات عادية
  language: z.string().trim().max(20).optional(), // "english" | "csharp"
  kind: z.string().trim().max(20).optional(), // "mcq" | "cloze" | "reading" | "writing" | "explain" | "trace_*"
  choices: z.array(choiceSchema).max(10).optional(), // MCQ/cloze
  passage: z.string().trim().max(8000).optional(), // قطعة القراءة أو موجز الكتابة
  hintWords: z // كلمات السؤال المهمة + ترجمتها العربية — لزرّ «تلميح» (إنجليزي)
    .array(z.object({ en: z.string().trim().min(1).max(60), ar: z.string().trim().min(1).max(120) }))
    .max(12)
    .optional(),
  passageHintWords: z // كلمات القطعة المهمة + ترجمتها — لزرّ «تلميح» على القطعة
    .array(z.object({ en: z.string().trim().min(1).max(60), ar: z.string().trim().min(1).max(120) }))
    .max(40)
    .optional(),
  starterCode: z.string().trim().max(4000).optional(),
  methods: z.array(solutionMethodSchema).optional().default([]),
  commonMistakes: z.array(commonMistakeSchema).optional(),
});

// الرياضيات العادية (بلا language/kind) تتطلّب طريقة حل واحدة على الأقل؛ غيرها لا.
const requireMethodsForMath = (d: { language?: string; kind?: string; methods?: unknown[] }) =>
  !!d.language || !!d.kind || (d.methods?.length ?? 0) >= 1;
const methodsError = { message: 'أضف طريقة حل واحدة على الأقل', path: ['methods'] };

export const createProblemSchema = problemBase.refine(requireMethodsForMath, methodsError);

// التحديث: نفس الحقول بدون topicId (المسألة تبقى في موضوعها)
export const updateProblemSchema = problemBase.omit({ topicId: true }).refine(requireMethodsForMath, methodsError);

export type Choice = z.infer<typeof choiceSchema>;
export type SolutionStepInput = z.infer<typeof solutionStepSchema>;
export type SolutionMethodInput = z.infer<typeof solutionMethodSchema>;
export type CommonMistakeInput = z.infer<typeof commonMistakeSchema>;
export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;
