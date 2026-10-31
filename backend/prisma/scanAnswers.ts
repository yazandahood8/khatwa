/**
 * فحص لمرّة واحدة — scan stored problem answers for formats the checker may reject.
 * يبرز المسائل التي جوابها كسر/عشري/نسبة مع answerTolerance=0 (الأكثر عرضة لرفض إجابة صحيحة).
 * تشغيل: npx tsx backend/prisma/scanAnswers.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AR = '٠١٢٣٤٥٦٧٨٩';
const ascii = (s: string) => s.replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));

/** يصنّف شكل الجواب — classify one answer token's shape. */
function classify(raw: string): 'fraction' | 'percent' | 'decimal' | 'integer' | 'symbolic' | 'multi' {
  const s = ascii(raw).trim().toLowerCase().replace(/\s+/g, '');
  if (/(أو|،|,|;|\bor\b|\|)/.test(ascii(raw))) return 'multi';
  if (/^-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?$/.test(s.replace(/^[a-z]=/, ''))) return 'fraction';
  if (/^-?\d+(?:\.\d+)?%$/.test(s.replace(/^[a-z]=/, ''))) return 'percent';
  const bare = s.replace(/^[a-z]=/, '');
  if (/^-?\d+\.\d+$/.test(bare)) return 'decimal';
  if (/^-?\d+$/.test(bare)) return 'integer';
  return 'symbolic';
}

/** يحسب القيمة العددية لرمز مفرد (عدد/كسر/نسبة) — mirrors answerCheck.toValue. */
function toValue(tok: string): number | null {
  const s = ascii(tok).replace(/\s+/g, '').replace(/^[a-z]=/, '');
  const pct = s.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (pct) return Number(pct[1]) / 100;
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) { const d = Number(frac[2]); return d !== 0 ? Number(frac[1]) / d : null; }
  const n = Number(s);
  return Number.isFinite(n) && s !== '' ? n : null;
}

async function main() {
  const problems = await prisma.problem.findMany({
    where: { language: null }, // مسائل رياضيات/عربية بجواب نصّي (لا كود)
    select: {
      id: true,
      question: true,
      finalAnswer: true,
      answerTolerance: true,
      topic: { select: { nameAr: true } },
    },
  });

  const buckets: Record<string, { id: string; ans: string; tol: number; topic: string; q: string }[]> = {
    fraction: [], percent: [], decimal: [], integer: [], symbolic: [], multi: [],
  };

  for (const p of problems) {
    const ans = (p.finalAnswer ?? '').trim();
    if (!ans) continue;
    buckets[classify(ans)].push({
      id: p.id,
      ans,
      tol: p.answerTolerance,
      topic: p.topic?.nameAr ?? '—',
      q: p.question.slice(0, 60),
    });
  }

  const total = problems.length;
  console.log(`\n=== فحص إجابات ${total} مسألة (بجواب نصّي) ===\n`);
  for (const k of ['fraction', 'percent', 'decimal', 'multi', 'integer', 'symbolic'] as const) {
    console.log(`${k.padEnd(9)} : ${buckets[k].length}`);
  }

  // الأخطر: عشري بهامش 0 (تقريب الطالب سيُرفض) — decimals with tolerance 0
  const riskyDecimals = buckets.decimal.filter((b) => b.tol === 0);
  console.log(`\n--- ⚠️  عشري + tolerance=0 (تقريب الطالب سيُرفض): ${riskyDecimals.length} مسألة ---`);
  for (const b of riskyDecimals) {
    console.log(`  [${b.id}] ans="${b.ans}" tol=${b.tol}  «${b.topic}»  ${b.q}`);
  }

  // كسور: الآن مدعومة بالمطابقة العددية، لكن نُبرز التي قد يعطي الطالب صيغتها العشرية غير المنتهية
  const nonTerminating = buckets.fraction.filter((b) => {
    const v = toValue(b.ans);
    return v !== null && !Number.isInteger(v * 10000) && b.tol === 0;
  });
  console.log(`\n--- ℹ️  كسر بقيمة عشرية غير منتهية + tolerance=0 (لو كتبها الطالب عشرية مقرّبة تُرفض): ${nonTerminating.length} مسألة ---`);
  for (const b of nonTerminating) {
    console.log(`  [${b.id}] ans="${b.ans}" (=${toValue(b.ans)?.toFixed(4)}) tol=${b.tol}  «${b.topic}»  ${b.q}`);
  }

  // نسب مئوية بهامش 0
  const riskyPct = buckets.percent.filter((b) => b.tol === 0);
  console.log(`\n--- ℹ️  نسبة مئوية + tolerance=0: ${riskyPct.length} مسألة ---`);
  for (const b of riskyPct) {
    console.log(`  [${b.id}] ans="${b.ans}" tol=${b.tol}  «${b.topic}»  ${b.q}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
