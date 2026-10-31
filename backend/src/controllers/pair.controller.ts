import type { Request, Response } from 'express';
import { z } from 'zod';
import { redis } from '../services/redis';
import { ApiError } from '../utils/ApiError';

/**
 * ربط الكمبيوتر بالجوال لتصوير الورقة — cross-device handoff.
 * الكمبيوتر يعرض باركوداً يحمل pairId؛ الجوال يمسحه، يصوّر الورقة ويرفعها؛
 * الكمبيوتر يستعلم (polling) فيلتقط الصورة ويحلّلها عبر المساعد الذكي على شاشته.
 * الصورة تُخزَّن مؤقتاً في Redis بعمر قصير — never persisted to the DB.
 */
const PAIR_TTL = 300; // ثوانٍ (5 دقائق) — صلاحية جلسة الربط
const pairKey = (id: string) => `pair:${id}`;
const photoKey = (id: string) => `pair:${id}:photo`;

const idSchema = z.string().regex(/^[a-zA-Z0-9]{16,64}$/, 'رمز ربط غير صالح');
const createSchema = z.object({ pairId: idSchema, problemId: z.string().min(1) });
const photoSchema = z.object({
  image: z.string().min(1).max(4_000_000),
  mediaType: z.enum(['image/png', 'image/jpeg']).default('image/jpeg'),
});

function requireRedis() {
  if (!redis) throw ApiError.internal('خدمة الربط غير متاحة حالياً');
  return redis;
}

/** POST /api/pair — الكمبيوتر ينشئ جلسة ربط ويربطها بالطالب والمسألة. */
export async function createPair(req: Request, res: Response) {
  const r = requireRedis();
  const { pairId, problemId } = createSchema.parse(req.body);
  await r.set(
    pairKey(pairId),
    JSON.stringify({ studentId: req.user!.id, problemId }),
    'EX',
    PAIR_TTL,
  );
  res.json({ success: true, data: { ok: true } });
}

/** POST /api/pair/:pairId/photo — الجوال يرفع صورة الورقة إلى جلسة الربط. */
export async function uploadPairPhoto(req: Request, res: Response) {
  const r = requireRedis();
  const pairId = idSchema.parse(req.params.pairId);
  const { image, mediaType } = photoSchema.parse(req.body);

  const raw = await r.get(pairKey(pairId));
  if (!raw) throw ApiError.notFound('انتهت صلاحية الرمز. أعد المسح من الكمبيوتر');
  const pair = JSON.parse(raw) as { studentId: string };
  // نفس الطالب فقط — الجوال والكمبيوتر لازم يكونا لنفس الحساب.
  if (pair.studentId !== req.user!.id) throw ApiError.forbidden('سجّل الدخول بنفس حساب الكمبيوتر');

  await r.set(photoKey(pairId), JSON.stringify({ image, mediaType }), 'EX', PAIR_TTL);
  res.json({ success: true, data: { ok: true } });
}

/** GET /api/pair/:pairId — الكمبيوتر يستعلم عن وصول الصورة (polling). */
export async function getPair(req: Request, res: Response) {
  const r = requireRedis();
  const pairId = idSchema.parse(req.params.pairId);

  const raw = await r.get(pairKey(pairId));
  if (!raw) {
    res.json({ success: true, data: { status: 'expired' } });
    return;
  }
  const pair = JSON.parse(raw) as { studentId: string };
  if (pair.studentId !== req.user!.id) throw ApiError.forbidden('غير مصرّح');

  const photoRaw = await r.get(photoKey(pairId));
  if (!photoRaw) {
    res.json({ success: true, data: { status: 'waiting' } });
    return;
  }
  // صورة جاهزة: سلّمها مرة واحدة ثم نظّف الجلسة — one-shot delivery, then cleanup.
  await r.del(photoKey(pairId), pairKey(pairId));
  const photo = JSON.parse(photoRaw) as { image: string; mediaType: 'image/png' | 'image/jpeg' };
  res.json({ success: true, data: { status: 'ready', ...photo } });
}
