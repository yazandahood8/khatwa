/**
 * Seed — بيانات تجريبية: مواضيع رياضيات + مسائل كاملة (طرق + خطوات + أخطاء).
 * Idempotent: لا يُكرّر المسائل إذا كان الموضوع يحتويها بالفعل.
 * تشغيل: npm run seed --workspace=apps/api
 */
import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

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
    code: `MATH-10-4YH-EQ2-Q${i}`,
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
    code: `MATH-9-3YH-LIN-Q${i}`,
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

async function ensureTopic(subjectName: string, gradeNumber: number, levelName: string, topicName: string) {
  const subject =
    (await prisma.subject.findFirst({ where: { nameAr: subjectName } })) ??
    (await prisma.subject.create({ data: { nameAr: subjectName, icon: '📐' } }));
  const grade =
    (await prisma.grade.findUnique({ where: { subjectId_gradeNumber: { subjectId: subject.id, gradeNumber } } })) ??
    (await prisma.grade.create({ data: { subjectId: subject.id, gradeNumber } }));
  const level =
    (await prisma.level.findFirst({ where: { gradeId: grade.id, name: levelName } })) ??
    (await prisma.level.create({ data: { gradeId: grade.id, name: levelName } }));
  const topic =
    (await prisma.topic.findFirst({ where: { levelId: level.id, nameAr: topicName } })) ??
    (await prisma.topic.create({ data: { levelId: level.id, nameAr: topicName } }));
  return topic;
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
  console.log('Seeding demo math problems…');

  const eq2 = await ensureTopic('رياضيات', 10, '4יח׳', 'المعادلات التربيعية');
  await seedProblems(eq2.id, [
    quadratic(2, 3, 1),
    quadratic(1, 4, 2),
    quadratic(2, 5, 3),
    quadratic(3, 4, 4),
    quadratic(1, 6, 5),
    quadratic(3, 5, 6),
    quadratic(2, 4, 7),
    quadratic(4, 5, 8),
  ]);

  const lin = await ensureTopic('رياضيات', 9, '3יח׳', 'المعادلات الخطية');
  await seedProblems(lin.id, [
    linear(2, 3, 4, 1),
    linear(3, -5, 4, 2),
    linear(5, 2, 3, 3),
    linear(4, -8, 5, 4),
    linear(2, 7, 6, 5),
    linear(6, -6, 2, 6),
    linear(3, 9, 5, 7),
  ]);

  const total = await prisma.problem.count();
  console.log(`✅ Done. Total problems in DB: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
