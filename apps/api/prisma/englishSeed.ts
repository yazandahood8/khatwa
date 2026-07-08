/**
 * Seed — هيكل مادة الإنجليزية (إنجليزي) فقط، بلا محتوى.
 * يبني نفس شكل الرياضيات: صفوف 7-9 بمستوى موحّد + مسارات الوحدات 10-12 (3/4/5).
 * المواضيع/الدروس/التمارين والشالونات (وحدات البجروت) تُضاف لاحقاً من بحث المالك،
 * إمّا عبر لوحة إدارة المحتوى أو ملف englishContent.ts على غرار questionnaireContent.ts.
 *
 * Idempotent: الصفوف/المستويات تُنشأ فقط إن لم توجد. لا يمسّ الرياضيات أو علوم الحاسوب.
 * يُستدعى من seed.ts مع تمرير عميل Prisma (لأن seed.ts يشغّل main() عند الاستيراد).
 */
import type { PrismaClient } from '@prisma/client';

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
