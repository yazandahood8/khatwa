/**
 * تعبئة كلمات التلميح (hintWords) على مسائل الإنجليزية الموجودة مسبقاً في قاعدة البيانات
 * دون إعادة زرع مُدمِّرة — backfill Problem.hintWords from englishContent / englishHighSchool.
 *
 * seedEnglishGrade يتخطّى أي موضوع له دروس مسبقاً (idempotent)، فإضافة hintWords للمحتوى
 * لا تصل للمسائل المزروعة سابقاً. هذا السكربت يطابق كل تمرين له hintWords بمسألته
 * (عبر نصّ السؤال question + language='english') ويحدّث العمود في مكانه فقط — فلا يمسّ
 * محاولات الطلاب ولا تقدّمهم (بعكس إعادة الزرع). آمن للتكرار (idempotent).
 *
 * تشغيل (dev):   npm --workspace backend run english:hints:backfill
 * تشغيل (prod):  DATABASE_URL="<رابط Supabase المباشر>" npm --workspace backend run english:hints:backfill
 * --force: يستبدل hintWords موجودة (بعد تحرير المحتوى).
 */
import { PrismaClient, type Prisma } from '@prisma/client';
import { ENGLISH_GRADE7, ENGLISH_GRADE8, ENGLISH_GRADE9, type EnLesson } from './englishContent';
import { ENGLISH_3UNIT, ENGLISH_4UNIT, ENGLISH_5UNIT } from './englishHighSchool';

const prisma = new PrismaClient();

type HintWord = { en: string; ar: string };
type Desired = { hintWords?: HintWord[]; passageHintWords?: HintWord[] };

// يجمع كل الدروس من مصادر المحتوى (صفوف الإعدادي + موديولات الثانوي) كقائمة مسطّحة.
function allLessons(): EnLesson[] {
  const out: EnLesson[] = [];
  for (const units of [ENGLISH_GRADE7, ENGLISH_GRADE8, ENGLISH_GRADE9]) {
    for (const unit of units) out.push(...unit.lessons);
  }
  for (const modules of [ENGLISH_3UNIT, ENGLISH_4UNIT, ENGLISH_5UNIT]) {
    for (const m of modules) for (const t of m.topics) out.push(...t.lessons);
  }
  return out;
}

const sameWords = (a: HintWord[] | undefined, b: unknown): boolean => {
  const want = a ?? [];
  if (!Array.isArray(b)) return want.length === 0;
  return (
    want.length === b.length &&
    want.every((w, i) => {
      const o = b[i] as HintWord | undefined;
      return o?.en === w.en && o?.ar === w.ar;
    })
  );
};

async function main() {
  const force = process.argv.includes('--force');

  // خريطة نصّ السؤال → { كلمات السؤال، كلمات القطعة }. كلمات القطعة تُطابق منطق الزرع (قطعة الدرس فقط).
  const byQuestion = new Map<string, Desired>();
  for (const l of allLessons()) {
    for (const ex of l.exercises) {
      const passageHintWords = ex.passage ? undefined : l.skill === 'reading' ? l.passageHintWords : undefined;
      if (ex.hintWords?.length || passageHintWords?.length) {
        byQuestion.set(ex.question, { hintWords: ex.hintWords, passageHintWords });
      }
    }
  }
  console.log(`📖 أسئلة لها كلمات تلميح في المحتوى: ${byQuestion.size}${force ? ' — وضع --force' : ''}`);

  const problems = await prisma.problem.findMany({
    where: { language: 'english' },
    select: { id: true, question: true, hintWords: true, passageHintWords: true },
  });

  let updated = 0;
  let already = 0;
  let noMatch = 0;

  for (const p of problems) {
    const desired = byQuestion.get(p.question);
    if (!desired) {
      noMatch++;
      continue;
    }
    // نحدّث فقط الحقول المعرّفة في المحتوى (حتى لا نمسح ما ليس له مصدر).
    const data: Prisma.ProblemUpdateInput = {};
    let changed = false;
    if (desired.hintWords && !sameWords(desired.hintWords, p.hintWords)) {
      data.hintWords = desired.hintWords as unknown as Prisma.InputJsonValue;
      changed = true;
    }
    if (desired.passageHintWords && !sameWords(desired.passageHintWords, p.passageHintWords)) {
      data.passageHintWords = desired.passageHintWords as unknown as Prisma.InputJsonValue;
      changed = true;
    }
    if (!force && !changed) {
      already++;
      continue; // مطابق مسبقاً — لا تغيير
    }
    if (force) {
      if (desired.hintWords) data.hintWords = desired.hintWords as unknown as Prisma.InputJsonValue;
      if (desired.passageHintWords)
        data.passageHintWords = desired.passageHintWords as unknown as Prisma.InputJsonValue;
    }
    await prisma.problem.update({ where: { id: p.id }, data });
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
