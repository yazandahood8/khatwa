import { prisma } from './prisma';
import { logger } from '../utils/logger';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * يسجّل طريقة جديدة اكتشفها الطالب — records a student-discovered method for admin review.
 * يُنشئ SolutionMethod بحالة (isApproved=false, discoveredByStudent) + إشعار للأدمن.
 * Idempotent: لا يكرّر إذا كان للطالب طريقة معلّقة لنفس المسألة.
 */
export async function recordDiscoveredMethod(
  studentId: string,
  problemId: string,
  messages: Turn[],
): Promise<void> {
  const existing = await prisma.solutionMethod.findFirst({
    where: { problemId, discoveredByStudent: studentId, isApproved: false },
    select: { id: true },
  });
  if (existing) return; // سبق تسجيلها

  // استخراج خطوات الطالب من المحادثة — extract the student's steps
  const stepExprs = messages
    .filter((m) => m.role === 'user' && m.content.startsWith('خطوتي:'))
    .map((m) => m.content.replace(/^خطوتي:\s*/, '').trim())
    .filter(Boolean);

  if (stepExprs.length === 0) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) stepExprs.push(lastUser.content.slice(0, 200));
  }
  if (stepExprs.length === 0) stepExprs.push('(طريقة من المحادثة)');

  const method = await prisma.solutionMethod.create({
    data: {
      problemId,
      name: 'طريقة جديدة من طالب (بانتظار المراجعة)',
      isRecommended: false,
      isApproved: false,
      discoveredByStudent: studentId,
      steps: {
        create: stepExprs.slice(0, 10).map((expr, i) => ({
          stepNumber: i + 1,
          description: 'خطوة الطالب',
          expression: expr.slice(0, 300),
          hint: '(طريقة مكتشفة — راجعها وعدّلها قبل الاعتماد)',
        })),
      },
    },
  });

  await prisma.adminNotification.create({
    data: { type: 'new_method', data: { problemId, methodId: method.id, studentId } },
  });

  logger.info(`🆕 New method discovered by ${studentId} on problem ${problemId} (${method.id})`);
}
