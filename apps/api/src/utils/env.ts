import { config } from 'dotenv';
import { z } from 'zod';

// تحميل متغيرات البيئة من .env — Load environment variables
config();

/**
 * مخطط التحقق من متغيرات البيئة.
 * Validates env vars at startup so the server fails fast on misconfiguration.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),

  // قاعدة البيانات — Database (Supabase PostgreSQL)
  DATABASE_URL: z.string().url().optional(), // pooled (runtime)
  DIRECT_URL: z.string().url().optional(), // direct (migrations)

  // Redis — Rate limiting & caching
  REDIS_URL: z.string().optional(),

  // الواجهة — Frontend origin for CORS
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),

  // المصادقة — Auth
  JWT_SECRET: z.string().min(16).optional(),

  // الذكاء الاصطناعي — Claude (Sprint 7)
  ANTHROPIC_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().default('claude-sonnet-4-6'),
  // باقة الطالب الافتراضية عند غياب اشتراك فعّال — keep "free" so AI cost is bounded.
  AI_DEFAULT_PLAN: z.enum(['free', 'basic', 'premium']).default('free'),

  // البيتا المغلقة — منح بريميوم تلقائياً عند تسجيل الطالب. اضبط "true" للتفعيل أثناء البيتا.
  BETA_AUTO_PREMIUM: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),

  // البريد — Transactional email over SMTP (provider-agnostic; optional).
  // عند غياب الإعداد يُسجَّل البريد في اللوج بدل إرساله (تطوير).
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(), // مثال: "خطوة <no-reply@khatwa.app>"

  // الدفع — PayPlus (optional; falls back to mock upgrade when unset)
  PAYPLUS_BASE_URL: z.string().url().default('https://restapi.payplus.co.il'), // staging: restapidev.payplus.co.il
  PAYPLUS_API_KEY: z.string().optional(),
  PAYPLUS_SECRET_KEY: z.string().optional(),
  PAYPLUS_PAYMENT_PAGE_UID: z.string().optional(),
  API_PUBLIC_URL: z.string().url().optional(), // الرابط العام للـ API لاستقبال الـ IPN

  // تخزين الفيديوهات — Object storage (Cloudflare R2, S3-compatible)
  S3_REGION: z.string().default('auto'),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ متغيرات بيئة غير صالحة — Invalid environment variables:');
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
