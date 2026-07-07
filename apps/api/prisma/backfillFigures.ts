/**
 * تعبئة المخططات الهندسية (figure) على المسائل الموجودة مسبقاً في قاعدة البيانات
 * دون إعادة زرع مُدمِّرة — backfill Problem.figure onto already‑seeded rows.
 *
 * يمرّ على كل مسائل المولّدات التي تحمل `figure`، ويطابقها بنص السؤال داخل موضوعها
 * (grade|topic) ثم يحدّث العمود. آمن للتكرار (idempotent).
 *
 * تشغيل:  npm --workspace apps/api run db:backfill-figures
 */
import { PrismaClient, type Prisma } from '@prisma/client';
import { LESSON_PROBLEMS } from './generators';
import { CS_PROBLEMS, CS_FIGURES, CS_EXPLAIN } from './csGenerators';

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  let missing = 0;
  let withFigure = 0;

  // --- رياضيات: المخطط مرفق بالمسألة نفسها، والمطابقة حسب الصف + الموضوع ---
  for (const [key, gen] of Object.entries(LESSON_PROBLEMS)) {
    const [gradeStr, topicName] = key.split('|');
    const gradeNumber = Number(gradeStr);

    for (const p of gen()) {
      if (!p.figure) continue;
      withFigure++;

      const res = await prisma.problem.updateMany({
        where: {
          question: p.question,
          topic: { nameAr: topicName, level: { grade: { gradeNumber } } },
        },
        data: { figure: p.figure as unknown as Prisma.InputJsonValue },
      });

      if (res.count > 0) updated += res.count;
      else {
        missing++;
        console.warn(`  ⚠ لم يُعثر على مسألة مطابقة: [${key}] ${p.question.slice(0, 40)}…`);
      }
    }
  }

  // --- علوم الحاسوب: المخطط في CS_FIGURES بمفتاح `${مفتاح الدرس}#${الترتيب}`، والمطابقة حسب المستوى (3/5 وحدات) + الموضوع ---
  let explainUpdated = 0;
  for (const [key, gen] of Object.entries(CS_PROBLEMS)) {
    const [level, topicName] = key.split('|');
    const problems = gen();
    for (let idx = 0; idx < problems.length; idx++) {
      const csKey = `${key}#${idx}`;
      const where = { question: problems[idx].question, topic: { nameAr: topicName, level: { name: level } } };

      // سؤال مفاهيمي → kind='explain' (واجهة الشرح الحرّ)
      if (CS_EXPLAIN.has(csKey)) {
        const kr = await prisma.problem.updateMany({ where, data: { kind: 'explain' } });
        if (kr.count > 0) explainUpdated += kr.count;
        else console.warn(`  ⚠ لم يُعثر على مسألة CS (explain): [${csKey}] ${problems[idx].question.slice(0, 40)}…`);
      }

      const fig = CS_FIGURES[csKey];
      if (!fig) continue;
      withFigure++;
      const res = await prisma.problem.updateMany({ where, data: { figure: fig as unknown as Prisma.InputJsonValue } });
      if (res.count > 0) updated += res.count;
      else {
        missing++;
        console.warn(`  ⚠ لم يُعثر على مسألة CS مطابقة: [${csKey}] ${problems[idx].question.slice(0, 40)}…`);
      }
    }
  }

  console.log(`✔ تعبئة المخططات: ${updated} مسألة محدّثة من أصل ${withFigure} تحمل مخططاً (${missing} غير موجودة).`);
  console.log(`✔ أسئلة الشرح (explain): ${explainUpdated} مسألة CS محدّثة.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
