import { describe, it, expect } from 'vitest';
import { api, seedSubject } from './helpers';

/**
 * اختبار الدخان — يثبت أن الطاقم كله يعمل: التطبيق الحقيقي + قاعدة الاختبار + التفريغ بين الاختبارات.
 * Smoke test: proves the harness boots end-to-end before any feature tests are written.
 */
describe('smoke: harness boots', () => {
  it('GET /health → 200 ok', async () => {
    const res = await api().get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('GET /api/subjects → 200 and reflects seeded data', async () => {
    // نزرع أولاً ثم نقرأ (الكتالوج مُخزَّن مؤقتاً 60ث، فالقراءة قبل الزرع تُخزّن نتيجة فارغة).
    await seedSubject({ nameAr: 'رياضيات' });

    const res = await api().get('/api/subjects');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({ nameAr: 'رياضيات' });
  });

  it('truncation isolates tests — the subject from the previous test is gone', async () => {
    const res = await api().get('/api/subjects');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});
