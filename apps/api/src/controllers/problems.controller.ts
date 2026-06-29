import type { Request, Response } from 'express';
import { createProblemSchema, updateProblemSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';

const ok = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({ success: true, data });

const fullInclude = {
  methods: { include: { steps: { orderBy: { stepNumber: 'asc' as const } } } },
  commonMistakes: true,
};

/** GET /api/problems?topicId=&lessonId= — قائمة مسائل الموضوع/الدرس (مع العدّادات). */
export async function listProblems(req: Request, res: Response) {
  const topicId = req.query.topicId as string | undefined;
  const lessonId = req.query.lessonId as string | undefined;
  const problems = await prisma.problem.findMany({
    where: {
      ...(topicId ? { topicId } : {}),
      ...(lessonId ? { lessonId } : {}),
    },
    orderBy: { orderIndex: 'asc' },
    include: { _count: { select: { methods: true, commonMistakes: true } } },
  });
  ok(res, problems);
}

/** GET /api/problems/:id — مسألة كاملة بكل الطرق والخطوات والأخطاء. */
export async function getProblem(req: Request, res: Response) {
  const problem = await prisma.problem.findUnique({
    where: { id: req.params.id },
    include: fullInclude,
  });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');
  ok(res, problem);
}

/** POST /api/problems — إنشاء مسألة كاملة (admin). */
export async function createProblem(req: Request, res: Response) {
  const input = createProblemSchema.parse(req.body);
  const problem = await prisma.problem.create({
    data: {
      topicId: input.topicId,
      code: input.code,
      question: input.question,
      finalAnswer: input.finalAnswer,
      answerTolerance: input.answerTolerance ?? 0,
      difficulty: input.difficulty,
      allowFreeMethod: input.allowFreeMethod ?? true,
      orderIndex: input.orderIndex ?? 0,
      methods: {
        create: input.methods.map((m) => ({
          name: m.name,
          isRecommended: m.isRecommended ?? false,
          isApproved: true,
          steps: {
            create: m.steps.map((s) => ({
              stepNumber: s.stepNumber,
              description: s.description,
              expression: s.expression,
              hint: s.hint,
            })),
          },
        })),
      },
      commonMistakes: { create: input.commonMistakes ?? [] },
    },
    include: fullInclude,
  });
  ok(res, problem, 201);
}

/** PUT /api/problems/:id — استبدال المسألة بالكامل (admin). */
export async function updateProblem(req: Request, res: Response) {
  const input = updateProblemSchema.parse(req.body);
  const id = req.params.id;

  const existing = await prisma.problem.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('المسألة غير موجودة');

  const problem = await prisma.$transaction(async (tx) => {
    // استبدال الأبناء — replace children (cascade deletes steps under methods)
    await tx.solutionMethod.deleteMany({ where: { problemId: id } });
    await tx.commonMistake.deleteMany({ where: { problemId: id } });

    return tx.problem.update({
      where: { id },
      data: {
        code: input.code,
        question: input.question,
        finalAnswer: input.finalAnswer,
        answerTolerance: input.answerTolerance ?? 0,
        difficulty: input.difficulty,
        allowFreeMethod: input.allowFreeMethod ?? true,
        orderIndex: input.orderIndex ?? 0,
        methods: {
          create: input.methods.map((m) => ({
            name: m.name,
            isRecommended: m.isRecommended ?? false,
            isApproved: true,
            steps: {
              create: m.steps.map((s) => ({
                stepNumber: s.stepNumber,
                description: s.description,
                expression: s.expression,
                hint: s.hint,
              })),
            },
          })),
        },
        commonMistakes: { create: input.commonMistakes ?? [] },
      },
      include: fullInclude,
    });
  });

  ok(res, problem);
}

/** DELETE /api/problems/:id — حذف مسألة (admin). */
export async function deleteProblem(req: Request, res: Response) {
  await prisma.problem.delete({ where: { id: req.params.id } });
  ok(res, { deleted: true });
}
