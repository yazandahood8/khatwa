import { test, expect, type Page } from '@playwright/test';
import { SEED_STUDENT } from '../shared/env';

/**
 * التنقّل والصفحة الرئيسية والأسعار — Sprint 2: landing CTAs, pricing tiers,
 * shell navigation, and a broad route-guard sweep. صفحتا `/` و`/pricing` عامّتان
 * (خارج matcher الوسيط) فتُختبران بلا تسجيل دخول. لا تغييرات على البذور.
 */

/** يسجّل دخول الطالب المزروع ويصل للوحة — logs in the seeded student. */
async function loginSeeded(page: Page) {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill(SEED_STUDENT.password);
  await page.getByRole('button', { name: 'دخول' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// ── T2.1 ─────────────────────────────────────────────────────────────────────
test('T2.1 landing CTAs route to login and register', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /المساعد معك/ })).toBeVisible();

  // زرّ الدخول في الشريط العلوي → /login
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  await expect(page).toHaveURL(/\/login/);

  // زرّ "ابدأ مجاناً" (الشريط العلوي/البطل) → /register
  await page.goto('/');
  await page.getByRole('button', { name: 'ابدأ مجاناً', exact: true }).first().click();
  await expect(page).toHaveURL(/\/register/);

  // دعوة العمل الختامية "ابدأ مجاناً الآن" → /register
  await page.goto('/');
  await page.getByRole('button', { name: 'ابدأ مجاناً الآن' }).click();
  await expect(page).toHaveURL(/\/register/);
});

// ── T2.2 ─────────────────────────────────────────────────────────────────────
test('T2.2 "شاهد كيف يعمل" anchors to the how-it-works section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'شاهد كيف يعمل' }).click();

  await expect(page).toHaveURL(/#how/);
  await expect(page.getByRole('heading', { name: 'كيف بتتعلّم عليها؟' })).toBeVisible();
});

// ── T2.3 ─────────────────────────────────────────────────────────────────────
test('T2.3 pricing page renders both tiers with correct prices', async ({ page }) => {
  await page.goto('/pricing');

  await expect(page.getByRole('heading', { name: 'اختر باقتك' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'مجاني', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'بريميوم' })).toBeVisible();
  await expect(page.getByText('99')).toBeVisible();
  await expect(page.getByText('الأكثر مبيعاً')).toBeVisible();
});

// ── T2.4 ─────────────────────────────────────────────────────────────────────
// زائر غير مسجّل: أي زرّ باقة يقصر مباشرةً إلى /register قبل أي طلب دفع (بلا آثار جانبية).
test('T2.4 pricing CTAs send a logged-out visitor to register', async ({ page }) => {
  await page.goto('/pricing');
  await page.getByRole('button', { name: 'ابدأ مجاناً', exact: true }).click();
  await expect(page).toHaveURL(/\/register/);

  await page.goto('/pricing');
  await page.getByRole('button', { name: 'ابدأ تجربة 7 أيام مجاناً' }).click();
  await expect(page).toHaveURL(/\/register/);
});

// ── T2.5 (long) ───────────────────────────────────────────────────────────────
test('T2.5 authenticated sidebar navigation moves between sections', async ({ page }) => {
  await loginSeeded(page);
  const sidebar = page.locator('aside');

  await sidebar.getByRole('link', { name: 'الدروس' }).click();
  await expect(page).toHaveURL(/\/courses/);
  await expect(sidebar).toBeVisible();

  await sidebar.getByRole('link', { name: 'تقدّمي' }).click();
  await expect(page).toHaveURL(/\/progress/);

  await sidebar.getByRole('link', { name: 'ملفّي' }).click();
  await expect(page).toHaveURL(/\/profile/);

  await sidebar.getByRole('link', { name: 'لوحتي' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(sidebar).toBeVisible();
});

// ── T2.6 (long, conflict) ─────────────────────────────────────────────────────
test('T2.6 route guards redirect logged-out and role-mismatched access', async ({ page }) => {
  // أ) غير مسجّل: كل مسار محميّ يُعاد للدخول.
  const protectedPaths = [
    '/dashboard',
    '/courses',
    '/progress',
    '/profile',
    '/settings/subscription',
    '/parent/dashboard',
    '/admin/dashboard',
  ];
  for (const path of protectedPaths) {
    await page.goto(path);
    await expect(page, `${path} should redirect to /login`).toHaveURL(/\/login/);
  }

  // ب) طالب مسجّل يفتح مسار دور آخر → يُعاد للوحته (تطابق دقيق يستبعد /parent|/admin).
  await loginSeeded(page);

  await page.goto('/parent/dashboard');
  await expect(page).toHaveURL('/dashboard');

  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL('/dashboard');

  // ج) مسجّل يفتح صفحة الدخول → يُعاد للوحته.
  await page.goto('/login');
  await expect(page).toHaveURL('/dashboard');
});
