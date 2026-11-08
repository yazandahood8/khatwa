import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DATABASE_URL, SEED_STUDENT } from './env';

/**
 * بذور E2E — seeds a known student (+ a tiny published content tree) into the
 * already-running E2E database. يُشغَّل عبر tsx من مُشغّل run.mjs بعد رفع Docker وdb push.
 */
async function main() {
  const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });
  try {
    const subject = await prisma.subject.create({ data: { nameAr: 'رياضيات' } });
    const grade = await prisma.grade.create({ data: { gradeNumber: 7, subjectId: subject.id } });
    const level = await prisma.level.create({ data: { name: 'موحّد', gradeId: grade.id } });
    const topic = await prisma.topic.create({ data: { nameAr: 'المعادلات', levelId: level.id } });
    const lesson = await prisma.lesson.create({
      data: { title: 'مقدمة في المعادلات', topicId: topic.id, isPublished: true },
    });
    await prisma.problem.create({
      data: { question: 'حل: x + 3 = 5', finalAnswer: '2', topicId: topic.id, lessonId: lesson.id },
    });

    await prisma.user.create({
      data: {
        name: SEED_STUDENT.name,
        email: SEED_STUDENT.email,
        passwordHash: await bcrypt.hash(SEED_STUDENT.password, 10),
        role: 'student',
        grade: 7,
        subscriptions: {
          create: {
            plan: 'premium',
            status: 'active',
            endsAt: new Date(Date.now() + 30 * 86_400_000),
          },
        },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('E2E seed failed:', e);
  process.exit(1);
});
