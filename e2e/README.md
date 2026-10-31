# e2e — كل اختبارات النظام الكاملة / all system-level tests

| المجلد / Folder | النوع / Kind | الأداة / Tool | التشغيل / Run |
| --- | --- | --- | --- |
| `integration/` | API ضد Postgres+Redis حقيقيين | Vitest + supertest | `npm run test:integration` |
| `browser/` | واجهة + API في متصفح حقيقي | Playwright | `npm run test:e2e` (`:headed`, `:ui`) |
| `robot/` | اختبارات قبول بالكلمات المفتاحية | Robot Framework | _لم تُكتب بعد — scaffold only_ |
| `performance/` | حمل وأداء | _لم تُحدَّد الأداة — undecided_ | _لم تُكتب بعد — scaffold only_ |
| `shared/` | env · seed · fixtures · docker-compose | — | يستخدمها `browser/` |

وحدات الاختبار الصغيرة (unit) تبقى بجانب الكود: `apps/api/src/**/*.test.ts`، `apps/web/tests/`.
Unit tests stay next to the code; everything that needs a DB, a browser, or load lives here.

CI و pre-push يستدعيان نفس سكربتات npm، لذا لا يتغيّر شيء عند التشغيل.
