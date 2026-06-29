import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';
import { isAnswerCorrect } from '../utils/answerCheck';

const ok = <T>(res: Response, data: T) => res.json({ success: true, data });

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
