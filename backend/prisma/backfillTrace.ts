/**
 * Backfill لمسائل التتبّع (تتبّع استدعاء) على قاعدة بيانات موجودة.
 * seedCs يتخطّى المواضيع التي لها دروس، فلا يُحدّث المسائل القائمة — لذا نُحدّثها هنا.
 *
 * يقتصر على مسائل التتبّع (p.kind مضبوط): يضبط kind + السؤال + الحل المرجعي + الأخطاء الشائعة،
 * ويُدرِج مسائل التتبّع الجديدة (مثل درس تتبع العودية). آمن ومتكرِّر (idempotent).
 *
 * أولاً يضيف العمود kind إن لم يكن موجوداً (عبر عميل التشغيل — يعمل على الـ pooler).
 * تشغيل: cd backend && npx tsx prisma/backfillTrace.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { CS_PROBLEMS } from './csGenerators';

const prisma = new PrismaClient();

async function main() {
  // 1) تأكّد من وجود العمود kind (idempotent) — DDL مفردة تعمل على الـ pooler.
  await prisma.$executeRawUnsafe('ALTER TABLE "problems" ADD COLUMN IF NOT EXISTS "kind" TEXT');

  const cs = await prisma.subject.findFirst({ where: { nameAr: 'علوم الحاسوب' } });
  if (!cs) throw new Error('لم يُعثر على مادة «علوم الحاسوب» — شغّل seed أولاً.');

  let updated = 0;
  let created = 0;
  let skippedLessons = 0;

  for (const [key, gen] of Object.entries(CS_PROBLEMS)) {
    const [levelStr, topicName, orderStr] = key.split('|');
    const unitLevel = parseInt(levelStr, 10); // "3 وحدات" → 3
    const lessonOrder = parseInt(orderStr, 10);

    const level = await prisma.level.findFirst({ where: { subjectId: cs.id, unitLevel } });
    if (!level) {
      skippedLessons++;
      continue;
    }
    const topic = await prisma.topic.findFirst({ where: { levelId: level.id, nameAr: topicName } });
    if (!topic) {
      skippedLessons++;
      continue;
    }
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id, orderIndex: lessonOrder } });
    if (!lesson) {
      skippedLessons++;
      continue;
    }

    const problems = gen();
    for (const [idx, p] of problems.entries()) {
      if (!p.kind) continue; // نُحدّث مسائل التتبّع فقط، لا مسائل «اكتب كوداً»

      const existing = await prisma.problem.findFirst({ where: { lessonId: lesson.id, orderIndex: idx } });
      const mistakes = p.commonMistakes ?? [];
      if (existing) {
        await prisma.problem.update({
          where: { id: existing.id },
          data: {
            question: p.question,
            finalAnswer: p.referenceSolution,
            language: 'csharp',
            kind: p.kind,
            difficulty: p.difficulty,
            commonMistakes: { deleteMany: {}, create: mistakes },
          },
        });
        updated++;
      } else {
        await prisma.problem.create({
          data: {
            topicId: topic.id,
            lessonId: lesson.id,
            question: p.question,
            finalAnswer: p.referenceSolution,
            language: 'csharp',
            kind: p.kind,
            difficulty: p.difficulty,
            orderIndex: idx,
            allowFreeMethod: true,
            ...(mistakes.length > 0 ? { commonMistakes: { create: mistakes } } : {}),
          },
        });
        created++;
      }
    }
  }

  console.log(`✔ backfill تتبّع: حُدّثت ${updated} مسألة، أُنشئت ${created}, تخطّى ${skippedLessons} مفتاح درس غير موجود.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
