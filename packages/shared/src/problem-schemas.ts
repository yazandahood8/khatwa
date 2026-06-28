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

export const createProblemSchema = z.object({
  topicId: z.string().min(1),
  code: z.string().trim().max(60).optional(),
  question: z.string().trim().min(2, 'نص السؤال مطلوب'),
  finalAnswer: z.string().trim().min(1, 'الجواب النهائي مطلوب'),
  answerTolerance: z.coerce.number().min(0).optional(),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  allowFreeMethod: z.boolean().optional(),
  orderIndex: z.coerce.number().int().min(0).optional(),
  methods: z.array(solutionMethodSchema).min(1, 'أضف طريقة حل واحدة على الأقل'),
  commonMistakes: z.array(commonMistakeSchema).optional(),
});

// التحديث: نفس الحقول بدون topicId (المسألة تبقى في موضوعها)
export const updateProblemSchema = createProblemSchema.omit({ topicId: true });

export type SolutionStepInput = z.infer<typeof solutionStepSchema>;
export type SolutionMethodInput = z.infer<typeof solutionMethodSchema>;
export type CommonMistakeInput = z.infer<typeof commonMistakeSchema>;
export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;
