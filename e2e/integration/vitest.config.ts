import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * إعداد الاختبارات التكاملية — integration tests run the real Express app (createApp)
 * against a throwaway Docker Postgres + Redis (see docker-compose.yml).
 * منفصلة عن اختبارات الوحدة (vitest.config.ts) لأنها تحتاج قاعدة بيانات.
 */
export default defineConfig({
  // نحلّ @khatwa/shared من المصدر (src) لا من dist — يضمن نسخة zod واحدة مشتركة مع الـ API،
  // وإلا يفشل `err instanceof ZodError` في معالج الأخطاء (نسختا zod: ESM مُحوّلة مقابل CJS من dist)
  // فتعود أخطاء التحقق 500 بدل 400 تحت Vitest فقط. يعكس هذا سلوك الإنتاج الصحيح.
  resolve: {
    alias: {
      '@khatwa/shared': fileURLToPath(
        new URL('../../packages/shared/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    // الجذر = هذا المجلد؛ يُشغَّل من apps/api (cwd) كي تجد الحزم والـ prisma نفسها.
    root: fileURLToPath(new URL('.', import.meta.url)),
    include: ['**/*.test.ts'],
    globalSetup: ['./globalSetup.ts'],
    setupFiles: ['./setup.ts'],
    // تشغيل تسلسلي — ملف واحد في كل مرة كي لا تتسابق الاختبارات على قاعدة البيانات.
    // (Vitest 4: poolOptions أُزيلت؛ fileParallelism:false يكفي للعزل مع التفريغ بين الاختبارات.)
    pool: 'forks',
    fileParallelism: false,
    // مهلة أطول قليلاً — DB round-trips + first-import are slower than unit tests.
    testTimeout: 20_000,
    hookTimeout: 30_000,
    // متغيّرات بيئة الاختبار — set BEFORE any module (env.ts/prisma) loads.
    // dotenv لا يستبدل المضبوط مسبقاً، فهذه القيم تسود على أي ملف .env محلي.
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://khatwa_test:khatwa_test@localhost:5544/khatwa_test?schema=public',
      DIRECT_URL: 'postgresql://khatwa_test:khatwa_test@localhost:5544/khatwa_test?schema=public',
      REDIS_URL: 'redis://localhost:6390',
      JWT_SECRET: 'khatwa-integration-test-secret-0123456789',
      // نُبقي الباقة الافتراضية free كي تكون حدود الحصة قابلة للتنبؤ في الاختبارات.
      AI_DEFAULT_PLAN: 'free',
      // سرّ PayPlus فقط (بلا API_KEY/PAGE_UID) — يفعّل التحقق من توقيع الـ IPN دون
      // تفعيل isPayplusConfigured، فيبقى checkout على المسار التجريبي (بلا نداء شبكة).
      PAYPLUS_SECRET_KEY: 'test-payplus-secret',
    },
  },
});
