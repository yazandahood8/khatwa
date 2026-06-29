/**
 * Seed — شجرة منهج الرياضيات الإسرائيلي الكامل (صفوف 7–12) + مسائل تجريبية كاملة.
 * المصدر: منهج_الرياضيات_الكامل_اسرائيل.md (التכنית החדשה / תשפ"ו).
 *
 * يبني الشجرة: مادة ← صف ← مستوى ← موضوع (مع ترتيب + المجال في الوصف).
 *   صفوف 7–9: مستوى موحّد لجميع الطلاب.
 *   صفوف 10–12: ثلاثة مستويات (3/4/5 יח׳).
 * ثم يزرع مسائل كاملة (طرق + خطوات + أخطاء) على موضوعَين.
 *
 * Idempotent: المواضيع upsert حسب (المستوى + الاسم)؛ المسائل تُتخطّى إذا كان الموضوع يحتويها.
 * تشغيل: npm run seed --workspace=apps/api
 */
import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
//  شجرة المنهج — Curriculum tree
// ============================================================

const UNIFIED = 'موحّد';
const L3 = '3יח׳';
const L4 = '4יח׳';
const L5 = '5יח׳';

const ALGEBRA = 'المجال الجبري';
const GEOMETRY = 'المجال الهندسي';
const NUMERIC = 'المجال العددي';
const UNCERTAINTY = 'عدم اليقين (إحصاء واحتمال)';

type LevelSeed = { name: string; domains: { domain: string; topics: string[] }[] };
type GradeSeed = { grade: number; levels: LevelSeed[] };

const CURRICULUM: GradeSeed[] = [
  {
    grade: 7,
    levels: [
      {
        name: UNIFIED,
        domains: [
          {
            domain: ALGEBRA,
            topics: [
              'المتغيرات والتعابير الجبرية',
              'الانتظام والأنماط (חוקיות)',
              'المعادلات الخطية',
              'التمثيل البياني الأساسي',
            ],
          },
          {
            domain: GEOMETRY,
            topics: [
              'الزوايا والمستقيمات',
              'المثلثات والمضلعات',
              'الدائرة',
              'الأجسام الهندسية (ثلاثية الأبعاد)',
            ],
          },
          {
            domain: NUMERIC,
            topics: [
              'قوانين العمليات الحسابية',
              'القوى والجذور التربيعية',
              'الأعداد الموجّهة (سالبة وموجبة)',
              'جملة المحاور',
            ],
          },
          { domain: UNCERTAINTY, topics: ['جمع وتنظيم المعطيات'] },
        ],
      },
    ],
  },
  {
    grade: 8,
    levels: [
      {
        name: UNIFIED,
        domains: [
          {
            domain: ALGEBRA,
            topics: [
              'النسبة والتناسب',
              'الدالة وتمثيلاتها',
              'المعادلة الخطية والمستقيم',
              'جملة معادلتين بمجهولين',
              'المتباينات',
            ],
          },
          {
            domain: GEOMETRY,
            topics: [
              'نظرية فيثاغورس',
              'التحويلات الهندسية',
              'تطابق المثلثات',
              'تشابه المثلثات (مقدمة)',
              'الأسطوانة والمخروط',
            ],
          },
          { domain: NUMERIC, topics: ['الأعداد الحقيقية'] },
          { domain: UNCERTAINTY, topics: ['الإحصاء المتوسط', 'الاحتمال - مقدمة'] },
        ],
      },
    ],
  },
  {
    grade: 9,
    levels: [
      {
        name: UNIFIED,
        domains: [
          {
            domain: ALGEBRA,
            topics: [
              'التقنية الجبرية المتقدمة',
              'الدالة التربيعية',
              'المعادلة التربيعية',
              'المتباينات التربيعية',
            ],
          },
          {
            domain: GEOMETRY,
            topics: [
              'تشابه المثلثات (متقدم)',
              'نظريات المثلث المتساوي الساقين',
              'المثلث القائم بزوايا 30°-60°-90°',
              'متوازي الأضلاع والأشكال الخاصة',
              'الإثبات الهندسي',
            ],
          },
          { domain: UNCERTAINTY, topics: ['الإحصاء والاحتمال المتقدم'] },
        ],
      },
    ],
  },
  {
    grade: 10,
    levels: [
      {
        name: L3,
        domains: [
          {
            domain: ALGEBRA,
            topics: [
              'مراجعة وتعميق الجبر الأساسي',
              'النموذج الخطي',
              'النموذج التربيعي (مقدمة)',
              'النسب المئوية والنسب التطبيقية',
            ],
          },
        ],
      },
      {
        name: L4,
        domains: [
          {
            domain: ALGEBRA,
            topics: ['التقنية الجبرية المتقدمة', 'الدالة وخصائصها'],
          },
          { domain: GEOMETRY, topics: ['المثلثات في المستوى (مقدمة)'] },
          { domain: UNCERTAINTY, topics: ['الإحصاء والاحتمال (4 وحدات)'] },
        ],
      },
      {
        name: L5,
        domains: [
          { domain: ALGEBRA, topics: ['التقنية الجبرية المتقدمة جداً'] },
          { domain: GEOMETRY, topics: ['المثلثات في المستوى'] },
          { domain: UNCERTAINTY, topics: ['الاحتمال المتقدم'] },
          { domain: ALGEBRA, topics: ['مقدمة التفاضل والتكامل'] },
        ],
      },
    ],
  },
  {
    grade: 11,
    levels: [
      {
        name: L3,
        domains: [
          {
            domain: UNCERTAINTY,
            topics: ['الإحصاء', 'التوزيع الطبيعي', 'الاحتمال التطبيقي'],
          },
          {
            domain: GEOMETRY,
            topics: ['المحيطات والمساحات', 'الأجسام في الفراغ'],
          },
          {
            domain: ALGEBRA,
            topics: ['الرياضيات المالية', 'النموذج الخطي التطبيقي', 'التخطيط الخطي'],
          },
        ],
      },
      {
        name: L4,
        domains: [
          { domain: UNCERTAINTY, topics: ['الاحتمال المتقدم', 'الانحدار الخطي'] },
          { domain: GEOMETRY, topics: ['المثلثات في المستوى', 'الهندسة التحليلية'] },
          {
            domain: ALGEBRA,
            topics: ['المشتقة', 'تطبيقات المشتقة', 'التكامل'],
          },
        ],
      },
      {
        name: L5,
        domains: [
          {
            domain: UNCERTAINTY,
            topics: ['الاحتمال المتقدم جداً'],
          },
          {
            domain: ALGEBRA,
            topics: ['المتتاليات', 'الاستقراء الرياضي'],
          },
          {
            domain: GEOMETRY,
            topics: ['المثلثات المتقدمة', 'الهندسة التحليلية المتقدمة'],
          },
          {
            domain: ALGEBRA,
            topics: ['اشتقاق الدوال الخاصة', 'التكامل المتقدم (حدوديات)'],
          },
        ],
      },
    ],
  },
  {
    grade: 12,
    levels: [
      {
        name: L3,
        domains: [
          { domain: GEOMETRY, topics: ['الهندسة التحليلية التطبيقية', 'الأجسام في الفراغ'] },
          { domain: UNCERTAINTY, topics: ['التوزيع الطبيعي (تطبيقي)'] },
          { domain: ALGEBRA, topics: ['النموذج التربيعي التطبيقي'] },
        ],
      },
      {
        name: L4,
        domains: [
          {
            domain: ALGEBRA,
            topics: [
              'المتتاليات',
              'المتجهات',
              'النمو والاضمحلال',
              'التفاضل والتكامل الأسي واللوغاريتمي',
            ],
          },
          { domain: UNCERTAINTY, topics: ['الإحصاء المتقدم (فحص الفرضيات)'] },
        ],
      },
      {
        name: L5,
        domains: [
          { domain: GEOMETRY, topics: ['الهندسة التحليلية المتقدمة'] },
          {
            domain: ALGEBRA,
            topics: [
              'المتجهات في الفراغ ثلاثي الأبعاد',
              'الأعداد المركّبة',
              'التفاضل والتكامل المتقدم (5 وحدات)',
            ],
          },
        ],
      },
    ],
  },
];

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

/** يبني شجرة المنهج كاملة ويعيد دليلاً للوصول السريع لموضوع معيّن. */
async function seedCurriculumTree(subjectId: string) {
  // key: `${grade}|${level}|${topicName}` → topicId
  const index = new Map<string, string>();
  let topicCount = 0;

  for (const g of CURRICULUM) {
    const grade = await ensureGrade(subjectId, g.grade);
    for (const lvl of g.levels) {
      const level = await ensureLevel(grade.id, lvl.name);
      let order = 0;
      for (const d of lvl.domains) {
        for (const topicName of d.topics) {
          const topic = await ensureTopic(level.id, topicName, order++, d.domain);
          index.set(`${g.grade}|${lvl.name}|${topicName}`, topic.id);
          topicCount++;
        }
      }
    }
  }

  console.log(`  ↳ curriculum tree: ${CURRICULUM.length} grades, ${topicCount} topics`);
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
  console.log('Seeding curriculum tree + demo problems…');

  const subject = await ensureSubject('رياضيات');
  const topicIndex = await seedCurriculumTree(subject.id);

  // مسائل خطية — صف 7 موحّد
  const linId = topicIndex.get(`7|${UNIFIED}|المعادلات الخطية`);
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
  const eq2Id = topicIndex.get(`9|${UNIFIED}|المعادلة التربيعية`);
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

  const [topics, problems] = await Promise.all([prisma.topic.count(), prisma.problem.count()]);
  console.log(`✅ Done. Topics: ${topics}, Problems: ${problems}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
