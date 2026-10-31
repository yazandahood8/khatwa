import { test, expect } from '@playwright/test';
import { SEED_STUDENT } from '../shared/env';

/**
 * تدفّق المصادقة في متصفّح حقيقي — real-browser auth flow against the running app + API.
 */

test('register a new student and land on the dashboard', async ({ page }) => {
  const email = `new-${Date.now()}@test.khatwa`;

  await page.goto('/register');
  await page.getByLabel('الاسم الكامل').fill('طالب جديد');
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByLabel('كلمة السر').fill('password123');
  await page.getByLabel('الصف / المرحلة').selectOption('7');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});

test('log in with a seeded student and reach the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill(SEED_STUDENT.password);
  await page.getByRole('button', { name: 'دخول' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});

test('wrong password shows an error and stays on the login page', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill('definitely-wrong');
  await page.getByRole('button', { name: 'دخول' }).click();

  await expect(page.getByText(/غير صحيحة/)).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test('visiting a protected page while logged out redirects to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
