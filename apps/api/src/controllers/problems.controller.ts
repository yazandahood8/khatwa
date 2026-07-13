import type { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';
import { createProblemSchema, updateProblemSchema } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { ApiError } from '../utils/ApiError';

// حقول التخصّص المشتركة (إنجليزي/برمجة) — تُكتب كما هي، مع choices كـ JSON.
const specializationData = (input: {
  language?: string;
  kind?: string;
  passage?: string;
  starterCode?: string;
  choices?: { text: string }[];
  hintWords?: { en: string; ar: string }[];
}) => ({
  language: input.language ?? null,
  kind: input.kind ?? null,
  passage: input.passage ?? null,
  starterCode: input.starterCode ?? null,
  choices: (input.choices ?? undefined) as Prisma.InputJsonValue | undefined,
  hintWords: (input.hintWords ?? undefined) as Prisma.InputJsonValue | undefined,
});

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
  // الأدمن يرى الجواب؛ الطالب لا — never ship final answers to students.
  if (req.user?.role === 'admin') {
    ok(res, problems);
    return;
  }
  ok(res, problems.map(({ finalAnswer: _omit, ...rest }) => rest));
}

/**
 * GET /api/problems/:id — تفاصيل المسألة.
 * الأدمن: المسألة كاملة (الجواب + الطرق بخطواتها + الأخطاء) للتحرير.
 * الطالب: بدون الجواب النهائي ولا خطوات الحل ولا الأخطاء — حتى لا يُكشف الحلّ (المساعد السقراطي يوجّه فقط).
 */
export async function getProblem(req: Request, res: Response) {
  const isAdmin = req.user?.role === 'admin';
  const problem = await prisma.problem.findUnique({
    where: { id: req.params.id },
    // للطالب: أسماء الطرق فقط (لتسمية المحاولة) دون الخطوات السرّية.
    include: isAdmin ? fullInclude : { methods: { select: { name: true, isRecommended: true } } },
  });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');
  if (isAdmin) {
    ok(res, problem);
    return;
  }
  // إزالة الجواب النهائي من الحمولة — التحقق يتم في الخادم عبر /check.
  const { finalAnswer: _omit, ...safe } = problem;
  ok(res, safe);
}

/**
 * GET /api/problems/by-code/:code — ترجمة كود المسألة (الباركود) إلى معرّفها.
 * تُستخدم في مسح الباركود من الورقة المطبوعة: الكود الثابت → id للتوجيه لصفحة الحل.
 */
export async function getProblemByCode(req: Request, res: Response) {
  const problem = await prisma.problem.findUnique({
    where: { code: req.params.code },
    select: { id: true, language: true },
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
      ...specializationData(input),
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
        ...specializationData(input),
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
