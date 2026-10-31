/**
 * إصلاح يدويّ لتلميحات البداية المبهمة — hand-authored plain-language starter hints
 * للمسائل التي كان تلميحها يرمي اسم قانون/مصطلح دون مساعدة (احتمال ثنائي، قانون جيب التمام…).
 *
 * مؤقّت: بديل بلا AI ريثما يُرفع سقف استهلاك Anthropic (يتجدّد 2026-08-01)، وقتها يُعاد
 * التوليد الكامل بالبرومبت المحسّن: hints:generate --force ثم hints:backfill --force.
 *
 * يحدّث تلميح الخطوة الأولى للطريقة الموصى بها لكل مسألة (بالمعرّف)، ويزامن generatedHints.json.
 * معاينة:  npx tsx prisma/applyHintOverrides.ts
 * تطبيق:   npx tsx prisma/applyHintOverrides.ts --apply
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { hintKey } from './hintKey';
//
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const HINTS_PATH = join(__dirname, 'generatedHints.json');

/** معرّف المسألة ⟶ تلميح بداية بلغة بسيطة موجّهة لأوّل خطوة عملية (بلا كشف الجواب). */
const OVERRIDES: Record<string, string> = {
  // احتمالات — التوزيع الثنائي (بلا رمي اسم الصيغة)
  cmrch4n3j02wib6fnkjksrqe9: 'الـ6 لازم تطلع مرّة وحدة بالضبط من 3 رميات — بكم ترتيب ممكن تصير؟ وشو احتمال كل ترتيب؟',
  cmrch4pwt02x0b6fnj7wjpx4k: 'كم طريقة تجي فيها إصابتين بالضبط من 3 طلقات؟ وبعدها شو احتمال كل حالة؟',
  cmqzk57vy03dwnbs8wm4upv5z: 'من 5 محاولات، بكم طريقة يجوا 4 نجاحات؟ وبعدين اضرب باحتمال كل حالة.',
  cmqzk58f203e0nbs8i6ockhir: 'كل سؤال نجاح أو فشل باحتمال ½ — بكم طريقة تطلع 7 صح من 10؟',
  cmqzk59th03eanbs8fxdamrb0: 'التوقّع لهيك متغيّر = عدد المحاولات × احتمال النجاح لكل وحدة. جرّب طبّقها.',
  cmqzk5aco03eenbs8urduwqmr: 'ابدأ بالتوقّع (عدد المحاولات × احتمال النجاح)، وبعدها الانحراف من n·p·q.',
  cmrcgyjom01rvb6fnz7jl5urd: 'بدّك تعكس الشرط: فكّر باحتمال (الأولى ومعيبة) ÷ احتمال (معيبة كلياً).',
  // توزيع طبيعي
  cmqzk0jc402gunbs8j665g4j7: 'منحنى التوزيع متماثل حوالين المتوسط — قدّيش النسبة اللي تحت المتوسط بالضبط؟',
  cmqzk0eh302funbs8vdb7mzhm: 'تذكّر قاعدة 68–95–99.7 — قدّيش بتغطّي المنطقة ضمن انحراف واحد؟',
  // مثلثات — قانون جيب التمام (اربطه بالمعطيات بدل رمي اسمه)
  cmqzk1wsp02qcnbs8ox1yqqor: 'معروف عندك الأضلاع الثلاثة وبدّك زاوية — اكتب العلاقة اللي بتربط الأضلاع الثلاثة مع cos الزاوية.',
  cmrch5gbx032eb6fnhjpx2sdd: 'عندك ضلعين والزاوية اللي بينهم وبدّك الضلع الثالث — اكتب العلاقة اللي بتربطهم (فيها cos الزاوية).',
  cmrcgzumv01x5b6fnnjr2epq8: 'معروف عندك الأضلاع الثلاثة وبدّك زاوية — رتّب العلاقة لتعزل cos للزاوية المطلوبة.',
};

async function main() {
  const ids = Object.keys(OVERRIDES);
  const problems = await prisma.problem.findMany({
    where: { id: { in: ids } },
    include: { methods: { include: { steps: { orderBy: { stepNumber: 'asc' } } } } },
  });
  const jsonHints: Record<string, string> = existsSync(HINTS_PATH)
    ? JSON.parse(readFileSync(HINTS_PATH, 'utf8'))
    : {};

  let updated = 0;
  const stepUpdates: { id: string; hint: string }[] = [];
  for (const pr of problems) {
    const approved = pr.methods.filter((m) => m.isApproved);
    const method = approved.find((m) => m.isRecommended) ?? approved[0];
    const step = method?.steps[0];
    if (!step) {
      console.warn(`⚠️  ${pr.id} — لا خطوة أولى`);
      continue;
    }
    const next = OVERRIDES[pr.id];
    console.log(`\n${pr.id}`);
    console.log(`  Q:    ${pr.question.slice(0, 80)}`);
    console.log(`  قبل:  ${step.hint}`);
    console.log(`  بعد:  ${next}`);
    stepUpdates.push({ id: step.id, hint: next });
    jsonHints[hintKey(pr.question, step.description, step.expression)] = next; // زامن JSON
    updated++;
  }

  const missing = ids.filter((id) => !problems.some((p) => p.id === id));
  if (missing.length) console.warn(`\n⚠️  غير موجودة بالـ DB: ${missing.join(', ')}`);

  if (!APPLY) {
    console.log(`\n(معاينة — ${updated} تلميح سيُحدّث. أعد التشغيل مع --apply)`);
    return;
  }

  for (const u of stepUpdates) {
    await prisma.solutionStep.update({ where: { id: u.id }, data: { hint: u.hint } });
  }
  writeFileSync(HINTS_PATH, JSON.stringify(jsonHints, null, 2) + '\n', 'utf8');
  console.log(`\n✅ حُدّث ${updated} تلميح في الـ DB + زُومن generatedHints.json.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
