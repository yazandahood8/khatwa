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

// المستويات (יחידות) — levels
export const createLevelSchema = z.object({
  gradeId: z.string().min(1),
  name: z.string().trim().min(1, 'اسم المستوى مطلوب').max(40),
});

// المواضيع — topics
export const createTopicSchema = z.object({
  levelId: z.string().min(1),
  nameAr,
  description: z.string().trim().max(500).optional(),
  orderIndex: orderIndex.optional(),
});
export const updateTopicSchema = createTopicSchema.partial().omit({ levelId: true });

// الدروس — lessons (metadata; video handled separately)
export const createLessonSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().trim().min(2, 'العنوان قصير جداً').max(150),
  description: z.string().trim().max(1000).optional(),
  durationMinutes: z.coerce.number().int().min(0).optional(),
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
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
