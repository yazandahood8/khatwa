/**
 * لقطة محتوى الإنتاج — snapshots the LIVE production content graph into a
 * committed fixture (e2e/shared/fixtures/prod-content.json) so the E2E database mirrors
 * real production data instead of a hand-written toy tree.
 *
 * قراءة فقط من قاعدة الإنتاج — READ-ONLY: only findMany on content tables.
 * لا يُصدّر أي مستخدمين أو تقدّم أو محاولات (PII) — no users/progress/attempts.
 *
 * تشغيل يدوي عند الرغبة بتحديث اللقطة — run manually to refresh:
 *   npx tsx e2e/shared/export-prod-content.ts
 * يقرأ DIRECT_URL من backend/.env — reads the prod DB URL from backend/.env.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

function prodUrl(): string {
  const env = readFileSync('backend/.env', 'utf8');
  const url = env.match(/^DIRECT_URL="?([^"\n]+)"?/m)?.[1];
  if (!url) throw new Error('DIRECT_URL not found in backend/.env');
  return url;
}

async function main() {
  const prisma = new PrismaClient({ datasources: { db: { url: prodUrl() } } });
  try {
    // ترتيب الجداول يحترم المفاتيح الأجنبية عند الاستيراد لاحقًا.
    const snapshot = {
      exportedFrom: 'khatwa production (Supabase)',
      subjects: await prisma.subject.findMany(),
      grades: await prisma.grade.findMany(),
      levels: await prisma.level.findMany(),
      questionnaires: await prisma.questionnaire.findMany(),
      topics: await prisma.topic.findMany(),
      lessons: await prisma.lesson.findMany(),
      problems: await prisma.problem.findMany(),
      solveMilestones: await prisma.solveMilestone.findMany(),
      solveWrongPatterns: await prisma.solveWrongPattern.findMany(),
      // discoveredByStudent يُصفّر عند الاستيراد (لا نستورد المستخدمين).
      solutionMethods: await prisma.solutionMethod.findMany(),
      solutionSteps: await prisma.solutionStep.findMany(),
      commonMistakes: await prisma.commonMistake.findMany(),
    };

    mkdirSync('e2e/shared/fixtures', { recursive: true });
    writeFileSync('e2e/shared/fixtures/prod-content.json', JSON.stringify(snapshot));

    // eslint-disable-next-line no-console
    console.table(
      Object.fromEntries(
        Object.entries(snapshot)
          .filter(([, v]) => Array.isArray(v))
          .map(([k, v]) => [k, (v as unknown[]).length]),
      ),
    );
    const bytes = JSON.stringify(snapshot).length;
    // eslint-disable-next-line no-console
    console.log(`fixture written: e2e/shared/fixtures/prod-content.json (${(bytes / 1e6).toFixed(2)} MB)`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('export failed:', e);
  process.exit(1);
});
