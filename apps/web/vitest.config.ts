import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * إعداد اختبارات الواجهة — component tests (Vitest + React Testing Library + jsdom).
 * تشغيل: npm run test --workspace=apps/web  (سريعة، بلا متصفح ولا خادم).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // نحلّ @khatwa/shared من المصدر لتفادي نسخة dist قديمة أو ازدواج zod (كما في الـ API).
      '@khatwa/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
});
