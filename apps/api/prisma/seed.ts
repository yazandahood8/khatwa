/**
 * Seed — شجرة منهج الرياضيات + الدروس الكاملة (260 درساً) + مسائل تجريبية.
 * المصدر: خطة_الدروس_والمسائل_الكاملة.md → prisma/lessonPlan.ts (مُولّد آلياً).
 *
 * يبني: مادة ← صف ← مستوى ← موضوع ← دروس (مع المدة بالدقائق + النوع).
 *   صفوف 7–9: مستوى موحّد.  الصفوف 10–12: ثلاثة مسارات (3/4/5 יח׳) تحت الصف 10.
 * ثم يزرع مسائل كاملة (طرق + خطوات + أخطاء) على موضوعَي العرض.
 *
 * Idempotent: المواضيع upsert حسب (المستوى + الاسم)؛ الدروس/المسائل تُتخطّى إذا وُجدت.
 * تشغيل: npm run seed --workspace=apps/api
 */
import { PrismaClient, Difficulty } from '@prisma/client';
import { LESSON_PLAN } from './lessonPlan';

const prisma = new PrismaClient();

// ============================================================
//  مسائل تجريبية كاملة — fully-worked demo problems
// ============================================================

type StepSeed = { description: string; expression: string; hint: string };
type ProblemSeed = {
  code: string;
  question: string;
  finalAnswer: string;
  difficulty: Difficulty;
  methods: { name: string; isRecommended: boolean; steps: StepSeed[] }[];
  commonMistakes: { description: string; wrongExample: string; correction: string }[];
};

// ----- مولّد معادلات تربيعية قابلة للتحليل -----
function quadratic(a: number, b: number, i: number): ProblemSeed {
  const p = a + b;
  const q = a * b;
  const disc = p * p - 4 * q;
  return {
    code: `MATH-9-UNI-EQ2-Q${i}`,
    question: `حل المعادلة: x² + ${p}x + ${q} = 0`,
    finalAnswer: `x = -${a} أو x = -${b}`,
    difficulty: Difficulty.medium,
    methods: [
      {
        name: 'التحليل',
        isRecommended: true,
        steps: [
          { description: 'تحديد نوع المعادلة', expression: `x² + ${p}x + ${q} = 0`, hint: 'ما نوع هاي المعادلة؟' },
          { description: `إيجاد عددين ضربهم ${q} وجمعهم ${p}`, expression: `${a} × ${b} = ${q}, ${a} + ${b} = ${p}`, hint: 'فكر بعددين ضربهم الحد الثابت' },
          { description: 'التحليل لعاملين', expression: `(x + ${a})(x + ${b}) = 0`, hint: 'كيف نكتبها عاملين؟' },
          { description: 'إيجاد قيم x', expression: `x = -${a} أو x = -${b}`, hint: 'إذا حاصل ضرب عددين = صفر، ايش معناه؟' },
        ],
      },
      {
        name: 'القانون العام',
        isRecommended: false,
        steps: [
          { description: 'تحديد المعاملات', expression: `a=1, b=${p}, c=${q}`, hint: 'ايش قيمة a و b و c؟' },
          { description: 'حساب المميز', expression: `Δ = ${p}² - 4·${q} = ${disc}`, hint: 'المميز b²-4ac' },
          { description: 'إيجاد الجذور', expression: `x = (-${p} ± √${disc}) / 2`, hint: 'طبّق القانون العام' },
        ],
      },
    ],
    commonMistakes: [
      { description: 'نقل الحد الثابت بإشارة خاطئة', wrongExample: `x² + ${p}x = ${q}`, correction: 'المعادلة تساوي صفر — ما في داعي تنقل شي' },
      { description: 'خطأ في إشارات التحليل', wrongExample: `(x - ${a})(x - ${b}) = 0`, correction: 'الجمع موجب يعني الإشارتين موجبتين' },
    ],
  };
}

// ----- مولّد معادلات خطية -----
function linear(m: number, c: number, x: number, i: number): ProblemSeed {
  const r = m * x + c;
  const sign = c >= 0 ? `+ ${c}` : `- ${-c}`;
  return {
    code: `MATH-7-UNI-LIN-Q${i}`,
    question: `حل المعادلة: ${m}x ${sign} = ${r}`,
    finalAnswer: `x = ${x}`,
    difficulty: Difficulty.easy,
    methods: [
      {
        name: 'العزل',
        isRecommended: true,
        steps: [
          { description: 'نقل الحد الثابت', expression: `${m}x = ${r} ${c >= 0 ? `- ${c}` : `+ ${-c}`} = ${r - c}`, hint: 'انقل الثابت للطرف الثاني واعكس إشارته' },
          { description: 'القسمة على المعامل', expression: `x = ${r - c} / ${m} = ${x}`, hint: 'اقسم الطرفين على معامل x' },
        ],
      },
    ],
    commonMistakes: [
      { description: 'عدم عكس الإشارة عند النقل', wrongExample: `${m}x = ${r} + ${c}`, correction: 'عند النقل للطرف الثاني تنعكس الإشارة' },
    ],
  };
}

// ============================================================
//  أدوات الزرع — helpers
// ============================================================

async function ensureSubject(nameAr: string) {
  return (
    (await prisma.subject.findFirst({ where: { nameAr } })) ??
    (await prisma.subject.create({ data: { nameAr, icon: '📐' } }))
  );
}

async function ensureGrade(subjectId: string, gradeNumber: number) {
  return (
    (await prisma.grade.findUnique({ where: { subjectId_gradeNumber: { subjectId, gradeNumber } } })) ??
    (await prisma.grade.create({ data: { subjectId, gradeNumber } }))
  );
}

async function ensureLevel(gradeId: string, name: string) {
  return (
    (await prisma.level.findFirst({ where: { gradeId, name } })) ??
    (await prisma.level.create({ data: { gradeId, name } }))
  );
}

async function ensureTopic(levelId: string, nameAr: string, orderIndex: number, description: string) {
  const existing = await prisma.topic.findFirst({ where: { levelId, nameAr } });
  if (existing) {
    return prisma.topic.update({ where: { id: existing.id }, data: { orderIndex, description } });
  }
  return prisma.topic.create({ data: { levelId, nameAr, orderIndex, description } });
}

async function ensureLessons(topicId: string, lessons: { order: number; title: string; durationMinutes: number; type: string }[]) {
  const existing = await prisma.lesson.count({ where: { topicId } });
  if (existing > 0) return 0;
  await prisma.lesson.createMany({
    data: lessons.map((l) => ({
      topicId,
      title: l.title,
      description: l.type, // نوع الدرس: تعريفي / مهاري / تطبيقي ...
      durationMinutes: l.durationMinutes,
      orderIndex: l.order,
      isPublished: true,
    })),
  });
  return lessons.length;
}

/**
 * يبني شجرة المنهج كاملة مع الدروس من خطة الدروس.
 * orderIndex للمواضيع تسلسلي داخل كل مستوى (يحافظ على ترتيب الخطة).
 */
async function seedTreeWithLessons(subjectId: string) {
  const index = new Map<string, string>(); // `${grade}|${level}|${name}` → topicId
  const order = new Map<string, number>(); // `${grade}|${level}` → running order
  let topicCount = 0;
  let lessonCount = 0;

  for (const t of LESSON_PLAN) {
    const grade = await ensureGrade(subjectId, t.grade);
    const level = await ensureLevel(grade.id, t.level);
    const okey = `${t.grade}|${t.level}`;
    const oi = order.get(okey) ?? 0;
    order.set(okey, oi + 1);

    const topic = await ensureTopic(level.id, t.name, oi, t.domain);
    index.set(`${t.grade}|${t.level}|${t.name}`, topic.id);
    topicCount++;
    lessonCount += await ensureLessons(topic.id, t.lessons);
  }

  console.log(`  ↳ tree: ${topicCount} topics, ${lessonCount} lessons created`);
  return index;
}

async function seedProblems(topicId: string, problems: ProblemSeed[]) {
  const existing = await prisma.problem.count({ where: { topicId } });
  if (existing > 0) {
    console.log(`  ↳ topic already has ${existing} problems — skipping`);
    return;
  }
  for (const [idx, p] of problems.entries()) {
    await prisma.problem.create({
      data: {
        topicId,
        code: p.code,
        question: p.question,
        finalAnswer: p.finalAnswer,
        difficulty: p.difficulty,
        orderIndex: idx,
        methods: {
          create: p.methods.map((m) => ({
            name: m.name,
            isRecommended: m.isRecommended,
            isApproved: true,
            steps: { create: m.steps.map((s, i) => ({ stepNumber: i + 1, ...s })) },
          })),
        },
        commonMistakes: { create: p.commonMistakes },
      },
    });
  }
  console.log(`  ↳ created ${problems.length} problems`);
}

async function main() {
  console.log('Seeding curriculum tree + lessons + demo problems…');

  const subject = await ensureSubject('رياضيات');
  const topicIndex = await seedTreeWithLessons(subject.id);

  // مسائل خطية — صف 7 موحّد
  const linId = topicIndex.get('7|موحّد|المعادلات الخطية');
  if (linId) {
    await seedProblems(linId, [
      linear(2, 3, 4, 1),
      linear(3, -5, 4, 2),
      linear(5, 2, 3, 3),
      linear(4, -8, 5, 4),
      linear(2, 7, 6, 5),
      linear(6, -6, 2, 6),
      linear(3, 9, 5, 7),
    ]);
  }

  // مسائل تربيعية — صف 9 موحّد
  const eq2Id = topicIndex.get('9|موحّد|المعادلة التربيعية');
  if (eq2Id) {
    await seedProblems(eq2Id, [
      quadratic(2, 3, 1),
      quadratic(1, 4, 2),
      quadratic(2, 5, 3),
      quadratic(3, 4, 4),
      quadratic(1, 6, 5),
      quadratic(3, 5, 6),
      quadratic(2, 4, 7),
      quadratic(4, 5, 8),
    ]);
  }

  const [topics, lessons, problems] = await Promise.all([
    prisma.topic.count(),
    prisma.lesson.count(),
    prisma.problem.count(),
  ]);
  console.log(`✅ Done. Topics: ${topics}, Lessons: ${lessons}, Problems: ${problems}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
