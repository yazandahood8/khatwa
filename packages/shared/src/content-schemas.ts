import { z } from 'zod';

/**
 * مخططات إدارة المحتوى — content management Zod schemas (admin).
 * subject → grade → level → topic → lesson
 */

const nameAr = z.string().trim().min(2, 'الاسم قصير جداً').max(100);
const orderIndex = z.coerce.number().int().min(0).default(0);

// المواد — subjects
export const createSubjectSchema = z.object({
  nameAr,
  nameHe: z.string().trim().max(100).optional(),
  icon: z.string().trim().max(20).optional(),
  isActive: z.boolean().optional(),
  orderIndex: orderIndex.optional(),
});
export const updateSubjectSchema = createSubjectSchema.partial();

// الصفوف — grades (7..12)
export const createGradeSchema = z.object({
  subjectId: z.string().min(1),
  gradeNumber: z.coerce.number().int().min(7, 'الصف من 7 إلى 12').max(12, 'الصف من 7 إلى 12'),
});

// المستويات (وحدات) — levels
// أب واحد فقط: gradeId (7-9) أو subjectId (مسار وحدات 10-12).
export const createLevelSchema = z
  .object({
    gradeId: z.string().min(1).optional(),
    subjectId: z.string().min(1).optional(),
    unitLevel: z.coerce.number().int().min(3).max(5).optional(),
    name: z.string().trim().min(1, 'اسم المستوى مطلوب').max(40),
  })
  .refine((d) => (d.gradeId ? 1 : 0) + (d.subjectId ? 1 : 0) === 1, {
    message: 'حدّد الصف (gradeId) أو المادة (subjectId) — واحد فقط',
    path: ['gradeId'],
  });

// نموذج — questionnaires (courses under a unit track, 10-12)
export const createQuestionnaireSchema = z.object({
  levelId: z.string().min(1),
  number: z.coerce.number().int().min(1, 'رقم النموذج مطلوب'),
  title: z.string().trim().max(100).optional(),
  orderIndex: orderIndex.optional(),
  isPublished: z.boolean().optional(),
});
export const updateQuestionnaireSchema = createQuestionnaireSchema.partial().omit({ levelId: true });

// المواضيع — topics
// أب واحد فقط: levelId (7-9) أو questionnaireId (10-12).
export const createTopicSchema = z
  .object({
    levelId: z.string().min(1).optional(),
    questionnaireId: z.string().min(1).optional(),
    nameAr,
    description: z.string().trim().max(500).optional(),
    orderIndex: orderIndex.optional(),
  })
  .refine((d) => (d.levelId ? 1 : 0) + (d.questionnaireId ? 1 : 0) === 1, {
    message: 'حدّد المستوى (levelId) أو الشالون (questionnaireId) — واحد فقط',
    path: ['levelId'],
  });
export const updateTopicSchema = z.object({
  nameAr: nameAr.optional(),
  description: z.string().trim().max(500).optional(),
  orderIndex: orderIndex.optional(),
});

// الدروس — lessons (metadata; video handled separately)
export const createLessonSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().trim().min(2, 'العنوان قصير جداً').max(150),
  description: z.string().trim().max(1000).optional(),
  durationMinutes: z.coerce.number().int().min(0).optional(),
  durationSeconds: z.coerce.number().int().min(0).optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  orderIndex: orderIndex.optional(),
  isPublished: z.boolean().optional(),
});
export const updateLessonSchema = createLessonSchema.partial().omit({ topicId: true });

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type CreateGradeInput = z.infer<typeof createGradeSchema>;
export type CreateLevelInput = z.infer<typeof createLevelSchema>;
export type CreateQuestionnaireInput = z.infer<typeof createQuestionnaireSchema>;
export type UpdateQuestionnaireInput = z.infer<typeof updateQuestionnaireSchema>;
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
// تقدّم المشاهدة — lesson watch progress
export const saveProgressSchema = z.object({
  watchTimeSeconds: z.coerce.number().int().min(0),
  completed: z.boolean().optional(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type SaveProgressInput = z.infer<typeof saveProgressSchema>;
