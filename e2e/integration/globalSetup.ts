import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * إعداد عام يُنفَّذ مرة واحدة قبل كل الاختبارات التكاملية — global setup (runs once).
 * يبني مخطط قاعدة بيانات الاختبار عبر `prisma db push` على حاوية Postgres المؤقتة.
 *
 * ملاحظة: يعمل في العملية الرئيسية لا في عامل الاختبار، لذا نمرّر DATABASE_URL صراحةً
 * إلى العملية الفرعية بدل الاعتماد على test.env (الذي يُطبَّق على العمّال فقط).
 */
const TEST_DB_URL =
  'postgresql://khatwa_test:khatwa_test@localhost:5544/khatwa_test?schema=public';

export default function setup() {
  const env = { ...process.env, DATABASE_URL: TEST_DB_URL, DIRECT_URL: TEST_DB_URL };

  // db push (وليس migrate) — نُزامن المخطط مباشرة على قاعدة اختبار تُرمى؛ أسرع وبلا تاريخ هجرات.
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env,
    // مخطط prisma يعيش في apps/api — the prisma schema lives in apps/api.
    cwd: fileURLToPath(new URL('../../apps/api', import.meta.url)),
  });
}
