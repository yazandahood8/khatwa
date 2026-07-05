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

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  let missing = 0;
  let withFigure = 0;

  for (const [key, gen] of Object.entries(LESSON_PROBLEMS)) {
    const [gradeStr, topicName] = key.split('|');
    const gradeNumber = Number(gradeStr);

    for (const p of gen()) {
      if (!p.figure) continue;
      withFigure++;

      // مطابقة دقيقة: نص السؤال داخل الموضوع الصحيح (الصف + اسم الموضوع).
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

  console.log(`✔ تعبئة المخططات: ${updated} مسألة محدّثة من أصل ${withFigure} تحمل مخططاً (${missing} غير موجودة).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
