/**
 * ثوابت بيئة E2E — shared config for the Playwright config, global setup, and specs.
 * منافذ مخصّصة لِـ E2E كي لا تتعارض مع خوادم التطوير أو اختبارات التكامل.
 */
export const PG_PORT = 5545;
export const REDIS_PORT = 6391;
export const API_PORT = 4100;
export const WEB_PORT = 3100;

export const DATABASE_URL = `postgresql://khatwa_e2e:khatwa_e2e@localhost:${PG_PORT}/khatwa_e2e?schema=public`;
export const REDIS_URL = `redis://localhost:${REDIS_PORT}`;
export const API_URL = `http://localhost:${API_PORT}`;
export const WEB_URL = `http://localhost:${WEB_PORT}`;
export const JWT_SECRET = 'khatwa-e2e-secret-0123456789abcdef';

/** مشروع docker-compose المعزول لِـ E2E — isolated compose project name. */
export const COMPOSE_ARGS = '-f e2e/docker-compose.e2e.yml -p khatwa-e2e';

/** طالب مزروع معروف لاختبار تسجيل الدخول — a known seeded student for the login spec. */
export const SEED_STUDENT = {
  name: 'طالب اختبار',
  email: 'e2e@test.khatwa',
  password: 'password123',
};
