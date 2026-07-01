import type { Request, Response } from 'express';
import type Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { claude, CLAUDE_MODEL, isAiConfigured, estimateCostUsd } from '../services/claude';
import { consumeQuota, getQuota, refundQuota } from '../services/aiRateLimit';
import { recordDiscoveredMethod } from '../services/newMethod';
import { matchStep } from '../services/stepMatch';
import { buildTutorSystemPrompt, buildCodeJudgePrompt, buildCodeHintPrompt } from '../utils/aiPrompt';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

const askSchema = z.object({
  message: z.string().trim().min(1, 'الرسالة مطلوبة').max(2000),
  attemptsCount: z.coerce.number().int().min(0).default(0),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(2000) }))
    .max(20)
    .optional(),
  // صورة مسودة الطالب (base64 PNG) — optional handwritten draft image
  image: z.string().max(4_000_000).optional(),
});

const judgeSchema = z.object({
  code: z.string().max(10_000).default(''),
  hint: z.boolean().default(false), // طلب تلميح بدل تقييم
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(20)
    .optional(),
});

/**
 * اشتقاق سياق المادة/الصف/المستوى من الموضوع — يدعم مسارَي التسلسل:
 * 7-9 عبر level→grade، و10-12 عبر questionnaire→level (بلا صف).
 */
function deriveTopicContext(topic: {
  level: {
    name: string;
    grade: { gradeNumber: number; subject: { nameAr: string } } | null;
    subject: { nameAr: string } | null;
  } | null;
  questionnaire: {
    number: number;
    level: { name: string; subject: { nameAr: string } | null };
  } | null;
}): { subject: string; grade: number | null; level: string | null } {
  if (topic.questionnaire) {
    return {
      subject: topic.questionnaire.level.subject?.nameAr ?? 'رياضيات',
      grade: null,
      level: `${topic.questionnaire.level.name} · שאלון ${topic.questionnaire.number}`,
    };
  }
  const lvl = topic.level;
  return {
    subject: lvl?.grade?.subject.nameAr ?? lvl?.subject?.nameAr ?? 'رياضيات',
    grade: lvl?.grade?.gradeNumber ?? null,
    level: lvl?.name ?? null,
  };
}

/** GET /api/ai/quota — كم سؤال بقي للطالب اليوم. */
export async function aiQuota(req: Request, res: Response) {
  const quota = await getQuota(req.user!.id, req.user!.role);
  res.json({ success: true, data: { ...quota, configured: isAiConfigured() } });
}

/** POST /api/problems/:id/ai — رد المعلم السقراطي (بثّ مباشر). */
export async function askTutor(req: Request, res: Response) {
  if (!isAiConfigured() || !claude) {
    throw ApiError.internal('المساعد الذكي غير مهيأ بعد (ANTHROPIC_API_KEY مفقود)');
  }
  const input = askSchema.parse(req.body);
  const studentId = req.user!.id;
  const problemId = req.params.id;

  // المسألة الكاملة مع سياق التسلسل الهرمي
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      methods: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
      commonMistakes: true,
      topic: {
        include: {
          level: { include: { grade: { include: { subject: true } }, subject: true } },
          questionnaire: { include: { level: { include: { subject: true } } } },
        },
      },
    },
  });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');

  // الطبقة الأولى الحتمية — deterministic fast-path: exact match against stored steps/mistakes
  // يرد فوراً بلا Claude وبلا احتساب من الحصة (لمسائل الرياضيات وخطوات الطالب فقط).
  if (!problem.language && !input.image && input.message.startsWith('خطوتي:')) {
    const det = matchStep(
      input.message.replace(/^خطوتي:\s*/, ''),
      problem.methods
        .filter((m) => m.isApproved)
        .map((m) => ({
          name: m.name,
          steps: m.steps.map((s) => ({ stepNumber: s.stepNumber, expression: s.expression, hint: s.hint })),
        })),
      problem.commonMistakes.map((c) => ({ wrongExample: c.wrongExample, correction: c.correction })),
    );
    if (det) {
      const q = await getQuota(studentId, req.user!.role);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-AI-Remaining', String(q.remaining));
      res.flushHeaders?.();
      res.end(det.reply);
      await prisma.aiSession
        .create({
          data: {
            studentId,
            problemId,
            messages: [
              ...(input.history ?? []),
              { role: 'user', content: input.message },
              { role: 'assistant', content: det.reply },
            ],
            tokensUsed: 0,
          },
        })
        .catch((e) => logger.error('aiSession persist failed', e instanceof Error ? e.message : e));
      logger.info(`AI tutor: deterministic ${det.kind} match (0 tok, no Claude)`);
      return;
    }
  }

  // تحديد المعدل حسب الباقة — rate limit by plan (throws RATE_LIMITED)
  let quota;
  try {
    quota = await consumeQuota(studentId, req.user!.role);
  } catch (e) {
    if ((e as { code?: string }).code === 'RATE_LIMITED') {
      res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'خلصت أسئلتك لليوم. جرّب بكرة أو رقّي باقتك 🙂' },
      });
      return;
    }
    throw e;
  }

  const tctx = deriveTopicContext(problem.topic);
  const systemPrompt = buildTutorSystemPrompt({
    subject: tctx.subject,
    grade: tctx.grade,
    level: tctx.level,
    topic: problem.topic.nameAr,
    question: problem.question,
    finalAnswer: problem.finalAnswer,
    methods: problem.methods.map((m) => ({
      name: m.name,
      isRecommended: m.isRecommended,
      steps: m.steps.map((s) => ({
        stepNumber: s.stepNumber,
        description: s.description,
        expression: s.expression,
        hint: s.hint,
      })),
    })),
    commonMistakes: problem.commonMistakes.map((c) => ({
      description: c.description,
      wrongExample: c.wrongExample,
      correction: c.correction,
    })),
    attemptsCount: input.attemptsCount,
  });

  // الدور الحالي: نص فقط أو نص + صورة المسودة — current turn: text, or image + text
  const currentContent = input.image
    ? [
        {
          type: 'image' as const,
          source: { type: 'base64' as const, media_type: 'image/png' as const, data: input.image },
        },
        { type: 'text' as const, text: input.message },
      ]
    : input.message;

  const messages: Anthropic.MessageParam[] = [
    ...(input.history ?? []),
    { role: 'user', content: currentContent },
  ];

  // بثّ الرد — stream the response as plain text chunks
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-AI-Remaining', String(quota.remaining));
  res.flushHeaders?.();

  let full = '';
  try {
    const stream = claude.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages,
    });
    stream.on('text', (t) => {
      full += t;
      res.write(t);
    });
    const finalMsg = await stream.finalMessage();
    res.end();

    // كشف الطرق الجديدة + اكتمال الحل — detect new method + full solve
    const isNewMethod = /\[NEW_METHOD\]/.test(full);
    const isSolved = /\[SOLVED\]/.test(full);
    const cleanFull = full.replace(/\[(NEW_METHOD|SOLVED)\]/g, '').trimEnd();

    // حفظ الجلسة + التكلفة — persist session + token usage
    const inTok = finalMsg.usage.input_tokens;
    const outTok = finalMsg.usage.output_tokens;
    // لا نخزّن الصورة في قاعدة البيانات — keep base64 out of the DB
    const savedMessages = [
      ...messages.map((m) => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : `[مسودة مرفقة] ${input.message}`,
      })),
      { role: 'assistant', content: cleanFull },
    ];
    await prisma.aiSession.create({
      data: { studentId, problemId, messages: savedMessages, tokensUsed: inTok + outTok },
    });

    if (isNewMethod) {
      const textTurns = messages
        .filter((m): m is { role: 'user' | 'assistant'; content: string } => typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: m.content }));
      await recordDiscoveredMethod(studentId, problemId, textTurns).catch((e) =>
        logger.error('recordDiscoveredMethod failed', e instanceof Error ? e.message : e),
      );
    }

    if (isSolved) {
      // المساعد أكّد اكتمال الحل — سجّل المسألة كمحلولة
      const stepsTaken = messages
        .filter(
          (m): m is { role: 'user'; content: string } =>
            m.role === 'user' && typeof m.content === 'string' && m.content.startsWith('خطوتي:'),
        )
        .map((m) => m.content.replace(/^خطوتي:\s*/, '').trim());
      const existing = await prisma.problemAttempt.findFirst({ where: { studentId, problemId } });
      if (existing) {
        await prisma.problemAttempt.update({
          where: { id: existing.id },
          data: { isCorrect: true, completedAt: existing.completedAt ?? new Date() },
        });
      } else {
        await prisma.problemAttempt.create({
          data: {
            studentId,
            problemId,
            isCorrect: true,
            attemptsCount: 1,
            completedAt: new Date(),
            stepsTaken: stepsTaken.length ? stepsTaken : undefined,
            methodUsed: 'AI-guided',
          },
        });
      }
    }
    logger.info(
      `AI tutor: ${inTok}+${outTok} tok ($${estimateCostUsd(CLAUDE_MODEL, inTok, outTok).toFixed(5)})`,
    );
  } catch (err) {
    logger.error('AI stream error', err instanceof Error ? err.message : err);
    if (!full) await refundQuota(studentId); // لم يصل أي رد — لا تحتسب السؤال
    if (!res.headersSent) {
      res.status(502).json({ success: false, error: { code: 'AI_ERROR', message: 'تعذّر الاتصال بالمساعد' } });
    } else {
      res.end('\n\n(عذراً، صار خطأ. حاول مرة ثانية)');
    }
  }
}

/** POST /api/problems/:id/judge — مصحّح كود علوم الحاسوب (بثّ مباشر). */
export async function judgeCode(req: Request, res: Response) {
  if (!isAiConfigured() || !claude) {
    throw ApiError.internal('المساعد الذكي غير مهيأ بعد (ANTHROPIC_API_KEY مفقود)');
  }
  const input = judgeSchema.parse(req.body);
  const studentId = req.user!.id;
  const problemId = req.params.id;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      topic: {
        include: {
          level: { include: { grade: { include: { subject: true } }, subject: true } },
          questionnaire: { include: { level: { include: { subject: true } } } },
        },
      },
    },
  });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');
  if (!problem.language) {
    throw ApiError.badRequest('هذه ليست مسألة برمجة — استخدم المساعد التعليمي العادي');
  }
  if (!input.hint && !input.code.trim()) {
    throw ApiError.badRequest('اكتب كودك أولاً');
  }

  // تحديد المعدل حسب الباقة — rate limit by plan
  let quota;
  try {
    quota = await consumeQuota(studentId, req.user!.role);
  } catch (e) {
    if ((e as { code?: string }).code === 'RATE_LIMITED') {
      res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'خلصت أسئلتك لليوم. جرّب بكرة أو رقّي باقتك 🙂' },
      });
      return;
    }
    throw e;
  }

  const ctx = {
    subject: deriveTopicContext(problem.topic).subject,
    topic: problem.topic.nameAr,
    question: problem.question,
    language: problem.language,
    starterCode: problem.starterCode,
    referenceSolution: problem.finalAnswer,
  };
  const systemPrompt = input.hint ? buildCodeHintPrompt(ctx) : buildCodeJudgePrompt(ctx);

  const userContent = input.hint
    ? input.code.trim()
      ? `كود الطالب الحالي (قد يكون ناقصاً):\n\n${input.code}\n\n(يطلب تلميحاً)`
      : 'الطالب لم يكتب كوداً بعد ويطلب تلميحاً للبداية.'
    : `كود الطالب:\n\n${input.code}`;

  const messages: Anthropic.MessageParam[] = [
    ...(input.history ?? []),
    { role: 'user', content: userContent },
  ];

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-AI-Remaining', String(quota.remaining));
  res.flushHeaders?.();

  let full = '';
  try {
    const stream = claude.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system: systemPrompt,
      messages,
    });
    stream.on('text', (t) => {
      full += t;
      res.write(t);
    });
    const finalMsg = await stream.finalMessage();
    res.end();

    const cleanFull = full.replace(/\[(CORRECT|PARTIAL|INCORRECT)\]/g, '').trimEnd();
    const inTok = finalMsg.usage.input_tokens;
    const outTok = finalMsg.usage.output_tokens;
    await prisma.aiSession.create({
      data: {
        studentId,
        problemId,
        messages: [...messages.map((m) => ({ role: m.role, content: String(m.content) })), { role: 'assistant', content: cleanFull }],
        tokensUsed: inTok + outTok,
      },
    });

    if (input.hint) {
      // تلميح فقط — لا تقييم ولا تسجيل محاولة
      logger.info(`AI hint: ${inTok}+${outTok} tok ($${estimateCostUsd(CLAUDE_MODEL, inTok, outTok).toFixed(5)})`);
    } else {
      const verdict = /\[CORRECT\]/.test(full) ? 'correct' : /\[PARTIAL\]/.test(full) ? 'partial' : 'incorrect';
      // تسجيل المحاولة — record attempt (solved only when fully correct)
      const existing = await prisma.problemAttempt.findFirst({ where: { studentId, problemId } });
      if (existing) {
        await prisma.problemAttempt.update({
          where: { id: existing.id },
          data: {
            attemptsCount: existing.attemptsCount + 1,
            isCorrect: existing.isCorrect || verdict === 'correct',
            completedAt: verdict === 'correct' ? (existing.completedAt ?? new Date()) : existing.completedAt,
            methodUsed: 'AI-judge',
          },
        });
      } else {
        await prisma.problemAttempt.create({
          data: {
            studentId,
            problemId,
            attemptsCount: 1,
            isCorrect: verdict === 'correct',
            completedAt: verdict === 'correct' ? new Date() : null,
            methodUsed: 'AI-judge',
          },
        });
      }
      logger.info(
        `AI judge (${verdict}): ${inTok}+${outTok} tok ($${estimateCostUsd(CLAUDE_MODEL, inTok, outTok).toFixed(5)})`,
      );
    }
  } catch (err) {
    logger.error('AI judge error', err instanceof Error ? err.message : err);
    if (!full) await refundQuota(studentId);
    if (!res.headersSent) {
      res.status(502).json({ success: false, error: { code: 'AI_ERROR', message: 'تعذّر الاتصال بالمصحّح' } });
    } else {
      res.end('\n\n(عذراً، صار خطأ. حاول مرة ثانية)');
    }
  }
}
