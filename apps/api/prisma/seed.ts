/**
 * Seed — شجرة منهج الرياضيات + الدروس الكاملة (260 درساً) + مسائل تجريبية.
 * المصدر: خطة_الدروس_والمسائل_الكاملة.md → prisma/lessonPlan.ts (مُولّد آلياً).
 *
 * يبني: مادة ← صف ← مستوى ← موضوع ← دروس (مع المدة بالدقائق + النوع).
 *   صفوف 7–9: مستوى موحّد.
 *   الصفوف 10–12: مواضيع الخطة موزّعة على الصف الحقيقي حسب المنهج (UPPER_GRADE)؛
 *   الصف 10 يحصل على مواضيع المراجعة/التمهيد (GRADE10_SCAFFOLD) بلا دروس بعد.
 * ثم يزرع مسائل كاملة (طرق + خطوات + أخطاء) على موضوعَي العرض.
 *
 * Idempotent: المواضيع upsert حسب (المستوى + الاسم)؛ الدروس/المسائل تُتخطّى إذا وُجدت.
 * تشغيل: npm run seed --workspace=apps/api
 */
import { PrismaClient, Difficulty } from '@prisma/client';
import { LESSON_PLAN, type TopicPlan } from './lessonPlan';
import { LESSON_PROBLEMS } from './generators';

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

async function ensureLessons(gradeNum: number, topicName: string, topicId: string, lessons: TopicPlan['lessons']) {
  const existing = await prisma.lesson.count({ where: { topicId } });
  if (existing > 0) return { lessons: 0, questions: 0, worked: 0 };
  let questions = 0;
  let worked = 0;
  for (const l of lessons) {
    const lesson = await prisma.lesson.create({
      data: {
        topicId,
        title: l.title,
        description: l.type, // نوع الدرس: تعريفي / مهاري / تطبيقي ...
        durationMinutes: l.durationMinutes,
        orderIndex: l.order,
        isPublished: true,
      },
    });

    const gen = LESSON_PROBLEMS[`${gradeNum}|${topicName}|${l.order}`];
    if (gen) {
      // مسائل كاملة محسوبة: جواب + طريقة بخطوات + أخطاء شائعة
      for (const [idx, p] of gen().entries()) {
        await prisma.problem.create({
          data: {
            topicId,
            lessonId: lesson.id,
            question: p.question,
            finalAnswer: p.finalAnswer,
            difficulty: p.difficulty,
            orderIndex: idx,
            allowFreeMethod: true,
            methods: {
              create: {
                name: p.method.name,
                isRecommended: true,
                isApproved: true,
                steps: { create: p.method.steps.map((s, i) => ({ stepNumber: i + 1, ...s })) },
              },
            },
            commonMistakes: { create: p.commonMistakes },
          },
        });
        worked++;
      }
    } else if (l.questions.length > 0) {
      // احتياطي: نصّ سؤال الخطة فقط (بلا حل) حتى يُغطّى الدرس بمولّد
      await prisma.problem.createMany({
        data: l.questions.map((q) => ({
          topicId,
          lessonId: lesson.id,
          question: q.text,
          finalAnswer: '',
          difficulty: q.difficulty as Difficulty,
          orderIndex: q.order,
          allowFreeMethod: true,
        })),
      });
      questions += l.questions.length;
    }
  }
  return { lessons: lessons.length, questions, worked };
}

// إعادة توزيع مواضيع المسارات العليا على صفّها الحقيقي حسب المنهج (الخطة تجمعها تحت "10-12").
const UPPER_GRADE: Record<string, number> = {
  // 3 وحدات → الصف 11
  'الإحصاء التطبيقي': 11,
  'التوزيع الطبيعي': 11,
  'الاحتمال التطبيقي': 11,
  'التخطيط الخطي': 11,
  // 4 وحدات
  'الاحتمال الشرطي والانحدار': 11,
  'المثلثات في المستوى': 11,
  'الهندسة التحليلية': 11,
  'المشتقة وتطبيقاتها': 11,
  'التكامل': 11,
  'المتتاليات': 12,
  'المتجهات': 12,
  'النمو والاضمحلال والدوال الأسية': 12,
  // 5 وحدات
  'الاحتمال المتقدم': 11,
  'الاستقراء الرياضي': 11,
  'الأعداد المركّبة': 12,
  'القطوع المخروطية': 12,
  'المتجهات في الفراغ': 12,
  'التفاضل والتكامل المتقدم (5 وحدات)': 12,
};

// مواضيع الصف 10 (مراجعة/تمهيد) من المنهج العام — بلا دروس بعد.
const GRADE10_SCAFFOLD: { level: string; domain: string; topics: string[] }[] = [
  {
    level: '3יח׳',
    domain: 'المجال الجبري',
    topics: ['مراجعة وتعميق الجبر الأساسي', 'النموذج الخطي', 'النموذج التربيعي (مقدمة)', 'النسب المئوية والنسب التطبيقية'],
  },
  {
    level: '4יח׳',
    domain: 'المجال الجبري',
    topics: ['التقنية الجبرية المتقدمة', 'الدالة وخصائصها', 'المثلثات في المستوى (مقدمة)', 'الإحصاء والاحتمال (4 وحدات)'],
  },
  {
    level: '5יח׳',
    domain: 'المجال الجبري',
    topics: ['التقنية الجبرية المتقدمة جداً', 'المثلثات في المستوى', 'الاحتمال المتقدم', 'مقدمة التفاضل والتكامل'],
  },
];

/**
 * يبني شجرة المنهج كاملة مع الدروس من خطة الدروس.
 * orderIndex للمواضيع تسلسلي داخل كل (صف|مستوى) ويحافظ على ترتيب الخطة.
 */
async function seedTreeWithLessons(subjectId: string) {
  const index = new Map<string, string>(); // `${grade}|${level}|${name}` → topicId
  const order = new Map<string, number>(); // `${grade}|${level}` → running order
  let topicCount = 0;
  let lessonCount = 0;
  let questionCount = 0;
  let workedCount = 0;

  const nextOrder = (gradeNum: number, level: string) => {
    const okey = `${gradeNum}|${level}`;
    const oi = order.get(okey) ?? 0;
    order.set(okey, oi + 1);
    return oi;
  };

  // مواضيع الخطة (مع الدروس) — موزّعة على صفّها الحقيقي
  for (const t of LESSON_PLAN) {
    const gradeNum = UPPER_GRADE[t.name] ?? t.grade;
    const grade = await ensureGrade(subjectId, gradeNum);
    const level = await ensureLevel(grade.id, t.level);
    const topic = await ensureTopic(level.id, t.name, nextOrder(gradeNum, t.level), t.domain);
    index.set(`${gradeNum}|${t.level}|${t.name}`, topic.id);
    topicCount++;
    const r = await ensureLessons(gradeNum, t.name, topic.id, t.lessons);
    lessonCount += r.lessons;
    questionCount += r.questions;
    workedCount += r.worked;
  }

  // مواضيع تمهيد الصف 10 (بلا دروس)
  const g10 = await ensureGrade(subjectId, 10);
  for (const s of GRADE10_SCAFFOLD) {
    const level = await ensureLevel(g10.id, s.level);
    for (const name of s.topics) {
      const topic = await ensureTopic(level.id, name, nextOrder(10, s.level), s.domain);
      index.set(`10|${s.level}|${name}`, topic.id);
      topicCount++;
    }
  }

  console.log(`  ↳ tree: ${topicCount} topics, ${lessonCount} lessons, ${workedCount} worked problems, ${questionCount} text questions`);
  return index;
}

async function seedProblems(topicId: string, problems: ProblemSeed[]) {
  // نعدّ فقط المسائل الكاملة (غير المرتبطة بدرس) حتى لا تمنع مسائلُ الدروس زرعَها
  const existing = await prisma.problem.count({ where: { topicId, lessonId: null } });
  if (existing > 0) {
    console.log(`  ↳ topic already has ${existing} full problems — skipping`);
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

  const [topics, lessons, problems, lessonQ] = await Promise.all([
    prisma.topic.count(),
    prisma.lesson.count(),
    prisma.problem.count(),
    prisma.problem.count({ where: { lessonId: { not: null } } }),
  ]);
  console.log(`✅ Done. Topics: ${topics}, Lessons: ${lessons}, Problems: ${problems} (lesson questions: ${lessonQ})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
