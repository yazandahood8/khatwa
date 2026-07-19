/**
 * تعبئة ملخّصات الدروس من prisma/generatedLessonSummaries.json — backfill Lesson.summary.
 *
 * يمرّ على الدروس، وإذا كان ملخّصها فارغاً يطابقه بمعرّف الدرس ويحدّث العمود في مكانه فقط —
 * فلا يمسّ أيّ بيانات أخرى. آمن للتكرار (idempotent). مع --force يستبدل الملخّصات الموجودة.
 *
 * تشغيل (dev):   npm --workspace apps/api run summaries:backfill
 * تشغيل (prod):  DATABASE_URL="<رابط Supabase المباشر>" npm --workspace apps/api run summaries:backfill
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SUMMARIES_PATH = join(__dirname, 'generatedLessonSummaries.json');

async function main() {
  if (!existsSync(SUMMARIES_PATH)) {
    console.error('❌ generatedLessonSummaries.json غير موجود — شغّل summaries:generate أولاً.');
    process.exit(1);
  }
  const force = process.argv.includes('--force'); // يستبدل ملخّصات موجودة
  const summaries: Record<string, string> = JSON.parse(readFileSync(SUMMARIES_PATH, 'utf8'));
  console.log(`📖 ملخّصات محمّلة: ${Object.keys(summaries).length}${force ? ' — وضع --force (استبدال فوق الموجود)' : ''}`);

  const lessons = await prisma.lesson.findMany({ select: { id: true, summary: true } });

  let updated = 0;
  let hadSummary = 0;
  let noKey = 0;

  for (const l of lessons) {
    const summary = summaries[l.id];
    if (!summary) {
      noKey++;
      continue;
    }
    if (!force && l.summary?.trim()) {
      hadSummary++;
      continue; // ملخّص موجود مسبقاً — لا نلمسه (إلا مع --force)
    }
    if (l.summary?.trim() === summary.trim()) {
      hadSummary++;
      continue; // لا تغيير
    }
    await prisma.lesson.update({ where: { id: l.id }, data: { summary } });
    updated++;
  }

  console.log(
    `✔ تعبئة ملخّصات الدروس: ${updated} محدّثة | ${hadSummary} لديها ملخّص مسبقاً | ${noKey} بلا ملخّص مولّد.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
