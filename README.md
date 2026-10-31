# 🎓 Khatwa — منصة تعليمية تفاعلية

منصة تعليم ذكية للطلاب العرب في إسرائيل (صفوف 7–12) — دروس فيديو مسجّلة + مساعد ذكاء اصطناعي سقراطي يوجّه الطالب خطوة بخطوة دون إعطاء الجواب مباشرة.

> Smart tutoring platform for Arab students in Israel. Recorded video lessons + a Socratic AI assistant that guides students step-by-step without giving away the answer.

---

## 🗂️ هيكل المشروع — Monorepo

```
khatwa/
├── apps/
│   ├── web/          ← Next.js 14 Frontend (App Router, Tailwind, shadcn/ui)
│   └── api/          ← Express + TypeScript Backend (Prisma, Redis)
├── packages/
│   └── shared/       ← Types مشتركة بين الواجهة والخادم
├── package.json      ← npm workspaces root
└── README.md
```

## 🧰 التقنيات — Tech Stack

| الطبقة | التقنيات |
|--------|----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript, Prisma, Zod |
| Database | Supabase (PostgreSQL), Redis |
| Storage | AWS S3 + CloudFront |
| AI | Claude API (Anthropic SDK) |
| Auth | NextAuth.js, JWT |
| Payments | PayPlus |
| Deploy | Vercel (web), Railway (api), GitHub Actions |

## 🚀 البدء — Getting Started

### المتطلبات
- Node.js >= 20
- npm >= 10
- حساب Supabase (PostgreSQL) — انظر `apps/api/.env.example`

### التثبيت

```bash
# من جذر المشروع
npm install
```

### إعداد متغيرات البيئة

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Frontend
cp apps/web/.env.example apps/web/.env.local
```
ثم املأ القيم الحقيقية (انظر قسم البنية التحتية أدناه).

### قاعدة البيانات (Prisma)

```bash
npm run prisma:generate
npm run prisma:migrate
```

### التشغيل للتطوير

```bash
npm run dev:api    # Backend  → http://localhost:4000
npm run dev:web    # Frontend → http://localhost:3000
```

تحقق من الخادم: `GET http://localhost:4000/health` → `{ "status": "ok" }`

---

## 🌿 استراتيجية الفروع — Branch Strategy

```
main          ← الإنتاج (Production) — محمي
develop       ← التطوير (Staging) — النشر التلقائي
feature/*     ← كل ميزة على فرع مستقل تُدمج في develop
```

## 🏗️ البنية التحتية — Manual Infra Setup (Sprint 1)

هذه الخطوات تحتاج حسابات ومفاتيح حقيقية — انظر [docs/INFRA_SETUP.md](docs/INFRA_SETUP.md).

1. **Supabase** — مشروع PostgreSQL + `DATABASE_URL`
2. **AWS S3 + CloudFront** — تخزين الفيديوهات
3. **Redis** — Upstash أو Railway (Rate Limiting)
4. **Vercel** — نشر الـ Frontend
5. **Railway** — نشر الـ Backend
6. **GitHub Actions** — نشر تلقائي عند Push على `develop`

---

## 📋 خطة السبرينتات

انظر [sprints_plan.md](docs/sprints_plan.md) — 12 سبرينت × أسبوعان = 6 أشهر.
الحالة الحالية: **Sprint 1 — الأساسيات والبنية التحتية**.

*المالك: يزن داوود*
