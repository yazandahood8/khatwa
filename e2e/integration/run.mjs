// مُشغّل الاختبارات التكاملية — orchestrates the integration run cross-platform (Windows/CI).
// يرفع Postgres+Redis عبر Docker، يشغّل Vitest، ثم يُنزل الحاويات دائماً (حتى عند الفشل).
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const COMPOSE = ['compose', '-f', `"${HERE}docker-compose.yml"`];
const CONFIG = `"${HERE}vitest.config.ts"`;

// shell:true — كي يجد Windows ملفات .cmd مثل npx.cmd/docker (وإلا ENOENT).
function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (r.error) throw r.error;
  return r.status ?? 1;
}

let code = 1;
try {
  // 1) رفع الحاويات وانتظار جاهزيتها (healthcheck) — up + wait for healthy.
  const up = run('docker', [...COMPOSE, 'up', '-d', '--wait']);
  if (up !== 0) {
    console.error('\n❌ فشل رفع حاويات الاختبار — is Docker Desktop running?');
    process.exit(up);
  }

  // 2) تشغيل Vitest التكاملي (globalSetup يتكفّل بـ prisma db push).
  code = run('npx', ['vitest', 'run', '--config', CONFIG], { cwd: fileURLToPath(new URL('../../apps/api', import.meta.url)) });
} finally {
  // 3) إنزال الحاويات دائماً — always tear down (-v يحذف الأحجام المؤقتة).
  run('docker', [...COMPOSE, 'down', '-v']);
}

process.exit(code);
