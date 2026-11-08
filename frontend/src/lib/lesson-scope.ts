import { UserRole, type PublicUser } from '@khatwa/shared';

/**
 * نطاق المحتوى الذي يراه المستخدم في صفحة الدروس:
 * - طالب صف 7-9: صفه فقط (بلا مسارات الثانوي).
 * - طالب ثانوي (صف 10-12 أو مسار وحدات): مسارات الوحدات فقط، ومساره وحده إن اختاره.
 * - غير ذلك (ولي أمر/مدير/طالب بلا صف): كل المحتوى.
 */
export function lessonScope(user: PublicUser | null) {
  const student = user?.role === UserRole.STUDENT;
  const grade = student ? (user?.grade ?? null) : null;
  const level = student ? (user?.level ?? null) : null;
  const restricted = student && (grade != null || level != null);
  const highSchool = level != null || (grade != null && grade >= 10);

  return {
    gradeVisible: (n: number) => !restricted || (!highSchool && n === grade),
    tracksVisible: !restricted || highSchool,
    /** label مثل "4 وحدات" — يُطابَق مع مسار الطالب إن وُجد. */
    trackVisible: (label: string) => !level || label === level,
  };
}
