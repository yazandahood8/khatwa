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

  // الذكاء الاصطناعي — Claude (used from Sprint 7)
  ANTHROPIC_API_KEY: z.string().optional(),

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
