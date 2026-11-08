// مُشغّل E2E — orchestrates the run so the app boots against a READY database.
// الترتيب مهمّ: نرفع Docker ونبذر البيانات قبل أن يشغّل Playwright الـ API/الواجهة،
// فلا يطلق الـ API وابل أخطاء Redis عند الإقلاع، ونُنزل الحاويات بعد أن يُنهي Playwright الخوادم.
//
// أي وسائط تُمرَّر (مثل --headed أو --ui) تذهب إلى `playwright test`.
import { execSync, spawnSync } from 'node:child_process';

const COMPOSE = 'docker compose -f e2e/shared/docker-compose.e2e.yml -p khatwa-e2e';
// أبقِها متوافقة مع e2e/shared/env.ts — keep in sync with e2e/shared/env.ts.
const DB_URL = 'postgresql://khatwa_e2e:khatwa_e2e@localhost:5545/khatwa_e2e?schema=public';
const pwArgs = process.argv.slice(2).join(' ');

// shell:true كي يجد Windows ملفات .cmd (npx/docker) — resolves .cmd shims on Windows.
function sh(cmd, opts = {}) {
  const r = spawnSync(cmd, { stdio: 'inherit', shell: true, ...opts });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`فشل الأمر — command failed: ${cmd}`);
}

// 1) ابنِ الحزمة المشتركة — API (tsx) + web (next dev) need @khatwa/shared build.
sh('npm run build --workspace=packages/shared');

let code = 1;
try {
  // 2) حاويات نظيفة جاهزة قبل تشغيل التطبيق — fresh, healthy DB+Redis BEFORE Playwright boots the app.
  try {
    execSync(`${COMPOSE} down -v`, { stdio: 'ignore' });
  } catch {
    /* لا شيء لإنزاله */
  }
  sh(`${COMPOSE} up -d --wait`);

  // 3) المخطط + البذور — schema then seed (DB is up now).
  sh('npx prisma db push --skip-generate --accept-data-loss', {
    cwd: 'backend',
    env: { ...process.env, DATABASE_URL: DB_URL, DIRECT_URL: DB_URL },
  });
  sh('npx tsx e2e/shared/seed.ts');

  // 4) Playwright يشغّل الـ API/الواجهة على قاعدة جاهزة — no startup Redis noise.
  const r = spawnSync(`npx playwright test ${pwArgs}`.trim(), {
    stdio: 'inherit',
    shell: true,
  });
  code = r.status ?? 1;
} finally {
  // 5) إنزال بعد أن أنهى Playwright الخوادم — teardown after the servers are gone.
  try {
    execSync(`${COMPOSE} down -v`, { stdio: 'inherit' });
  } catch {
    /* نظّف يدوياً عبر test:e2e:down عند اللزوم */
  }
}

process.exit(code);
