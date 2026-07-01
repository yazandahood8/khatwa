import { z } from 'zod';
import { UserRole } from './enums';

/**
 * مخططات التحقق المشتركة — shared Zod validation schemas.
 * تُستخدم على الواجهة (قبل الإرسال) وعلى الخادم (قبل المعالجة).
 */

// المستويات المسموحة — allowed unit levels
export const LEVELS = ['3יח׳', '4יח׳', '5יח׳'] as const;

const emailField = z.string().trim().toLowerCase().email('بريد إلكتروني غير صالح');
const passwordField = z
  .string()
  .min(8, 'كلمة السر يجب أن تكون 8 أحرف على الأقل')
  .max(72, 'كلمة السر طويلة جداً');
const nameField = z.string().trim().min(2, 'الاسم قصير جداً').max(60, 'الاسم طويل جداً');
const gradeField = z.coerce.number().int().min(7, 'الصف من 7 إلى 12').max(12, 'الصف من 7 إلى 12');

/** التسجيل — registration (student or parent only; admin is seeded manually) */
export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    role: z.enum([UserRole.STUDENT, UserRole.PARENT]).default(UserRole.STUDENT),
    grade: gradeField.optional(),
    level: z.enum(LEVELS).optional(),
  })
  // الطالب: صف (7-9) أو وحدات ثانوية (10-12 → level).
  .refine(
    (d) => (d.role === UserRole.STUDENT ? d.grade !== undefined || d.level !== undefined : true),
    { message: 'اختر الصف (7-9) أو الوحدات (ثانوي)', path: ['grade'] },
  );

/** تسجيل الدخول — login */
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'كلمة السر مطلوبة'),
});

/** تحديث الملف الشخصي — profile update */
export const updateProfileSchema = z.object({
  name: nameField.optional(),
  grade: gradeField.optional(),
  level: z.enum(LEVELS).optional(),
  avatarUrl: z.string().url().optional(),
});

/** تغيير كلمة السر — change password */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة السر الحالية مطلوبة'),
  newPassword: passwordField,
});

/** ربط ولي الأمر بالطالب — parent links a student by email */
export const linkStudentSchema = z.object({
  studentEmail: emailField,
});

/** نسيت كلمة السر — request reset */
export const forgotPasswordSchema = z.object({ email: emailField });

/** إعادة تعيين كلمة السر — reset with token */
export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'رمز غير صالح'),
  newPassword: passwordField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LinkStudentInput = z.infer<typeof linkStudentSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
