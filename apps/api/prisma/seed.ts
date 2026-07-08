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
import { PrismaClient, Difficulty, type Prisma } from '@prisma/client';
import { LESSON_PLAN, type TopicPlan } from './lessonPlan';
import { LESSON_PROBLEMS } from './generators';
import { CS_PLAN } from './csLessonPlan';
import { CS_PROBLEMS, CS_FIGURES, CS_EXPLAIN } from './csGenerators';
import { QUESTIONNAIRE_CONTENT } from './questionnaireContent';
import { QUESTIONNAIRE_PROBLEMS } from './questionnaireProblems';
import { seedEnglish } from './englishSeed';

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

async function ensureSubject(nameAr: string, icon = '📐', orderIndex = 0) {
  return (
    (await prisma.subject.findFirst({ where: { nameAr } })) ??
    (await prisma.subject.create({ data: { nameAr, icon, orderIndex } }))
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

// مسار وحدات مستقل عن الصف (10-12) — مرتبط بالمادة مباشرةً.
async function ensureTrackLevel(subjectId: string, unitLevel: number) {
  const name = `${unitLevel} وحدات`;
  const existing = await prisma.level.findFirst({ where: { subjectId, unitLevel } });
  if (existing) {
    return existing.name === name
      ? existing
      : prisma.level.update({ where: { id: existing.id }, data: { name } });
  }
  return prisma.level.create({ data: { subjectId, unitLevel, name } });
}

// نموذج — دورة داخل مسار الوحدات (upsert حسب المستوى+الرقم).
async function ensureQuestionnaire(levelId: string, number: number, orderIndex: number) {
  return prisma.questionnaire.upsert({
    where: { levelId_number: { levelId, number } },
    update: { orderIndex },
    create: { levelId, number, orderIndex },
  });
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
            figure: (p.figure ?? undefined) as Prisma.InputJsonValue | undefined,
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

// نماذج لكل مسار وحدات (رياضيات) — حسب الشاشات المرجعية. المواضيع تُضاف لاحقاً من المستخدم.
const MATH_QUESTIONNAIRES: Record<number, number[]> = {
  3: [182, 381, 382],
  4: [481, 482],
  5: [581, 582],
};

/**
 * يبني شجرة المنهج للصفوف 7-9 مع الدروس من خطة الدروس (بلا تغيير).
 * تُتخطّى مواضيع 10-12 هنا — تُبنى تحت مسارات الوحدات/الشالونات لاحقاً.
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

  // مواضيع الخطة (مع الدروس) — الصفوف 7-9 فقط
  for (const t of LESSON_PLAN) {
    if (t.grade >= 10) continue; // 10-12 تُبنى بمسارات الوحدات + الشالونات
    const grade = await ensureGrade(subjectId, t.grade);
    const level = await ensureLevel(grade.id, t.level);
    const topic = await ensureTopic(level.id, t.name, nextOrder(t.grade, t.level), t.domain);
    index.set(`${t.grade}|${t.level}|${t.name}`, topic.id);
    topicCount++;
    const r = await ensureLessons(t.grade, t.name, topic.id, t.lessons);
    lessonCount += r.lessons;
    questionCount += r.questions;
    workedCount += r.worked;
  }

  console.log(`  ↳ tree (7-9): ${topicCount} topics, ${lessonCount} lessons, ${workedCount} worked problems, ${questionCount} text questions`);
  return index;
}

/**
 * يبني مسارات الوحدات المستقلة عن الصف (10-12): مادة ← مستوى(3/4/5) ← نموذج.
 * المواضيع/الدروس داخل كل نموذج تُضاف لاحقاً من المستخدم.
 */
async function seedUnitTracks(subjectId: string) {
  let tracks = 0;
  let questionnaires = 0;
  for (const [unitStr, numbers] of Object.entries(MATH_QUESTIONNAIRES)) {
    const unit = Number(unitStr);
    const level = await ensureTrackLevel(subjectId, unit);
    tracks++;
    let oi = 0;
    for (const number of numbers) {
      await ensureQuestionnaire(level.id, number, oi++);
      questionnaires++;
    }
  }
  console.log(`  ↳ unit tracks (10-12): ${tracks} tracks, ${questionnaires} questionnaires`);
}

/**
 * يزرع محتوى النماذج (مواضيع + دروس) من questionnaireContent.
 * يطابق رقم النموذج داخل مسارات وحدات المادة (الأرقام لا تتعارض بين المسارات).
 * المصدر مرجعي: يُحذف محتوى النموذج الحالي ويُعاد بناؤه (يبقى idempotent).
 * تنبيه: مقصور على الدروس بلا فيديو؛ لا تُدخل مواضيع يدويًا تحت نموذج مُدار بالمصدر.
 */
async function seedQuestionnaireContent(subjectId: string) {
  let topics = 0;
  let lessons = 0;
  let worked = 0;
  for (const [numStr, content] of Object.entries(QUESTIONNAIRE_CONTENT)) {
    const number = Number(numStr);
    const q = await prisma.questionnaire.findFirst({
      where: { number, level: { subjectId } },
    });
    if (!q) {
      console.log(`  ↳ ⚠ نموذج ${number} غير موجود لهذه المادة — تخطّي`);
      continue;
    }
    // إعادة بناء من المصدر — يحذف المواضيع (وتُحذف دروسها بالتتالي)
    await prisma.topic.deleteMany({ where: { questionnaireId: q.id } });
    for (const [ti, t] of content.topics.entries()) {
      const topic = await prisma.topic.create({
        data: { questionnaireId: q.id, nameAr: t.name, orderIndex: ti },
      });
      topics++;
      for (const l of t.lessons) {
        const lesson = await prisma.lesson.create({
          data: {
            topicId: topic.id,
            title: l.title,
            orderIndex: l.chapter,
            durationSeconds: l.sec,
            durationMinutes: Math.round(l.sec / 60),
            isPublished: true,
          },
        });
        lessons++;

        // مسائل تدريب الدرس (سؤال + جواب + طريقة + أخطاء شائعة) إن وُجد مولّد
        const gen = QUESTIONNAIRE_PROBLEMS[`${number}|${t.name}|${l.chapter}`];
        if (gen) {
          for (const [idx, p] of gen().entries()) {
            await prisma.problem.create({
              data: {
                topicId: topic.id,
                lessonId: lesson.id,
                question: p.question,
                finalAnswer: p.finalAnswer,
                difficulty: p.difficulty,
                figure: (p.figure ?? undefined) as Prisma.InputJsonValue | undefined,
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
        }
      }
    }
  }
  console.log(`  ↳ questionnaire content: ${topics} topics, ${lessons} lessons, ${worked} worked problems`);
}

/**
 * يبني بجروت علوم الحاسوب كمسار وحدات مستقل عن الصف:
 *   مادة ← مستوى وحدات (3/5) ← موضوع (مُجمّع حسب الوِحدة عبر الوصف) ← دروس ← مسائل برمجة.
 * لا صفوف هنا — علوم الحاسوب مادة بجروت تُعرض حسب عدد الوحدات (3/5) مثل مسارات الرياضيات 10-12.
 * مسائل البرمجة من نوع code (language='csharp') يقيّمها الذكاء الاصطناعي؛ الحل المرجعي في finalAnswer.
 */
async function seedCs(subjectId: string) {
  // تنظيف البنية القديمة: كانت CS تُزرع تحت "صف 10" فاختفت بعد إعادة هيكلة 10-12.
  // حذف الصفوف يزيل بالتتالي مستوياتها/مواضيعها/دروسها القديمة قبل إعادة البناء كمسار وحدات.
  await prisma.grade.deleteMany({ where: { subjectId } });

  const order = new Map<string, number>(); // level → running topic order
  let topics = 0;
  let lessons = 0;
  let coded = 0;
  let text = 0;

  for (const t of CS_PLAN) {
    const unitLevel = parseInt(t.level, 10); // "3 وحدات" → 3، "5 وحدات" → 5
    const level = await ensureTrackLevel(subjectId, unitLevel);
    const oi = order.get(t.level) ?? 0;
    order.set(t.level, oi + 1);
    const topic = await ensureTopic(level.id, t.name, oi, t.unit); // الوصف = الوِحدة (يُستخدم للتجميع بالعرض)
    topics++;

    if ((await prisma.lesson.count({ where: { topicId: topic.id } })) > 0) continue;

    for (const l of t.lessons) {
      const lesson = await prisma.lesson.create({
        data: {
          topicId: topic.id,
          title: l.title,
          description: l.type,
          durationMinutes: l.durationMinutes,
          orderIndex: l.order,
          isPublished: true,
        },
      });
      lessons++;

      const gen = CS_PROBLEMS[`${t.level}|${t.name}|${l.order}`];
      if (gen) {
        for (const [idx, p] of gen().entries()) {
          const csKey = `${t.level}|${t.name}|${l.order}#${idx}`;
          const csFig = CS_FIGURES[csKey];
          await prisma.problem.create({
            data: {
              topicId: topic.id,
              lessonId: lesson.id,
              question: p.question,
              finalAnswer: p.referenceSolution, // الحل المرجعي لتقييم AI
              language: 'csharp',
              // explain = سؤال مفاهيمي (شرح حرّ)؛ trace_* = تتبّع؛ null = اكتب كوداً
              kind: CS_EXPLAIN.has(csKey) ? 'explain' : p.kind ?? null,
              starterCode: p.starterCode ?? null,
              figure: (csFig ?? undefined) as Prisma.InputJsonValue | undefined,
              difficulty: p.difficulty,
              orderIndex: idx,
              allowFreeMethod: true,
              ...(p.commonMistakes && p.commonMistakes.length > 0
                ? { commonMistakes: { create: p.commonMistakes } }
                : {}),
            },
          });
          coded++;
        }
      } else if (l.questions.length > 0) {
        await prisma.problem.createMany({
          data: l.questions.map((qq) => ({
            topicId: topic.id,
            lessonId: lesson.id,
            question: qq.text,
            finalAnswer: '',
            language: 'csharp',
            difficulty: qq.difficulty as Difficulty,
            orderIndex: qq.order,
            allowFreeMethod: true,
          })),
        });
        text += l.questions.length;
      }
    }
  }
  console.log(`  ↳ CS: ${topics} topics, ${lessons} lessons, ${coded} coded problems, ${text} text questions`);
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
  await seedUnitTracks(subject.id); // مسارات 10-12 (شالونات)
  await seedQuestionnaireContent(subject.id); // محتوى الشالونات (شالون 182 …)

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

  // ---------- علوم الحاسوب (C# — مسائل يقيّمها الذكاء الاصطناعي) ----------
  const cs = await ensureSubject('علوم الحاسوب', '💻', 1);
  await seedCs(cs.id);

  // ---------- إنجليزي (هيكل فقط — المحتوى يُضاف لاحقاً) ----------
  const english = await ensureSubject('إنجليزي', '🔤', 2);
  await seedEnglish(prisma, english.id);

  const [topics, lessons, problems, lessonQ, codeQ] = await Promise.all([
    prisma.topic.count(),
    prisma.lesson.count(),
    prisma.problem.count(),
    prisma.problem.count({ where: { lessonId: { not: null } } }),
    prisma.problem.count({ where: { language: 'csharp' } }),
  ]);
  console.log(`✅ Done. Topics: ${topics}, Lessons: ${lessons}, Problems: ${problems} (lesson Q: ${lessonQ}, code Q: ${codeQ})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
