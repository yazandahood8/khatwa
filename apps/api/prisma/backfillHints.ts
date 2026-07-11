/**
 * تعبئة تلميحات البداية على المسائل الموجودة مسبقاً في قاعدة البيانات دون إعادة زرع مُدمِّرة
 * — backfill first-step SolutionStep.hint from prisma/generatedHints.json.
 *
 * يمرّ على مسائل الرياضيات (language = null)، يأخذ الخطوة الأولى من الطريقة الموصى بها،
 * وإذا كان تلميحها فارغاً يطابقه بالمفتاح الثابت (hintKey) ويحدّث العمود في مكانه فقط —
 * فلا يمسّ محاولات الطلاب ولا جلساتهم (بعكس إعادة الزرع). آمن للتكرار (idempotent).
 *
 * تشغيل (dev):   npm --workspace apps/api run hints:backfill
 * تشغيل (prod):  DATABASE_URL="<رابط Supabase المباشر>" npm --workspace apps/api run hints:backfill
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { hintKey } from './hintKey';

const prisma = new PrismaClient();
const HINTS_PATH = join(__dirname, 'generatedHints.json');

async function main() {
  if (!existsSync(HINTS_PATH)) {
    console.error('❌ generatedHints.json غير موجود — شغّل hints:generate أولاً.');
    process.exit(1);
  }
  const force = process.argv.includes('--force'); // يستبدل تلميحات موجودة (بعد إعادة توليد محسّنة)
  const hints: Record<string, string> = JSON.parse(readFileSync(HINTS_PATH, 'utf8'));
  console.log(`📖 تلميحات محمّلة: ${Object.keys(hints).length}${force ? ' — وضع --force (استبدال فوق الموجود)' : ''}`);

  const problems = await prisma.problem.findMany({
    where: { language: null }, // رياضيات فقط
    include: { methods: { include: { steps: { orderBy: { stepNumber: 'asc' } } } } },
  });

  let updated = 0;
  let hadHint = 0;
  let noKey = 0;
  let noStep = 0;

  for (const p of problems) {
    const approved = p.methods.filter((m) => m.isApproved);
    const method = approved.find((m) => m.isRecommended) ?? approved[0];
    const step = method?.steps[0];
    if (!step) {
      noStep++;
      continue;
    }
    const key = hintKey(p.question, step.description, step.expression);
    const hint = hints[key];
    if (!hint) {
      noKey++;
      continue;
    }
    if (!force && step.hint.trim()) {
      hadHint++;
      continue; // تلميح موجود مسبقاً — لا نلمسه (إلا مع --force)
    }
    if (step.hint.trim() === hint.trim()) {
      hadHint++;
      continue; // لا تغيير
    }
    await prisma.solutionStep.update({ where: { id: step.id }, data: { hint } });
    updated++;
  }

  console.log(
    `✔ تعبئة تلميحات البداية: ${updated} محدّثة | ${hadHint} لديها تلميح مسبقاً | ` +
      `${noKey} بلا تلميح مولّد | ${noStep} بلا خطوة.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
