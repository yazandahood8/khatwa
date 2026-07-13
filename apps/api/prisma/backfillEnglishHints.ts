/**
 * تعبئة كلمات التلميح (hintWords) على مسائل الإنجليزية الموجودة مسبقاً في قاعدة البيانات
 * دون إعادة زرع مُدمِّرة — backfill Problem.hintWords from englishContent / englishHighSchool.
 *
 * seedEnglishGrade يتخطّى أي موضوع له دروس مسبقاً (idempotent)، فإضافة hintWords للمحتوى
 * لا تصل للمسائل المزروعة سابقاً. هذا السكربت يطابق كل تمرين له hintWords بمسألته
 * (عبر نصّ السؤال question + language='english') ويحدّث العمود في مكانه فقط — فلا يمسّ
 * محاولات الطلاب ولا تقدّمهم (بعكس إعادة الزرع). آمن للتكرار (idempotent).
 *
 * تشغيل (dev):   npm --workspace apps/api run english:hints:backfill
 * تشغيل (prod):  DATABASE_URL="<رابط Supabase المباشر>" npm --workspace apps/api run english:hints:backfill
 * --force: يستبدل hintWords موجودة (بعد تحرير المحتوى).
 */
import { PrismaClient, type Prisma } from '@prisma/client';
import { ENGLISH_GRADE7, ENGLISH_GRADE8, ENGLISH_GRADE9, type EnExercise } from './englishContent';
import { ENGLISH_3UNIT, ENGLISH_4UNIT, ENGLISH_5UNIT } from './englishHighSchool';

const prisma = new PrismaClient();

type HintWord = { en: string; ar: string };

// يجمع كل التمارين من مصادر المحتوى (صفوف الإعدادي + موديولات الثانوي) كقائمة مسطّحة.
function allExercises(): EnExercise[] {
  const out: EnExercise[] = [];
  for (const units of [ENGLISH_GRADE7, ENGLISH_GRADE8, ENGLISH_GRADE9]) {
    for (const unit of units) for (const lesson of unit.lessons) out.push(...lesson.exercises);
  }
  for (const modules of [ENGLISH_3UNIT, ENGLISH_4UNIT, ENGLISH_5UNIT]) {
    for (const m of modules) for (const t of m.topics) for (const l of t.lessons) out.push(...l.exercises);
  }
  return out;
}

const sameWords = (a: HintWord[], b: unknown): boolean =>
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((w, i) => {
    const o = b[i] as HintWord | undefined;
    return o?.en === w.en && o?.ar === w.ar;
  });

async function main() {
  const force = process.argv.includes('--force');

  // خريطة نصّ السؤال → كلمات التلميح (فقط التمارين التي لها hintWords).
  const byQuestion = new Map<string, HintWord[]>();
  for (const ex of allExercises()) {
    if (ex.hintWords?.length) byQuestion.set(ex.question, ex.hintWords);
  }
  console.log(`📖 أسئلة لها كلمات تلميح في المحتوى: ${byQuestion.size}${force ? ' — وضع --force' : ''}`);

  const problems = await prisma.problem.findMany({
    where: { language: 'english' },
    select: { id: true, question: true, hintWords: true },
  });

  let updated = 0;
  let already = 0;
  let noMatch = 0;

  for (const p of problems) {
    const words = byQuestion.get(p.question);
    if (!words) {
      noMatch++;
      continue;
    }
    if (!force && sameWords(words, p.hintWords)) {
      already++;
      continue; // مطابق مسبقاً — لا تغيير
    }
    await prisma.problem.update({
      where: { id: p.id },
      data: { hintWords: words as unknown as Prisma.InputJsonValue },
    });
    updated++;
  }

  console.log(
    `✔ تعبئة كلمات التلميح: ${updated} محدّثة | ${already} مطابقة مسبقاً | ` +
      `${noMatch} مسألة إنجليزي بلا كلمات تلميح في المحتوى.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
