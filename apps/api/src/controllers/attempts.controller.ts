import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';
import { isAnswerCorrect } from '../utils/answerCheck';
import { runCSharp, normalizeOutput } from '../utils/runCsharp';

const ok = <T>(res: Response, data: T) => res.json({ success: true, data });

// الناتج الصحيح لكل مسألة (من تشغيل الحل المرجعي) — يُحسب مرة ويُخزَّن
const expectedCache = new Map<string, { expected: string; gradable: boolean }>();

async function getExpected(problemId: string, reference: string) {
  const cached = expectedCache.get(problemId);
  if (cached) return cached;
  let result = { expected: '', gradable: false };
  if (reference.trim()) {
    const ref = await runCSharp(reference);
    const expected = normalizeOutput(ref.output);
    result = { expected, gradable: ref.ok && expected.length > 0 };
  }
  expectedCache.set(problemId, result);
  return result;
}

const checkSchema = z.object({
  answer: z.string().min(1, 'الإجابة مطلوبة'),
  steps: z.array(z.string()).optional(),
  methodUsed: z.string().optional(),
});

/** POST /api/problems/:id/check — يتحقق من الإجابة النهائية ويسجّل المحاولة. */
export async function checkAnswer(req: Request, res: Response) {
  const input = checkSchema.parse(req.body);
  const studentId = req.user!.id;
  const problemId = req.params.id;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');

  const correct = isAnswerCorrect(input.answer, problem.finalAnswer, problem.answerTolerance);

  const existing = await prisma.problemAttempt.findFirst({ where: { studentId, problemId } });
  const attempt = existing
    ? await prisma.problemAttempt.update({
        where: { id: existing.id },
        data: {
          attemptsCount: existing.attemptsCount + 1,
          methodUsed: input.methodUsed ?? existing.methodUsed,
          stepsTaken: input.steps ?? existing.stepsTaken ?? undefined,
          isCorrect: existing.isCorrect || correct,
          completedAt: existing.completedAt ?? (correct ? new Date() : null),
        },
      })
    : await prisma.problemAttempt.create({
        data: {
          studentId,
          problemId,
          attemptsCount: 1,
          methodUsed: input.methodUsed,
          stepsTaken: input.steps ?? undefined,
          isCorrect: correct,
          completedAt: correct ? new Date() : null,
        },
      });

  ok(res, { correct, attemptsCount: attempt.attemptsCount, completed: Boolean(attempt.completedAt) });
}

const runSchema = z.object({ code: z.string().min(1, 'الكود مطلوب') });

/**
 * POST /api/problems/:id/run — يشغّل كود C# ويقارن ناتجه بناتج الحل المرجعي.
 * عند التطابق: نجاح (يُسجَّل الحل). مسائل بلا ناتج مرجعي غير قابلة للتقييم بالناتج.
 */
export async function runCode(req: Request, res: Response) {
  const { code } = runSchema.parse(req.body);
  const studentId = req.user!.id;
  const problemId = req.params.id;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');

  const student = await runCSharp(code);

  // خطأ ترجمة/تشغيل — لا تقييم
  if (!student.ok) {
    return ok(res, { ok: false, output: student.output, match: false, gradable: true });
  }

  const { expected, gradable } = await getExpected(problemId, problem.finalAnswer ?? '');
  const match = gradable && normalizeOutput(student.output) === expected;

  let attemptsCount: number | undefined;
  let completed = false;
  if (gradable) {
    const existing = await prisma.problemAttempt.findFirst({ where: { studentId, problemId } });
    const attempt = existing
      ? await prisma.problemAttempt.update({
          where: { id: existing.id },
          data: {
            attemptsCount: existing.attemptsCount + 1,
            isCorrect: existing.isCorrect || match,
            completedAt: existing.completedAt ?? (match ? new Date() : null),
            methodUsed: 'run',
          },
        })
      : await prisma.problemAttempt.create({
          data: {
            studentId,
            problemId,
            attemptsCount: 1,
            isCorrect: match,
            completedAt: match ? new Date() : null,
            methodUsed: 'run',
          },
        });
    attemptsCount = attempt.attemptsCount;
    completed = Boolean(attempt.completedAt);
  }

  ok(res, {
    ok: true,
    output: student.output,
    note: student.note,
    match,
    gradable,
    attemptsCount,
    completed,
  });
}

/** GET /api/problems/:id/attempt — محاولة الطالب الحالية لهذه المسألة. */
export async function getAttempt(req: Request, res: Response) {
  const attempt = await prisma.problemAttempt.findFirst({
    where: { studentId: req.user!.id, problemId: req.params.id },
    select: { attemptsCount: true, isCorrect: true, completedAt: true, stepsTaken: true },
  });
  ok(res, attempt);
}

/** GET /api/topics/:topicId/progress — حالة إنجاز الطالب لكل مسائل الموضوع (للتنقل). */
export async function getTopicProgress(req: Request, res: Response) {
  const attempts = await prisma.problemAttempt.findMany({
    where: { studentId: req.user!.id, problem: { topicId: req.params.topicId } },
    select: { problemId: true, isCorrect: true, completedAt: true, attemptsCount: true },
  });
  ok(res, attempts);
}
