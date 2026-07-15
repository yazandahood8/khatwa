import { defineConfig, devices } from '@playwright/test';
import { API_PORT, API_URL, WEB_PORT, WEB_URL, DATABASE_URL, REDIS_URL, JWT_SECRET } from './e2e/env';

/**
 * إعداد Playwright لِـ E2E — drives the real web app + API against an isolated DB.
 * تُشغَّل عبر مُشغّل e2e/run-e2e.mjs الذي يرفع Docker ويبذر البيانات قبل هذا الإعداد،
 * فيقلع التطبيق على قاعدة جاهزة (بلا ضجيج Redis). لا تُشغّل `playwright test` مباشرةً؛
 * استخدم `npm run test:e2e` / `:headed` / `:ui`.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1, // تسلسليّ — DB/خادم مشترك.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: 'list',

  use: {
    baseURL: WEB_URL,
    trace: 'on-first-retry', // أثر يُفتح بـ `npx playwright show-trace` عند فشل إعادة المحاولة
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: [
    {
      // الـ API عبر tsx على منفذ E2E، مربوط بقاعدة الحاوية.
      command: 'npx tsx src/index.ts',
      cwd: 'apps/api',
      url: `${API_URL}/health`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        NODE_ENV: 'test',
        PORT: String(API_PORT),
        DATABASE_URL,
        DIRECT_URL: DATABASE_URL,
        REDIS_URL,
        JWT_SECRET,
        WEB_ORIGIN: WEB_URL, // CORS: اسمح لأصل الواجهة على 3100
      },
    },
    {
      // الواجهة عبر next dev على منفذ E2E، موجَّهة لِـ API E2E.
      command: 'npx next dev',
      cwd: 'apps/web',
      port: WEB_PORT,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        PORT: String(WEB_PORT),
        NEXT_PUBLIC_API_URL: API_URL,
      },
    },
  ],
});
