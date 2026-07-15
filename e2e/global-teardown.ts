import { execSync } from 'node:child_process';
import { COMPOSE_ARGS } from './env';

/** إنزال حاويات E2E بعد كل الاختبارات — tear down the isolated containers. */
export default async function globalTeardown() {
  try {
    execSync(`docker compose ${COMPOSE_ARGS} down -v`, { stdio: 'inherit' });
  } catch {
    /* تُنظَّف يدوياً عبر test:e2e:down عند اللزوم */
  }
}
