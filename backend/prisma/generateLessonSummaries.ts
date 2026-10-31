/**
 * مولّد ملخّصات الدروس — one-time generator of lesson summaries for the AI lesson-teacher chat.
 *
 * يقرأ الدروس من قاعدة البيانات مع سياق الموضوع/المستوى وتماريها، ولكل درس يولّد ملخّصاً
 * تعليمياً قصيراً بالعربي عبر Claude، ويكتبه في prisma/generatedLessonSummaries.json (بمفتاح = معرّف الدرس).
 * هذا الملخّص هو قاعدة معرفة معلّم الدردشة (buildLessonTeacherPrompt).
 *
 * حتمي وقابل للاستئناف: يتخطّى ما هو موجود مسبقاً في الملف، فيمكن تشغيله على دفعات.
 * تشغيل كامل:   npm run summaries:generate --workspace=backend
 * تجربة سريعة:  npm run summaries:generate --workspace=backend -- 5   (أول 5 دروس فقط)
 * إعادة توليد:  npm run summaries:generate --workspace=backend -- --force
 * فلترة عنوان: npm run summaries:generate --workspace=backend -- --filter=كسور
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { env } from '../src/utils/env';

const GEN_MODEL = 'claude-sonnet-4-6';
const OUT_PATH = join(__dirname, 'generatedLessonSummaries.json');
const CONCURRENCY = 5;

if (!env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY مفقود في .env — لا يمكن توليد الملخّصات');
  process.exit(1);
}
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
const prisma = new PrismaClient();

type WorkItem = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  grade: number | null;
  level: string | null;
  topic: string;
  problems: string[];
};

/** يشتقّ المادة/الصف/المستوى من الموضوع — يدعم مسارَي التسلسل (7–9 و10–12). */
function deriveContext(topic: {
  nameAr: string;
  level: {
    name: string;
    grade: { gradeNumber: number; subject: { nameAr: string } } | null;
    subject: { nameAr: string } | null;
  } | null;
  questionnaire: { number: number; level: { name: string; subject: { nameAr: string } | null } } | null;
}): { subject: string; grade: number | null; level: string | null } {
  if (topic.questionnaire) {
    return {
      subject: topic.questionnaire.level.subject?.nameAr ?? 'رياضيات',
      grade: null,
      level: `${topic.questionnaire.level.name} · نموذج ${topic.questionnaire.number}`,
    };
  }
  const lvl = topic.level;
  return {
    subject: lvl?.grade?.subject.nameAr ?? lvl?.subject?.nameAr ?? 'رياضيات',
    grade: lvl?.grade?.gradeNumber ?? null,
    level: lvl?.name ?? null,
  };
}

function buildPrompt(item: WorkItem): string {
  const problems = item.problems.length
    ? item.problems.slice(0, 15).map((q, i) => `${i + 1}. ${q}`).join('\n')
    : 'لا يوجد تمارين مرتبطة.';
  return `المادة: ${item.subject}${item.grade ? `  |  الصف: ${item.grade}` : ''}${item.level ? `  |  المستوى: ${item.level}` : ''}
الموضوع: ${item.topic}
عنوان الدرس: ${item.title}
${item.description ? `وصف الدرس: ${item.description}` : ''}

تمارين هذا الدرس (تدلّك على المفاهيم والمهارات المطلوبة):
${problems}

المطلوب: اكتب ملخّصاً تعليمياً للدرس — يشرح المفاهيم الأساسية والخطوات والمهارات التي يغطّيها هذا الدرس — ليكون قاعدة معرفة لمعلّم ذكي يجاوب أسئلة الطالب عن هذا الدرس فقط.`;
}

const SYSTEM = `أنت معلّم خبير تكتب ملخّصات دروس للطلاب العرب في إسرائيل، تُستخدم كقاعدة معرفة لمساعد ذكي.

قواعد:
- اكتب ملخّصاً واضحاً منظّماً (من 100 إلى 220 كلمة) بالعربي الفصيح المبسّط، يغطّي: فكرة الدرس الأساسية، المفاهيم والمصطلحات المهمّة، والخطوات أو القواعد العملية التي يتعلّمها الطالب.
- استند إلى عنوان الدرس ووصفه وتماريه المذكورة فقط — لا تخترع محتوى خارج نطاق الدرس.
- عيّر عمق اللغة حسب مستوى الطالب (صفوف 7–9 لغة أبسط؛ 4/5 وحدات مسموح المصطلح المنهجيّ).
- لا تحلّ التمارين ولا تكشف أجوبتها النهائية — لخّص المفاهيم فقط.
- أخرج نصّ الملخّص فقط، بلا عنوان ولا مقدّمات مثل «ملخّص:» ولا تشكيل بالحركات.`;

function clean(text: string): string {
  return text.trim().replace(/^ملخّص\s*[:：-]\s*/, '').trim();
}

async function generateOne(item: WorkItem): Promise<string> {
  const msg = await anthropic.messages.create({
    model: GEN_MODEL,
    max_tokens: 500,
    system: SYSTEM,
    messages: [{ role: 'user', content: buildPrompt(item) }],
  });
  const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  return clean(text);
}

async function run() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const filterArg = args.find((a) => a.startsWith('--filter='))?.slice('--filter='.length);
  const filter = filterArg ? new RegExp(filterArg) : null;
  const limit = Number(args.find((a) => /^\d+$/.test(a))) || 0; // 0 = بلا حد

  const summaries: Record<string, string> = existsSync(OUT_PATH)
    ? JSON.parse(readFileSync(OUT_PATH, 'utf8'))
    : {};

  const lessons = await prisma.lesson.findMany({
    include: {
      problems: { select: { question: true } },
      topic: {
        include: {
          level: { include: { grade: { include: { subject: true } }, subject: true } },
          questionnaire: { include: { level: { include: { subject: true } } } },
        },
      },
    },
  });

  let work: WorkItem[] = lessons
    .filter((l) => force || !summaries[l.id]) // تخطَّ الموجود إلا مع --force
    .filter((l) => !filter || filter.test(l.title))
    .map((l) => {
      const ctx = deriveContext(l.topic);
      return {
        id: l.id,
        title: l.title,
        description: l.description,
        subject: ctx.subject,
        grade: ctx.grade,
        level: ctx.level,
        topic: l.topic.nameAr,
        problems: l.problems.map((p) => p.question),
      };
    });
  if (limit > 0) work = work.slice(0, limit);
  if (force || filter) console.log(`♻️  وضع إعادة التوليد${filter ? ` (فلتر عنوان: ${filterArg})` : ''}.`);

  console.log(`📝 دروس تحتاج ملخّصاً: ${work.length} (موجود مسبقاً: ${Object.keys(summaries).length})`);
  if (!work.length) {
    console.log('✅ لا جديد — كل الدروس ملخّصة.');
    return;
  }

  let done = 0;
  let failed = 0;
  let sinceWrite = 0;
  const queue = [...work];

  async function worker() {
    for (;;) {
      const item = queue.shift();
      if (!item) return;
      try {
        const summary = await generateOne(item);
        if (summary) {
          summaries[item.id] = summary;
          sinceWrite++;
        } else {
          failed++;
        }
      } catch (e) {
        failed++;
        console.warn(`⚠️  فشل: ${item.title.slice(0, 40)}…`, e instanceof Error ? e.message : e);
      }
      done++;
      if (done % 10 === 0) console.log(`  … ${done}/${work.length} (فشل: ${failed})`);
      if (sinceWrite >= 5) {
        writeFileSync(OUT_PATH, JSON.stringify(summaries, null, 2) + '\n', 'utf8');
        sinceWrite = 0;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  writeFileSync(OUT_PATH, JSON.stringify(summaries, null, 2) + '\n', 'utf8');
  console.log(`✅ تم. مولّد الآن: ${Object.keys(summaries).length} ملخّص (فشل هذه الجولة: ${failed}).`);
  console.log(`   الملف: ${OUT_PATH}`);
}

run()
  .catch((e) => {
    console.error('خطأ غير متوقّع:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
