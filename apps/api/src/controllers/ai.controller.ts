import type { Request, Response } from 'express';
import type Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { prisma } from '../services/prisma';
import { claude, CLAUDE_MODEL, isAiConfigured, estimateCostUsd } from '../services/claude';
import { consumeQuota, getQuota, refundQuota } from '../services/aiRateLimit';
import { recordDiscoveredMethod } from '../services/newMethod';
import { buildTutorSystemPrompt } from '../utils/aiPrompt';
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
      topic: { include: { level: { include: { grade: { include: { subject: true } } } } } },
    },
  });
  if (!problem) throw ApiError.notFound('المسألة غير موجودة');

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

  const systemPrompt = buildTutorSystemPrompt({
    subject: problem.topic.level.grade.subject.nameAr,
    grade: problem.topic.level.grade.gradeNumber,
    level: problem.topic.level.name,
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
