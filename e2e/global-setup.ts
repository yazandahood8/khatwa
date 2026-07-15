import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DATABASE_URL, COMPOSE_ARGS, SEED_STUDENT } from './env';

/**
 * إعداد عام لِـ E2E — brings up an isolated Postgres+Redis, syncs the schema,
 * and seeds a known student (+ minimal content) before the browser tests run.
 */
export default async function globalSetup() {
  // 1) حاويات نظيفة — fresh containers (down first in case a previous run lingered).
  try {
    execSync(`docker compose ${COMPOSE_ARGS} down -v`, { stdio: 'ignore' });
  } catch {
    /* لا شيء لإنزاله — nothing to tear down */
  }
  execSync(`docker compose ${COMPOSE_ARGS} up -d --wait`, { stdio: 'inherit' });

  // 2) مخطط قاعدة البيانات — push schema to the fresh DB.
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    cwd: 'apps/api',
    env: { ...process.env, DATABASE_URL, DIRECT_URL: DATABASE_URL },
  });

  // 3) بيانات معروفة — seed a known student + a tiny published content tree.
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
