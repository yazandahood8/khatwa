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
  level: string; // مستوى الطالب المشتقّ من المفتاح — درّج لغة التلميح حسبه
  simple: boolean; // صفوف 7–9 أو مستوى أساسي — لغة يومية بحتة بلا أسماء قوانين
  problem: GenProblem;
};

/** يشتقّ وصف المستوى من الجزء الأول للمفتاح (صف 7–12 أو رقم نموذج بجروت). */
function levelFromKey(first: string, isQuestionnaire: boolean): { level: string; simple: boolean } {
  if (isQuestionnaire) {
    const units = { '3': '3 وحدات', '4': '4 وحدات', '5': '5 وحدات', '1': 'مستوى أساسي' }[first[0]] ?? 'بجروت';
    return { level: `بجروت ${units} (نموذج ${first})`, simple: first[0] === '1' || first[0] === '3' };
  }
  const g = Number(first);
  return { level: `صف ${first}`, simple: g >= 7 && g <= 9 };
}

/** يبني قائمة العمل: الخطوة الأولى لكل مسألة رياضيات، بلا تكرار للمفاتيح. */
function collectWork(seen: Set<string>, opts: { force: boolean; filter: RegExp | null; existing: Record<string, string> }): WorkItem[] {
  const work: WorkItem[] = [];
  const maps: { map: Record<string, LessonGen>; isQ: boolean }[] = [
    { map: LESSON_PROBLEMS, isQ: false },
    { map: QUESTIONNAIRE_PROBLEMS, isQ: true },
  ];
  for (const { map, isQ } of maps) {
    for (const [mapKey, gen] of Object.entries(map)) {
      const [first, topicPart] = mapKey.split('|');
      const topic = topicPart ?? 'رياضيات';
      const { level, simple } = levelFromKey(first, isQ);
      let problems: GenProblem[];
      try {
        problems = gen();
      } catch (e) {
        console.warn(`⚠️  فشل توليد مسائل ${mapKey}:`, e instanceof Error ? e.message : e);
        continue;
      }
      for (const problem of problems) {
        const step = problem.method.steps[0];
        if (!step) continue;
        // بلا --force: نتخطّى الخطوات التي لها تلميح أصلاً (مؤلَّف يدوياً). مع --force: نعيد توليد الكل.
        if (!opts.force && step.hint.trim()) continue;
        const key = hintKey(problem.question, step.description, step.expression);
        if (seen.has(key)) continue; // مفتاح مكرّر أو مُعالَج
        // --filter: أعد توليد فقط ما تلميحه الحالي (المخزّن) يطابق النمط (لإصلاح التلميحات المبهمة)
        if (opts.filter && !opts.filter.test(opts.existing[key] ?? '')) continue;
        seen.add(key);
        work.push({ key, topic, level, simple, problem });
      }
    }
  }
  return work;
}

function buildPrompt(item: WorkItem): string {
  const { topic, level, problem } = item;
  const solution = problem.method.steps
    .map((s, i) => `${i + 1}. ${s.description} ⟶ ${s.expression}`)
    .join('\n');
  const mistakes = problem.commonMistakes.length
    ? problem.commonMistakes.map((m) => `- ${m.description}: ${m.correction}`).join('\n')
    : 'لا يوجد';
  return `مستوى الطالب: ${level}  |  الصعوبة: ${problem.difficulty}
الموضوع: ${topic}
السؤال: ${problem.question}

الحل الكامل (سرّي — للاسترشاد فقط، لا تكشفه):
${solution}
الجواب النهائي (سرّي): ${problem.finalAnswer}

أخطاء شائعة:
${mistakes}

المطلوب: اكتب تلميحاً واحداً قصيراً جداً يساعد الطالب على **الخطوة الأولى فقط** (رقم 1)، يوجّهه لكيف يبدأ دون أن تكشف له ناتج الخطوة ولا الجواب النهائي. عيّر لغته لمستوى الطالب أعلاه.`;
}

const SYSTEM = `أنت معلّم رياضيات سقراطي ولطيف للطلاب العرب في إسرائيل. مهمّتك صياغة تلميح بداية واحد لكل مسألة، مناسب لمستوى الطالب المذكور.

قواعد صارمة:
- تلميح واحد فقط، قصير جداً (من 3 إلى 14 كلمة)، بالعربي العامي الفلسطيني المبسّط والمشجّع. ممكن يكون سؤالاً موجّهاً.
- وجّه الطالب لأوّل خطوة عملية: شو يعمل أوّل إشي؟ لا تُعطِ ناتج الخطوة ولا الجواب النهائي.
- **الأهمّ — بسّط اللغة حسب المستوى ولا تخوّف الطالب:**
  • لا ترمِ اسم قانون أو مصطلح صعب لحاله («فكّر بالتوزيع الثنائي»، «طبّق برنولي»، «استخدم قانون جيب التمام») — هذا بيحبط الطالب الضعيف.
  • إن اضطررت لمصطلح تقنيّ، اشرحه بكلمتين بسيطتين جنبه أو استبدله بالفكرة العملية الملموسة.
    ✗ سيّئ: «فكّر بصيغة الاحتمال الثنائي».  ✓ جيّد: «كم طريقة يطلع فيها ٦ مرّة وحدة بس من ٣ رميات؟».
    ✗ سيّئ: «طبّق قانون جيب التمام».  ✓ جيّد: «عندك الأضلاع الثلاثة وبدّك زاوية — أيّ قانون بيربطهم؟».
  • لمستوى «صف 7–9» أو «أساسي»: لغة يومية بحتة، بلا أسماء قوانين إطلاقاً.
  • لمستوى «4 وحدات / 5 وحدات»: مسموح المصطلح المنهجيّ المعروف (مشتقة، تكامل…) بس مربوط بفعلٍ واضح لا مرمِيّ لحاله.
- ابدأ بفعل أو سؤال ملموس مثل: «جرّب…»، «شوف…»، «ابدأ بـ…»، «أيّ…»، «كم…».
- ممنوع الصياغات المبهمة أو المبتورة (مثل «ذري ثنائي C(n,k)»).
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
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const filterArg = args.find((a) => a.startsWith('--filter='))?.slice('--filter='.length);
  const filter = filterArg ? new RegExp(filterArg) : null;
  const limit = Number(args.find((a) => /^\d+$/.test(a))) || 0; // 0 = بلا حد (تشغيل كامل)

  const hints: Record<string, string> = existsSync(OUT_PATH)
    ? JSON.parse(readFileSync(OUT_PATH, 'utf8'))
    : {};

  // مع --force/--filter نعيد التوليد فوق مفاتيح موجودة، فلا نضعها في seen مسبقاً.
  const seen = new Set<string>(force || filter ? [] : Object.keys(hints));
  let work = collectWork(seen, { force, filter, existing: hints });
  if (limit > 0) work = work.slice(0, limit);
  if (force || filter) console.log(`♻️  وضع إعادة التوليد${filter ? ` (فلتر: ${filterArg})` : ''} — سيُحدّث ما يُطابق فوق الموجود.`);

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
