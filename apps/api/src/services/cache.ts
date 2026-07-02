import { redis } from './redis';
import { logger } from '../utils/logger';

/**
 * تخزين مؤقت بسيط بمهلة (TTL) فوق Redis — read-through cache for rarely-changing reads.
 * يخفّف ضغط قاعدة البيانات (Supabase عبر المنطقة) على مسارات الكتالوج القابلة للقراءة كثيراً.
 *
 * تدهور رشيق: إذا كان Redis غير مضبوط أو تعذّر الوصول إليه، نُنفّذ المُحمّل مباشرةً.
 * لا إبطال صريح — الإدخالات تنتهي خلال ttlSeconds (تظهر تعديلات الأدمن خلال هذه المهلة).
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  if (!redis) return loader();

  try {
    const hit = await redis.get(key);
    if (hit !== null) return JSON.parse(hit) as T;
  } catch (err) {
    logger.warn(`cache read miss (${key})`, err instanceof Error ? err.message : String(err));
  }

  const data = await loader();

  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    logger.warn(`cache write failed (${key})`, err instanceof Error ? err.message : String(err));
  }

  return data;
}

/** مهلة افتراضية لكتالوج المحتوى (مواد/صفوف/مستويات/مواضيع/نماذج) — content rarely changes. */
export const CATALOG_TTL_SECONDS = 60;
