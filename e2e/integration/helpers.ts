import supertest from 'supertest';
import { UserRole } from '@khatwa/shared';
import { createApp } from '../../backend/src/app';
import { prisma } from '../../backend/src/services/prisma';
import { redis } from '../../backend/src/services/redis';
import { hashPassword } from '../../backend/src/utils/password';
import { signToken } from '../../backend/src/utils/jwt';

/**
 * أدوات مشتركة للاختبارات التكاملية — shared helpers.
 * تبني تطبيق Express حقيقياً وتزرع بيانات عبر Prisma على قاعدة الاختبار.
 */

/** عميل HTTP على التطبيق الحقيقي — supertest client bound to the real app (in-process, no port). */
export const app = createApp();
export const api = () => supertest(app);

/** ترويسة المصادقة — Bearer header for an authed request. */
export const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

/**
 * يمسح كاش الكتالوج (Redis) — bust the read-through catalog cache within a single test.
 * لازم فقط عند نمط: اقرأ ثم عدّل ثم اقرأ (وإلا يخدم الكاش نتيجة قديمة لـ 60 ثانية).
 * التفريغ بين الاختبارات يتكفّل بالعزل؛ هذه لِلحالات داخل الاختبار الواحد.
 */
export async function flushCache() {
  if (redis) await redis.flushdb();
}

let ipCounter = 0;
/**
 * عنوان IP فريد لكل نداء — a fresh client IP per call (via X-Forwarded-For).
 * محدِّد معدل المصادقة يعمل بالذاكرة ويُفتّت حسب IP؛ عنوان جديد ⇒ دلو نظيف،
 * فلا تتداخل اختبارات المصادقة. للتحقق من الحدّ نفسه: ثبّت عنواناً واحداً.
 * (يعمل لأن app.set('trust proxy', 1).)
 */
export const freshIp = () => `10.1.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

let emailCounter = 0;

export interface SeededUser {
  id: string;
  email: string;
  role: UserRole;
  token: string;
}

/**
 * يزرع مستخدماً ويعيد توكن JWT موقّعاً — create a user + return a signed token.
 * الافتراضي طالب. لطالب باشتراك: مرّر plan (+ endsAt اختياري).
 */
export async function seedUser(opts: {
  role?: UserRole;
  email?: string;
  password?: string;
  name?: string;
  grade?: number;
  level?: string;
  plan?: 'free' | 'basic' | 'premium';
  planStatus?: 'active' | 'canceled' | 'expired' | 'pending';
  planEndsAt?: Date | null;
} = {}): Promise<SeededUser> {
  const role = opts.role ?? UserRole.STUDENT;
  const email = opts.email ?? `user${++emailCounter}@test.khatwa`;
  const password = opts.password ?? 'password123';

  const user = await prisma.user.create({
    data: {
      name: opts.name ?? 'Test User',
      email,
      passwordHash: await hashPassword(password),
      role: role as never,
      grade: opts.grade ?? null,
      level: opts.level ?? null,
      ...(opts.plan
        ? {
            subscriptions: {
              create: {
                plan: opts.plan as never,
                status: (opts.planStatus ?? 'active') as never,
                endsAt: opts.planEndsAt ?? null,
              },
            },
          }
        : {}),
    },
  });

  const token = signToken({ sub: user.id, role: user.role as UserRole });
  return { id: user.id, email, role: role, token };
}

/** يزرع مادة — create a subject (smallest content unit). */
export function seedSubject(over: Partial<{ nameAr: string; isActive: boolean; orderIndex: number }> = {}) {
  return prisma.subject.create({
    data: {
      nameAr: over.nameAr ?? 'رياضيات',
      isActive: over.isActive ?? true,
      orderIndex: over.orderIndex ?? 0,
    },
  });
}

/**
 * يزرع شجرة محتوى كاملة — subject → grade → level → topic → lesson → problem.
 * يعيد المعرّفات كي تختبر مسارات القراءة/الحل. مرّر over لضبط الدرس/المسألة.
 */
export async function seedContentTree(
  over: {
    lesson?: Partial<{ title: string; isPublished: boolean }>;
    problem?: Partial<{ question: string; finalAnswer: string; answerTolerance: number; code: string }>;
  } = {},
) {
  const subject = await prisma.subject.create({ data: { nameAr: 'رياضيات' } });
  const grade = await prisma.grade.create({
    data: { gradeNumber: 7, subjectId: subject.id },
  });
  const level = await prisma.level.create({ data: { name: 'موحّد', gradeId: grade.id } });
  const topic = await prisma.topic.create({ data: { nameAr: 'المعادلات', levelId: level.id } });
  const lesson = await prisma.lesson.create({
    data: {
      title: over.lesson?.title ?? 'مقدمة في المعادلات',
      topicId: topic.id,
      isPublished: over.lesson?.isPublished ?? true,
    },
  });
  const problem = await prisma.problem.create({
    data: {
      question: over.problem?.question ?? 'حل: x + 3 = 5',
      finalAnswer: over.problem?.finalAnswer ?? '2',
      answerTolerance: over.problem?.answerTolerance ?? 0,
      topicId: topic.id,
      lessonId: lesson.id,
      code: over.problem?.code ?? null,
    },
  });

  return { subject, grade, level, topic, lesson, problem };
}
