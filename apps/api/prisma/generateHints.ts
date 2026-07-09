/**
 * مولّد تلميحات البداية — one-time generator of real first-step hints for math problems.
 *
 * يقرأ مسائل الرياضيات من المصدر (LESSON_PROBLEMS + QUESTIONNAIRE_PROBLEMS)، ولكل مسألة
 * يأخذ الخطوة الأولى من الطريقة الموصى بها؛ إذا كان تلميحها فارغاً يولّد تلميحاً سقراطياً
 * قصيراً عبر Claude اعتماداً على الحل الصحيح (السرّي)، ويكتبه في prisma/generatedHints.json.
 *
 * حتمي وقابل للاستئناف: يتخطّى ما هو موجود مسبقاً في الملف، فيمكن تشغيله على دفعات.
 * تشغيل كامل:  npm run hints:generate --workspace=apps/api
 * تجربة سريعة: npm run hints:generate --workspace=apps/api -- 5   (أول 5 فقط)
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../src/utils/env';
import { LESSON_PROBLEMS, type GenProblem, type LessonGen } from './generators';
import { QUESTIONNAIRE_PROBLEMS } from './questionnaireProblems';
import { hintKey } from './hintKey';

const GEN_MODEL = 'claude-sonnet-4-6';
const OUT_PATH = join(__dirname, 'generatedHints.json');
const CONCURRENCY = 5;

if (!env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY مفقود في .env — لا يمكن توليد التلميحات');
  process.exit(1);
}
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

type WorkItem = {
  key: string;
  topic: string;
  problem: GenProblem;
};

/** يبني قائمة العمل: أول خطوة فارغة التلميح لكل مسألة رياضيات، بلا تكرار للمفاتيح. */
function collectWork(seen: Set<string>): WorkItem[] {
  const work: WorkItem[] = [];
  const maps: Record<string, LessonGen>[] = [LESSON_PROBLEMS, QUESTIONNAIRE_PROBLEMS];
  for (const map of maps) {
    for (const [mapKey, gen] of Object.entries(map)) {
      const topic = mapKey.split('|')[1] ?? 'رياضيات';
      let problems: GenProblem[];
      try {
        problems = gen();
      } catch (e) {
        console.warn(`⚠️  فشل توليد مسائل ${mapKey}:`, e instanceof Error ? e.message : e);
        continue;
      }
      for (const problem of problems) {
        const step = problem.method.steps[0];
        if (!step || step.hint.trim()) continue; // لا خطوة أو التلميح موجود مسبقاً
        const key = hintKey(problem.question, step.description, step.expression);
        if (seen.has(key)) continue; // مفتاح مكرّر أو مولّد سابقاً
        seen.add(key);
        work.push({ key, topic, problem });
      }
    }
  }
  return work;
}

function buildPrompt(item: WorkItem): string {
  const { topic, problem } = item;
  const solution = problem.method.steps
    .map((s, i) => `${i + 1}. ${s.description} ⟶ ${s.expression}`)
    .join('\n');
  const mistakes = problem.commonMistakes.length
    ? problem.commonMistakes.map((m) => `- ${m.description}: ${m.correction}`).join('\n')
    : 'لا يوجد';
  return `الموضوع: ${topic}
السؤال: ${problem.question}

الحل الكامل (سرّي — للاسترشاد فقط، لا تكشفه):
${solution}
الجواب النهائي (سرّي): ${problem.finalAnswer}

أخطاء شائعة:
${mistakes}

المطلوب: اكتب تلميحاً واحداً قصيراً جداً يساعد الطالب على **الخطوة الأولى فقط** (رقم 1)، يوجّهه لكيف يبدأ دون أن تكشف له ناتج الخطوة ولا الجواب النهائي.`;
}

const SYSTEM = `أنت معلّم رياضيات سقراطي للطلاب العرب في إسرائيل. مهمّتك صياغة تلميح بداية واحد لكل مسألة.
قواعد صارمة:
- تلميح واحد فقط، قصير جداً (من 3 إلى 12 كلمة).
- يوجّه الطالب لأول خطوة/فكرة كيف يبدأ، لا يعطي الناتج ولا الجواب النهائي.
- بالعربي العامي المبسّط المشجّع (لهجة فلسطينية مبسّطة)، ويمكن أن يكون سؤالاً موجّهاً.
- أمثلة للأسلوب المطلوب: «ما نوع هاي المعادلة؟» ، «انتبه الإشارة بتنقلب» ، «فكّر بعددين ضربهم الحد الثابت».
- أخرج نصّ التلميح فقط: سطر واحد، بلا علامات اقتباس، بلا ترقيم، بلا مقدّمات مثل «تلميح:».`;

/** ينظّف ناتج النموذج إلى سطر تلميح واحد. */
function clean(text: string): string {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)[0]
    ?.replace(/^["'«»]+|["'«»]+$/g, '')
    .replace(/^تلميح\s*[:：-]\s*/, '')
    .trim() ?? '';
}

async function generateOne(item: WorkItem): Promise<string> {
  const msg = await anthropic.messages.create({
    model: GEN_MODEL,
    max_tokens: 100,
    system: SYSTEM,
    messages: [{ role: 'user', content: buildPrompt(item) }],
  });
  const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  return clean(text);
}

/** ينفّذ العمل بتوازٍ محدود ويكتب الملف تدريجياً. */
async function run() {
  const limit = Number(process.argv[2]) || 0; // 0 = بلا حد (تشغيل كامل)
  const hints: Record<string, string> = existsSync(OUT_PATH)
    ? JSON.parse(readFileSync(OUT_PATH, 'utf8'))
    : {};

  const seen = new Set<string>(Object.keys(hints));
  let work = collectWork(seen);
  if (limit > 0) work = work.slice(0, limit);

  console.log(`📝 مسائل تحتاج تلميح بداية: ${work.length} (موجود مسبقاً: ${Object.keys(hints).length})`);
  if (!work.length) {
    console.log('✅ لا جديد — كل تلميحات البداية مولّدة.');
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
        const hint = await generateOne(item);
        if (hint) {
          hints[item.key] = hint;
          sinceWrite++;
        } else {
          failed++;
        }
      } catch (e) {
        failed++;
        console.warn(`⚠️  فشل: ${item.problem.question.slice(0, 40)}…`, e instanceof Error ? e.message : e);
      }
      done++;
      if (done % 25 === 0) console.log(`  … ${done}/${work.length} (فشل: ${failed})`);
      if (sinceWrite >= 10) {
        writeFileSync(OUT_PATH, JSON.stringify(hints, null, 2) + '\n', 'utf8');
        sinceWrite = 0;
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  writeFileSync(OUT_PATH, JSON.stringify(hints, null, 2) + '\n', 'utf8');
  console.log(`✅ تم. مولّد الآن: ${Object.keys(hints).length} تلميح (فشل هذه الجولة: ${failed}).`);
  console.log(`   الملف: ${OUT_PATH}`);
}

run().catch((e) => {
  console.error('خطأ غير متوقّع:', e);
  process.exit(1);
});
