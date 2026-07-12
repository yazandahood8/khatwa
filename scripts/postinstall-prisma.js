/**
 * إعادة توليد Prisma Client بعد التثبيت — regenerate the Prisma client on install.
 *
 * المخطّط في apps/api/prisma/schema.prisma، فلا يجده التوليد التلقائي لـ @prisma/client
 * (يبحث في جذر المستودع). هذا يولّده صراحةً حيث يتوفّر prisma (تثبيت Railway/الـ API)،
 * ويتخطّاه بهدوء حيث لا يتوفّر (تثبيت الويب على Vercel لا يحتاج العميل) — فلا يكسر أيّ تثبيت.
 */
const { execSync } = require('node:child_process');

try {
  execSync('prisma generate --schema=apps/api/prisma/schema.prisma', { stdio: 'inherit' });
} catch (err) {
  console.log('[postinstall] تخطّي prisma generate:', err && err.message ? err.message : err);
  // لا نُفشل التثبيت — العميل غير مطلوب في بيئة الويب.
}
