/**
 * تعبئة answerTolerance للمسائل ذات الجواب العشري (tolerance=0) — reviewable backfill.
 *
 * يكمّل إصلاح المدقّق: المدقّق يَقبل تلقائياً تقريب الطالب بمنزلتين فأكثر، لكن هذا السكربت
 * يضبط هامشاً صريحاً في البيانات ليقبل أيضاً تقريباً أخشن (مثل تقريب المال لأقرب شيكل).
 *
 * افتراضياً DRY-RUN (يطبع المقترح فقط). للتطبيق الفعلي:  npx tsx prisma/backfillTolerance.ts --apply
 * لتضمين الكسور غير المنتهية أيضاً:                        ... --include-fractions
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const APPLY = process.argv.includes('--apply');
const INCLUDE_FRACTIONS = process.argv.includes('--include-fractions');

const AR = '٠١٢٣٤٥٦٧٨٩';
const ascii = (s: string) => s.replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));

function toValue(token: string): number | null {
  const s = ascii(token).replace(/\s+/g, '').replace(/^[a-z]=/, '');
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) { const d = Number(frac[2]); return d !== 0 ? Number(frac[1]) / d : null; }
  const n = Number(s);
  return Number.isFinite(n) && s !== '' ? n : null;
}

const isSingleDecimal = (a: string) => /^-?\d+\.\d+$/.test(ascii(a).replace(/\s+/g, '').replace(/^[a-z]=/, ''));
const isSingleFraction = (a: string) =>
  /^-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?$/.test(ascii(a).replace(/\s+/g, '').replace(/^[a-z]=/, ''));

/** هامش مقترح حسب حجم القيمة — accept sensible rounding without over-loosening. */
function proposeTolerance(v: number): number {
  const abs = Math.abs(v);
  if (abs <= 1) return 0.01; // احتمالات / نسب مثلثية
  if (abs < 100) return 0.05; // قيم صغيرة
  if (abs < 1000) return 0.5; // مبالغ متوسطة
  return 1; // مبالغ كبيرة (فائدة مركّبة…)
}

async function main() {
  const problems = await prisma.problem.findMany({
    where: { language: null, answerTolerance: 0 },
    select: { id: true, finalAnswer: true, question: true, topic: { select: { nameAr: true } } },
  });

  const targets: { id: string; ans: string; v: number; tol: number; topic: string; q: string; kind: string }[] = [];
  for (const p of problems) {
    const ans = (p.finalAnswer ?? '').trim();
    if (!ans) continue;
    const decimal = isSingleDecimal(ans);
    const fraction = INCLUDE_FRACTIONS && isSingleFraction(ans);
    if (!decimal && !fraction) continue;
    const v = toValue(ans);
    if (v === null) continue;
    // الكسور المنتهية (1/2) لا تحتاج هامشاً — القيمة تُطابَق بدقّة
    if (fraction && Number.isInteger(v * 10000) === false && !INCLUDE_FRACTIONS) continue;
    targets.push({
      id: p.id, ans, v, tol: proposeTolerance(v),
      topic: p.topic?.nameAr ?? '—', q: p.question.slice(0, 50), kind: decimal ? 'decimal' : 'fraction',
    });
  }

  console.log(`\n=== backfill answerTolerance — ${APPLY ? 'APPLY' : 'DRY-RUN'} ${INCLUDE_FRACTIONS ? '(+fractions)' : ''} ===`);
  console.log(`مرشّحة: ${targets.length} مسألة\n`);
  const byTol: Record<string, number> = {};
  for (const t of targets) {
    byTol[t.tol] = (byTol[t.tol] ?? 0) + 1;
    console.log(`  ${t.kind.padEnd(8)} ans="${t.ans}" → tol=${t.tol}  «${t.topic}»  ${t.q}`);
  }
  console.log('\nتوزيع الهامش المقترح:');
  for (const [tol, n] of Object.entries(byTol)) console.log(`  tol=${tol} : ${n}`);

  if (!APPLY) {
    console.log('\n(معاينة فقط — أعد التشغيل مع --apply للكتابة)');
    return;
  }

  let updated = 0;
  for (const t of targets) {
    await prisma.problem.update({ where: { id: t.id }, data: { answerTolerance: t.tol } });
    updated++;
  }
  console.log(`\n✅ حُدّثت ${updated} مسألة.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
