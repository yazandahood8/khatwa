import { test, expect, type Page } from '@playwright/test';
import { SEED_STUDENT } from '../shared/env';

/**
 * تصفّح المحتوى — Sprint 3: courses lazy tree, expand/collapse, expand-all,
 * view toggle (شجرة/قائمة), and the lesson view (no-video empty state).
 * كله قراءة محتوى بلا ذكاء اصطناعي. يعتمد لقطة محتوى الإنتاج الحقيقية (e2e/shared/seed.ts):
 * رياضيات → صف 7 → موحّد → المتغيرات والتعابير الجبرية → «ما هو المتغير ولماذا نستخدمه».
 */

const SUBJECT = 'رياضيات';
const GRADE = 'صف 7';
const LEVEL = 'موحّد';
const TOPIC = 'المتغيرات والتعابير الجبرية';
const LESSON = 'ما هو المتغير ولماذا نستخدمه';

async function loginSeeded(page: Page) {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(SEED_STUDENT.email);
  await page.getByLabel('كلمة السر').fill(SEED_STUDENT.password);
  await page.getByRole('button', { name: 'دخول' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** يفتح شجرة الدروس حتى الموضوع — expands the tree down to the topic node. */
async function drillToTopic(page: Page) {
  await page.getByRole('button', { name: SUBJECT }).click();
  await page.getByRole('button', { name: GRADE }).click();
  await page.getByRole('button', { name: LEVEL }).click();
  await page.getByRole('button', { name: TOPIC }).click();
}

// ── T3.1 ─────────────────────────────────────────────────────────────────────
test('T3.1 courses tree lazy-loads children only on expand', async ({ page }) => {
  await loginSeeded(page);
  await page.goto('/courses');

  // المادة الجذر ظاهرة، لكن الصف لم يُحمّل بعد.
  await expect(page.getByRole('button', { name: SUBJECT })).toBeVisible();
  await expect(page.getByRole('button', { name: GRADE })).toHaveCount(0);

  await page.getByRole('button', { name: SUBJECT }).click();

  // بعد التوسيع يظهر الصف، لكن المستوى الأعمق ما زال غير محمّل.
  await expect(page.getByRole('button', { name: GRADE })).toBeVisible();
  await expect(page.getByRole('button', { name: LEVEL })).toHaveCount(0);
});

// ── T3.2 (long) ───────────────────────────────────────────────────────────────
test('T3.2 drilling the tree reaches the lesson and problems leaves', async ({ page }) => {
  await loginSeeded(page);
  await page.goto('/courses');
  await drillToTopic(page);

  await expect(page.getByRole('button', { name: LESSON })).toBeVisible();
  // صفّ المسائل يظهر (لا نضغطه — حلّ المسائل في Sprint 4).
  await expect(page.getByRole('button', { name: /المسائل \(\d+\)/ })).toBeVisible();
});

// ── T3.3 ─────────────────────────────────────────────────────────────────────
test('T3.3 clicking a node expands then collapses its children', async ({ page }) => {
  await loginSeeded(page);
  await page.goto('/courses');

  await page.getByRole('button', { name: SUBJECT }).click();
  await expect(page.getByRole('button', { name: GRADE })).toBeVisible();

  await page.getByRole('button', { name: SUBJECT }).click();
  await expect(page.getByRole('button', { name: GRADE })).toHaveCount(0);

  await page.getByRole('button', { name: SUBJECT }).click();
  await expect(page.getByRole('button', { name: GRADE })).toBeVisible();
});

// ── T3.4 (long) ───────────────────────────────────────────────────────────────
// «توسيع الكل» على محتوى الإنتاج الكامل يوسّع الشجرة بالكامل (سلوك إنتاج حقيقي)،
// فنمنحه مهلة أوسع.
test('T3.4 expand-all reveals a deep leaf and collapse-all hides it', async ({ page }) => {
  test.setTimeout(90_000);
  await loginSeeded(page);
  await page.goto('/courses');

  await page.getByRole('button', { name: 'توسيع الكل' }).click();
  await expect(page.getByRole('button', { name: 'طيّ الكل' })).toBeVisible();
  await expect(page.getByRole('button', { name: LESSON })).toBeVisible({ timeout: 45_000 });

  await page.getByRole('button', { name: 'طيّ الكل' }).click();
  await expect(page.getByRole('button', { name: 'توسيع الكل' })).toBeVisible();
  await expect(page.getByRole('button', { name: GRADE })).toHaveCount(0);
});

// ── T3.5 ─────────────────────────────────────────────────────────────────────
test('T3.5 view toggle switches between tree and menu', async ({ page }) => {
  await loginSeeded(page);
  await page.goto('/courses');

  // الوضع الافتراضي: شجرة، وزرّ «توسيع الكل» ظاهر.
  await expect(page.getByRole('button', { name: 'شجرة' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'توسيع الكل' })).toBeVisible();

  await page.getByRole('button', { name: 'قائمة' }).click();
  await expect(page.getByRole('button', { name: 'قائمة' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'توسيع الكل' })).toHaveCount(0);
  // عرض القائمة يعرض المادة كبطاقة.
  await expect(page.getByText(SUBJECT)).toBeVisible();

  await page.getByRole('button', { name: 'شجرة' }).click();
  await expect(page.getByRole('button', { name: 'شجرة' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'توسيع الكل' })).toBeVisible();
});

// ── T3.6 (long) ───────────────────────────────────────────────────────────────
test('T3.6 opening a lesson renders its info and no-video empty state', async ({ page }) => {
  await loginSeeded(page);
  await page.goto('/courses');
  await drillToTopic(page);

  await page.getByRole('button', { name: LESSON }).click();

  await expect(page).toHaveURL(/\/lessons\//);
  await expect(page.getByRole('heading', { name: LESSON })).toBeVisible();
  // دروس الإنتاج بلا فيديو → حالة فارغة صريحة (بلا فيديو/ذكاء اصطناعي).
  await expect(page.getByText('لم يُرفع فيديو لهذا الدرس بعد.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'كل الدروس' })).toBeVisible();
});
