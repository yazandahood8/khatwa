import { test, expect, type Page } from '@playwright/test';
import { SEED_STUDENT } from '../shared/env';

/**
 * المصادقة والجلسة (موسّع) — Sprint 1: extended auth & session flows.
 * يكمّل auth.spec.ts: تحقّق النماذج، البريد المكرّر، دور وليّ الأمر، الخروج،
 * ثبات الجلسة، والرابط العميق مع callbackUrl. متسلسل الأمان (workers: 1)،
 * وكل اختبار مستقلّ عن ترتيب التشغيل عبر بريد فريد `Date.now()`.
 */

const uniqueEmail = (tag: string) => `${tag}-${Date.now()}@test.khatwa`;

/** يملأ نموذج تسجيل طالب صف 7 — fills a student register form (no submit). */
async function fillStudentRegister(
  page: Page,
  { name, email, password }: { name: string; email: string; password: string },
) {
  await page.getByLabel('الاسم الكامل').fill(name);
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByLabel('كلمة السر').fill(password);
  await page.getByLabel('الصف / المرحلة').selectOption('7');
}

/** يسجّل دخول الطالب المزروع ويصل للوحة — logs in the seeded student. */
async function loginSeeded(page: Page) {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill(SEED_STUDENT.password);
  await page.getByRole('button', { name: 'دخول' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// ── T1.1 ─────────────────────────────────────────────────────────────────────
test('T1.1 register rejects a short password', async ({ page }) => {
  await page.goto('/register');
  await fillStudentRegister(page, { name: 'طالب', email: uniqueEmail('s'), password: '123' });
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

  await expect(page.getByText(/8 أحرف على الأقل/)).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});

// ── T1.2 ─────────────────────────────────────────────────────────────────────
// ملاحظة: حقل البريد type="email" فيُفعّل تحقّق المتصفّح الأصلي قبل Zod،
// فيُمنع الإرسال ولا يظهر نص خطأ في DOM. نتحقّق من بقاء الصفحة + عدم صلاحية الحقل.
test('T1.2 register rejects an invalid email (native validity blocks submit)', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('الاسم الكامل').fill('طالب صحيح');
  await page.getByLabel('البريد الإلكتروني').fill('not-an-email');
  await page.getByLabel('كلمة السر').fill('password123');
  await page.getByLabel('الصف / المرحلة').selectOption('7');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByLabel('البريد الإلكتروني')).toHaveJSProperty('validity.valid', false);
});

// ── T1.3 ─────────────────────────────────────────────────────────────────────
test('T1.3 register rejects an empty name', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('البريد الإلكتروني').fill(uniqueEmail('noname'));
  await page.getByLabel('كلمة السر').fill('password123');
  await page.getByLabel('الصف / المرحلة').selectOption('7');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

  await expect(page.getByText('الاسم قصير جداً')).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});

// ── T1.4 (conflict) ───────────────────────────────────────────────────────────
test('T1.4 duplicate email is rejected by the server', async ({ page }) => {
  const email = uniqueEmail('dup');

  // 1) أول تسجيل ينجح ويصل للوحة.
  await page.goto('/register');
  await fillStudentRegister(page, { name: 'طالب أول', email, password: 'password123' });
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // 2) سياق نظيف (كوكيز جديدة) + نفس البريد → يرفضه الخادم.
  await page.context().clearCookies();
  await page.goto('/register');
  await fillStudentRegister(page, { name: 'طالب ثانٍ', email, password: 'password123' });
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

  await expect(page.getByText(/مسجّل بالفعل/)).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});

// ── T1.5 ─────────────────────────────────────────────────────────────────────
test('T1.5 registering as a parent lands on the parent dashboard', async ({ page }) => {
  await page.goto('/register');
  await page.getByRole('button', { name: 'وليّ أمر' }).click();

  // حقول الصف/المرحلة تختفي لوليّ الأمر.
  await expect(page.getByLabel('الصف / المرحلة')).toHaveCount(0);

  await page.getByLabel('الاسم الكامل').fill('وليّ أمر اختبار');
  await page.getByLabel('البريد الإلكتروني').fill(uniqueEmail('parent'));
  await page.getByLabel('كلمة السر').fill('password123');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

  await expect(page).toHaveURL(/\/parent\/dashboard/);
});

// ── T1.6 ─────────────────────────────────────────────────────────────────────
test('T1.6 login with empty fields is blocked by validation', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'دخول' }).click();

  await expect(page.getByText('بريد إلكتروني غير صالح')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

// ── T1.7 (long) ───────────────────────────────────────────────────────────────
test('T1.7 logout ends the session and re-guards protected pages', async ({ page }) => {
  await loginSeeded(page);

  // زرّ الخروج في تذييل الشريط الجانبي (app-shell).
  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login/);

  // الوصول المباشر للوحة بعد الخروج يُعاد توجيهه للدخول.
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

// ── T1.8 ─────────────────────────────────────────────────────────────────────
test('T1.8 session persists across a page reload', async ({ page }) => {
  await loginSeeded(page);

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard/);
  // اسم المستخدم يظهر في تذييل الشريط الجانبي — الجلسة رطّبت بلا ارتداد.
  await expect(page.getByText(SEED_STUDENT.name).first()).toBeVisible();
});

// ── T1.9 (long, conflict) ─────────────────────────────────────────────────────
test('T1.9 deep-link to a protected page returns there after login', async ({ page }) => {
  // 1) زائر غير مسجّل يفتح /profile مباشرة.
  await page.goto('/profile');

  // 2) يُعاد توجيهه للدخول مع callbackUrl يحفظ الوجهة.
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fprofile/);

  // 3) يسجّل الدخول بالطالب المزروع.
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill(SEED_STUDENT.password);
  await page.getByRole('button', { name: 'دخول' }).click();

  // 4) يعود إلى /profile (middleware يضبط callbackUrl، وصفحة الدخول تحترمه).
  await expect(page).toHaveURL(/\/profile/);
});
