import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../../src/services/prisma';
import { redis } from '../../src/services/redis';

/**
 * تهيئة لكل اختبار — per-test isolation.
 * قبل كل اختبار: نُفرّغ كل الجداول ونمسح Redis كي يبدأ كل اختبار من حالة نظيفة.
 * (يعمل داخل عامل الاختبار حيث DATABASE_URL/REDIS_URL مضبوطة عبر test.env.)
 */

let tableList: string[] | null = null;

async function allTables(): Promise<string[]> {
  if (tableList) return tableList;
  const rows = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma%'
  `;
  tableList = rows.map((r) => r.tablename);
  return tableList;
}

beforeEach(async () => {
  const tables = await allTables();
  if (tables.length > 0) {
    const quoted = tables.map((t) => `"public"."${t}"`).join(', ');
    // RESTART IDENTITY + CASCADE — يُصفّر كل شيء ويحترم المفاتيح الأجنبية.
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
  }
  if (redis) await redis.flushdb();
});

afterAll(async () => {
  await prisma.$disconnect();
  if (redis) {
    await redis.flushdb();
    redis.disconnect();
  }
});
