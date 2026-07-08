/**
 * Seed — هيكل مادة الإنجليزية (إنجليزي) فقط، بلا محتوى.
 * يبني نفس شكل الرياضيات: صفوف 7-9 بمستوى موحّد + مسارات الوحدات 10-12 (3/4/5).
 * المواضيع/الدروس/التمارين والشالونات (وحدات البجروت) تُضاف لاحقاً من بحث المالك،
 * إمّا عبر لوحة إدارة المحتوى أو ملف englishContent.ts على غرار questionnaireContent.ts.
 *
 * Idempotent: الصفوف/المستويات تُنشأ فقط إن لم توجد. لا يمسّ الرياضيات أو علوم الحاسوب.
 * يُستدعى من seed.ts مع تمرير عميل Prisma (لأن seed.ts يشغّل main() عند الاستيراد).
 */
import type { PrismaClient, Prisma } from '@prisma/client';
import { ENGLISH_GRADE7, type EnExercise, type EnSkill } from './englishContent';

// صفوف التعليم الإعدادي — مستوى موحّد (مثل الرياضيات).
const ENGLISH_GRADES = [7, 8, 9];

// مسارات الوحدات للثانوي (10-12) — الشالونات/وحدات البجروت تُضاف لاحقاً.
const ENGLISH_TRACKS = [3, 4, 5];

export async function seedEnglish(prisma: PrismaClient, subjectId: string) {
  // صفوف 7-9 بمستوى موحّد (فارغة — المواضيع تُضاف لاحقاً)
  let grades = 0;
  for (const gradeNumber of ENGLISH_GRADES) {
    const grade = await prisma.grade.upsert({
      where: { subjectId_gradeNumber: { subjectId, gradeNumber } },
      update: {},
      create: { subjectId, gradeNumber },
    });
    const level = await prisma.level.findFirst({ where: { gradeId: grade.id, name: 'موحّد' } });
    if (!level) await prisma.level.create({ data: { gradeId: grade.id, name: 'موحّد' } });
    grades++;
  }

  // مسارات الوحدات 10-12 (3/4/5) — مرتبطة بالمادة مباشرةً، فارغة حتى تُضاف الشالونات
  let tracks = 0;
  for (const unitLevel of ENGLISH_TRACKS) {
    const name = `${unitLevel} وحدات`;
    const existing = await prisma.level.findFirst({ where: { subjectId, unitLevel } });
    if (!existing) await prisma.level.create({ data: { subjectId, unitLevel, name } });
    tracks++;
  }

  console.log(
    `  ↳ English scaffold: ${grades} grades (7-9, موحّد), ${tracks} unit tracks (3/4/5) — فارغة، بانتظار المحتوى`,
  );
}

// وسم مهارة الدرس بالعربية (يُخزَّن في description للعرض) — skill label for display.
const SKILL_LABEL: Record<EnSkill, string> = {
  vocab: 'مفردات',
  grammar: 'قواعد',
  reading: 'فهم مقروء',
  writing: 'كتابة',
};

// صعوبة افتراضية حسب النوع — grade 7 أساسي.
const difficultyFor = (kind: EnExercise['kind']): 'easy' | 'medium' =>
  kind === 'reading' || kind === 'writing' ? 'medium' : 'easy';

/**
 * يزرع محتوى الصف السابع (وحدات موضوعية → دروس → تمارين) من englishContent.
 * idempotent: يتخطّى الموضوع الذي له دروس مسبقاً (مثل بذور الرياضيات).
 * كل تمرين يصبح Problem بـ language='english' والنوع المناسب (mcq/cloze/reading/writing).
 */
export async function seedEnglishContent(prisma: PrismaClient, subjectId: string) {
  const grade = await prisma.grade.findUnique({
    where: { subjectId_gradeNumber: { subjectId, gradeNumber: 7 } },
  });
  if (!grade) {
    console.log('  ↳ ⚠ English grade 7 غير موجود — شغّل seedEnglish أولاً');
    return;
  }
  let level = await prisma.level.findFirst({ where: { gradeId: grade.id, name: 'موحّد' } });
  if (!level) level = await prisma.level.create({ data: { gradeId: grade.id, name: 'موحّد' } });

  let topics = 0;
  let lessons = 0;
  let problems = 0;
  for (const unit of ENGLISH_GRADE7) {
    let topic = await prisma.topic.findFirst({ where: { levelId: level.id, nameAr: unit.name } });
    if (!topic) {
      topic = await prisma.topic.create({
        data: { levelId: level.id, nameAr: unit.name, description: unit.description, orderIndex: unit.order },
      });
    }
    topics++;
    if ((await prisma.lesson.count({ where: { topicId: topic.id } })) > 0) continue; // idempotent

    let order = 0; // ترتيب متسلسل داخل الوحدة (لتبقى تمارين الدرس مجمّعة في تسلسل الحل)
    for (const l of unit.lessons) {
      const lesson = await prisma.lesson.create({
        data: {
          topicId: topic.id,
          title: l.title,
          description: SKILL_LABEL[l.skill],
          orderIndex: l.order,
          isPublished: true,
        },
      });
      lessons++;

      for (const ex of l.exercises) {
        // القطعة: من التمرين إن وُجدت، وإلا قطعة درس الفهم المقروء.
        const passage = ex.passage ?? (l.skill === 'reading' ? l.passage ?? null : null);
        await prisma.problem.create({
          data: {
            topicId: topic.id,
            lessonId: lesson.id,
            question: ex.question,
            finalAnswer: ex.answer,
            language: 'english',
            kind: ex.kind,
            choices: (ex.choices ? ex.choices.map((text) => ({ text })) : undefined) as
              | Prisma.InputJsonValue
              | undefined,
            passage,
            difficulty: difficultyFor(ex.kind),
            orderIndex: order++,
            allowFreeMethod: true,
          },
        });
        problems++;
      }
    }
  }
  console.log(`  ↳ English grade 7 content: ${topics} units, ${lessons} lessons, ${problems} exercises`);
}
