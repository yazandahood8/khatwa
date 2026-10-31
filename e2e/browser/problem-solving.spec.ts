import { test, expect, type Page } from '@playwright/test';
import { SEED_STUDENT } from '../shared/env';

/**
 * حل المسائل (حتمي، بلا ذكاء اصطناعي) — Sprint 4: deterministic answer checking
 * via the "تحقق من الخطوة" button → POST /api/problems/:id/check (answerCheck.ts).
 * لا نضغط "أضف خطوة" أبداً (تبثّ للمساعد). الإدخال عبر لوحة المفاتيح الرياضية على الشاشة.
 *
 * مسائل إنتاجية حقيقية من اللقطة (plain math: language=null, kind=null). كل اختبار
 * يُعدّل محاولاته يستخدم مسألة مستقلّة كي لا تتراكم المحاولات بين الاختبارات.
 */

// مسائل حقيقية من e2e/shared/fixtures/prod-content.json — id → الجواب الصحيح.
const P = {
  correct: { id: 'cmqzjovh8002bnbs8vukdhne9', answer: '6' },
  wrong: { id: 'cmqzjp5kg004vnbs8wlhkoj3d', answer: '14' },
  empty: { id: 'cmqzjp6380050nbs8sytco0yq', answer: '48' },
  attempts: { id: 'cmqzjp6pl0056nbs822ggpfmv', answer: '31' },
  fraction: { id: 'cmqzjrz2700r0nbs8d1ezpo1n', answer: '1/8' },
  multi: { id: 'cmqzjpadu0064nbs82qw5m8of', answer: '1, 3, 5, 7' },
  persist: { id: 'cmqzjp8iw005nnbs80ujewept', answer: '83' },
  navStart: 'cmqzjoybb0033nbs8zsye0n5x', // نفس موضوع correct — same topic as `correct`
};

/**
 * مسألة لها رسم حلّ موجّه (SOLVE_GRAPHS) — المحرّك الحتمي يردّ على الخطوات المطابقة
 * للمحطّات/الأخطاء المعروفة بلا Claude وبلا حصّة ("0 tok, no Claude").
 * نستخدم فقط صيغ من الرسم (3x+8 / 26 محطّات، 3x+4 خطأ معروف) فلا يقع أي نداء AI.
 * السؤال: "ثمن دفتر x وثمن قلم 4. اكتب تعبيراً لثمن 3 دفاتر وقلمين ثم احسبه عند x=6."
 */
const GUIDED = 'cmqzjp1vo0042nbs81w2wx0d4';

async function loginSeeded(page: Page) {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill(SEED_STUDENT.password);
  await page.getByRole('button', { name: 'دخول' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function openSolve(page: Page, id: string) {
  await page.goto(`/problems/${id}/solve`);
  // زرّ التحقّق يظهر عند جهوزية واجهة المسألة الرياضية.
  await expect(page.getByRole('button', { name: 'تحقق من الخطوة' })).toBeVisible();
}

/** يُدخل نصّ الإجابة عبر أزرار لوحة المفاتيح (تطابق دقيق يتجنّب أزرار أخرى). */
async function typeAnswer(page: Page, text: string) {
  for (const ch of text) {
    await page.getByRole('button', { name: ch, exact: true }).click();
  }
}
const clearInput = (page: Page) => page.getByRole('button', { name: 'مسح الكل' }).click();
const check = (page: Page) => page.getByRole('button', { name: 'تحقق من الخطوة' }).click();
const addStep = (page: Page) => page.getByRole('button', { name: 'أضف خطوة' }).click();

// ── T4.1 ─────────────────────────────────────────────────────────────────────
test('T4.1 a correct answer solves the problem', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.correct.id);

  await typeAnswer(page, P.correct.answer);
  await check(page);

  await expect(page.getByText(/ممتاز/)).toBeVisible();
  await expect(page.getByText(/من أول محاولة/)).toBeVisible();
});

// ── T4.2 ─────────────────────────────────────────────────────────────────────
test('T4.2 a wrong answer shows retry feedback and counts one attempt', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.wrong.id);

  await typeAnswer(page, '9'); // ≠ 14
  await check(page);

  await expect(page.getByText(/راجع خطواتك وحاول مرة ثانية/)).toBeVisible();
  await expect(page.getByText('المحاولات: 1')).toBeVisible();
  // لم تُحلّ — زرّ التحقّق ما زال ظاهراً.
  await expect(page.getByRole('button', { name: 'تحقق من الخطوة' })).toBeVisible();
});

// ── T4.3 ─────────────────────────────────────────────────────────────────────
test('T4.3 an empty answer is blocked client-side with no attempt', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.empty.id);

  await check(page); // بلا إدخال

  await expect(page.getByText('اكتب إجابتك أولاً')).toBeVisible();
  await expect(page.getByText('المحاولات: 0')).toBeVisible(); // لا طلب للخادم
  await expect(page.getByRole('button', { name: 'تحقق من الخطوة' })).toBeVisible();
});

// ── T4.4 (long) ───────────────────────────────────────────────────────────────
test('T4.4 the attempts counter climbs across wrong → wrong → correct', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.attempts.id); // الجواب 31

  await typeAnswer(page, '9');
  await check(page);
  await expect(page.getByText('المحاولات: 1')).toBeVisible();

  await clearInput(page);
  await typeAnswer(page, '8');
  await check(page);
  await expect(page.getByText('المحاولات: 2')).toBeVisible();

  await clearInput(page);
  await typeAnswer(page, P.attempts.answer); // 31
  await check(page);
  await expect(page.getByText(/بعد 3 محاولات/)).toBeVisible(); // نافذة الاحتفال
});

// ── T4.5 ─────────────────────────────────────────────────────────────────────
test('T4.5 answer equivalence: a decimal matches a fraction answer', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.fraction.id); // الجواب 1/8

  await typeAnswer(page, '0.125'); // مكافئ عددياً لـ 1/8
  await check(page);

  await expect(page.getByText(/ممتاز/)).toBeVisible();
});

// ── T4.6 ─────────────────────────────────────────────────────────────────────
test('T4.6 answer equivalence: multi-answer order does not matter', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.multi.id); // الجواب "1, 3, 5, 7"

  await typeAnswer(page, '7,5,3,1'); // نفس المجموعة بترتيب مختلف
  await check(page);

  await expect(page.getByText(/ممتاز/)).toBeVisible();
});

// ── T4.7 (long) ───────────────────────────────────────────────────────────────
test('T4.7 solved state persists across a reload', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.persist.id); // الجواب 83

  await typeAnswer(page, P.persist.answer);
  await check(page);
  await expect(page.getByText(/ممتاز/)).toBeVisible();

  await page.reload();

  // بعد التحديث: الحالة محفوظة (completedAt) — لافتة الحل والعدّاد يبقيان.
  await expect(page.getByText('حللت المسألة!')).toBeVisible();
  await expect(page.getByText('المحاولات: 1')).toBeVisible();
});

// ── T4.8 ─────────────────────────────────────────────────────────────────────
test('T4.8 the question navigator jumps between problems of a topic', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, P.navStart);
  const startUrl = page.url();

  // الرأس يعرض موقع المسألة ضمن الموضوع (أكثر من مسألة).
  await expect(page.getByRole('button', { name: /المسألة \d+ من \d+/ })).toBeVisible();

  // افتح المنسدلة وانتقل لأيّ مسألة أخرى (خيار غير محدَّد حالياً).
  await page.getByRole('button', { name: /المسألة \d+ من \d+/ }).click();
  await page.locator('[role="option"][aria-selected="false"]').first().click();

  // انتقلنا لمسألة مختلفة ضمن نفس صفحة الحل.
  await expect(page).not.toHaveURL(startUrl);
  await expect(page).toHaveURL(/\/problems\/.+\/solve/);
  await expect(page.getByRole('button', { name: /المسألة \d+ من \d+/ })).toBeVisible();
});

// ── T4.9 (guided step engine — deterministic, 0-token) ────────────────────────
// خطوات حقيقية على مسألة لها رسم موجّه: نبني التعبير ثم نحسب القيمة. كل خطوة تطابق
// محطّة في الرسم فيردّ المحرّك الحتمي بلا Claude. (لا نضغط "أضف خطوة" إلا بصيغ الرسم.)
test('T4.9 the guided engine coaches a real step-by-step solve (0-token)', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, GUIDED);

  // خطوة 1: التعبير 3x+8 (محطّة إجبارية) → مديح موجّه.
  await typeAnswer(page, '3x+8');
  await addStep(page);
  await expect(page.getByText(/هاد هو التعبير/)).toBeVisible();

  // خطوة 2: القيمة عند x=6 → 26 (تُكمل المحطّات الإجبارية) ⟹ [SOLVED] + احتفال.
  await typeAnswer(page, '26');
  await addStep(page);
  await expect(page.getByRole('heading', { name: /ممتاز/ })).toBeVisible();
});

// ── T4.10 (guided wrong-step coaching — deterministic, 0-token) ────────────────
test('T4.10 the guided engine flags a known wrong step then accepts the fix (0-token)', async ({ page }) => {
  await loginSeeded(page);
  await openSolve(page, GUIDED);

  // خطأ معروف: 3x+4 (استعمل ثمن قلم واحد بدل قلمين) → رسالة توجيه محدّدة، بلا Claude.
  await typeAnswer(page, '3x+4');
  await addStep(page);
  await expect(page.getByText(/قلمين مش قلم واحد/)).toBeVisible();

  // التصحيح: 3x+8 → يُقبل بمديح المحطّة.
  await typeAnswer(page, '3x+8');
  await addStep(page);
  await expect(page.getByText(/هاد هو التعبير/)).toBeVisible();
});
