# 🏗️ إعداد البنية التحتية — Sprint 1 Infra Checklist

هذه الخطوات تحتاج **حسابات ومفاتيح حقيقية** ولا يمكن أتمتتها من الكود. أنجزها بالترتيب،
واملأ القيم في `backend/.env` و `frontend/.env.local`.

---

## 1. ✅ Supabase (PostgreSQL) — قاعدة البيانات

1. أنشئ حساباً على <https://supabase.com> ثم **New Project**.
2. اختر **Region** قريبة (مثلاً `Central EU (Frankfurt)`).
3. احفظ كلمة سر قاعدة البيانات.
4. من **Project Settings → Database → Connection string → URI** انسخ الرابط.
5. ضعه في `backend/.env` كـ `DATABASE_URL`.
6. شغّل من جذر المشروع:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```
7. تحقق من ظهور كل الجداول الـ16 في **Supabase → Table Editor**.

> 💡 للـ migration عبر الـ pooler قد تحتاج رابطين: `DATABASE_URL` (pooled :6543)
> و `DIRECT_URL` (:5432). إن واجهت مشاكل، أضف `directUrl` في `schema.prisma`.

---

## 2. 🎥 AWS S3 + CloudFront — تخزين الفيديوهات

1. أنشئ/استخدم حساب AWS.
2. **S3 → Create bucket** باسم `khatwa-videos` في نفس الـ Region.
3. أنشئ مستخدم **IAM** بصلاحية `AmazonS3FullAccess` (مؤقتاً)، واحفظ
   `AWS_ACCESS_KEY_ID` و `AWS_SECRET_ACCESS_KEY`.
4. **CloudFront → Create distribution** مصدره الـ S3 bucket، واحفظ رابط التوزيع في
   `AWS_CLOUDFRONT_URL`.
5. اختبر رفع ملف تجريبي والوصول إليه عبر رابط CloudFront.

> الاستخدام الفعلي للرفع يبدأ في **Sprint 3**؛ يكفي الآن إنشاء الموارد.

---

## 3. ⚡ Redis — Rate Limiting

الخيار الأسهل **Upstash** (مجاني للبداية):

1. <https://upstash.com> → **Create Database** (نوع Redis، نفس الـ Region).
2. انسخ **Redis URL** (`redis://default:...@...:6379`) إلى `REDIS_URL`.
3. الكود يتصل تلقائياً عند وجود `REDIS_URL` (انظر `backend/src/services/redis.ts`).

> بديل: إضافة Redis plugin على Railway.

---

## 4. ▲ Vercel — نشر الـ Frontend

1. <https://vercel.com> → **Add New → Project** واربطه بمستودع GitHub.
2. **Root Directory:** `frontend`.
3. أضف متغيرات البيئة (من `frontend/.env.example`).
4. احفظ `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` كـ GitHub Secrets.

---

## 5. 🚂 Railway — نشر الـ Backend

1. <https://railway.app> → **New Project → Deploy from GitHub repo**.
2. **Root Directory:** `backend` — Start command: `npm run start`
   (وbuild: `npm run build && npm run prisma:generate`).
3. أضف متغيرات البيئة من `backend/.env.example`.
4. احفظ `RAILWAY_TOKEN` كـ GitHub Secret.

---

## 6. 🤖 GitHub Actions — النشر التلقائي

- `.github/workflows/ci.yml` — يعمل تلقائياً (lint + typecheck + build) على كل Push/PR.
- `.github/workflows/deploy.yml` — فيه خطوات النشر معلّقة (TODO)؛ فعّلها بعد إضافة الـ Secrets
  أعلاه وإزالة أسطر `echo` ووضع أوامر النشر الفعلية.

---

## ✅ Definition of Done — Sprint 1

- [ ] `GET /health` يرجع 200 على Staging (Railway)
- [ ] صفحة Next.js تفتح على Vercel بدون أخطاء
- [ ] كل الجداول الـ16 موجودة في Supabase
- [ ] S3 Bucket يستقبل ملفات
- [ ] Redis يستجيب (Set/Get)
- [ ] GitHub Actions ينشر تلقائياً عند Push على `develop`
