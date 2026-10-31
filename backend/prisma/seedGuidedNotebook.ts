/**
 * زرع رسم الحلّ الموجّه لمسألة الدفاتر/الأقلام — seed the guided solve graph for one problem.
 * قالب يُحتذى لبقيّة المسائل: عرّف المحطّات (بالترتيب) والأخطاء المعروفة، والباقي على المحرّك.
 *
 * تشغيل:  npx tsx prisma/seedGuidedNotebook.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PROBLEM_ID = 'cmqzjp1vo0042nbs81w2wx0d4'; // "ثمن 3 دفاتر وقلمين، ثم عند x=6"

const MILESTONES = [
  { orderIndex: 0, label: 'ثمن 3 دفاتر = 3x', targetExpr: '3x', required: false,
    praise: 'تمام، 3 دفاتر يعني 3x 👍', nextHint: 'هلّق احسب ثمن القلمين.' },
  { orderIndex: 1, label: 'ثمن قلمين = 8', targetExpr: '2*4', required: false,
    praise: 'صح، قلمين = 2×4 = 8 👍', nextHint: 'اجمع الاثنين بتعبير واحد.' },
  { orderIndex: 2, label: 'التعبير 3x+8', targetExpr: '3x+8', required: true,
    praise: 'ممتاز! هاد هو التعبير: 3x + 8 🎯', nextHint: 'عوّض x = 6 واحسب القيمة.' },
  { orderIndex: 3, label: 'القيمة عند x=6 ⟶ 26', targetExpr: '26', required: true,
    praise: 'أحسنت! القيمة عند x=6 هي 26 ✅', nextHint: null },
];

const WRONG = [
  { matchExpr: '5x', message: 'ما بتقدر تجمع الدفاتر مع الأقلام — الدفتر ثمنه x والقلم ثمنه 4، مختلفين. خليهم منفصلين.' },
  { matchExpr: '3x+4', message: 'قرّبت! بس عندك قلمين مش قلم واحد: 2 × 4 = 8، مش 4.' },
  { matchExpr: '3x+2', message: 'الـ2 هي عدد الأقلام، وثمن القلم 4 — لازم تضرب 2 × 4.' },
  { matchExpr: '7x', message: 'ما منجمع 3 و4 — الـ4 هو ثمن القلم مش عدد دفاتر.' },
  { matchExpr: '36', message: 'انتبه: 3 × 6 = 18، مش 36.' },
  { matchExpr: '24', message: 'راجع الجمع: 18 + 8 = ؟ (مش 24).' },
  { matchExpr: '28', message: 'راجع الجمع: 18 + 8 = ؟ (مش 28).' },
];

const FALLBACK = 'ابدأ بثمن 3 دفاتر (كل دفتر x)، وبعدها ثمن القلمين.';

async function main() {
  const p = await prisma.problem.findUnique({ where: { id: PROBLEM_ID } });
  if (!p) throw new Error('المسألة غير موجودة: ' + PROBLEM_ID);

  // idempotent: امسح القديم وأعد الزرع
  await prisma.solveMilestone.deleteMany({ where: { problemId: PROBLEM_ID } });
  await prisma.solveWrongPattern.deleteMany({ where: { problemId: PROBLEM_ID } });

  await prisma.solveMilestone.createMany({ data: MILESTONES.map((m) => ({ ...m, problemId: PROBLEM_ID })) });
  await prisma.solveWrongPattern.createMany({ data: WRONG.map((w) => ({ ...w, problemId: PROBLEM_ID })) });
  await prisma.problem.update({ where: { id: PROBLEM_ID }, data: { guidedFallbackHint: FALLBACK } });

  console.log(`✅ زُرع رسم الحلّ: ${MILESTONES.length} محطّة + ${WRONG.length} خطأ معروف لـ ${PROBLEM_ID}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
