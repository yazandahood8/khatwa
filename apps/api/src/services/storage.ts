import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../utils/env';
import { ApiError } from '../utils/ApiError';

/**
 * عميل التخزين (Cloudflare R2 عبر S3 API) — storage client.
 * null إذا لم تُضبط المتغيرات بعد.
 */
export const storage =
  env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY && env.S3_ENDPOINT
    ? new S3Client({
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: true, // مطلوب لـ R2
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
      })
    : null;

export const isStorageConfigured = () => storage !== null && Boolean(env.S3_BUCKET);

function client(): S3Client {
  if (!storage || !env.S3_BUCKET) {
    throw ApiError.internal('التخزين غير مهيأ (S3/R2 env vars مفقودة)');
  }
  return storage;
}

const URL_TTL = 60 * 60; // ساعة للرفع
const PLAYBACK_TTL = 60 * 60 * 6; // 6 ساعات للمشاهدة

/** رابط رفع موقّع — presigned PUT URL for direct browser→storage upload. */
export function presignUpload(key: string, contentType: string): Promise<string> {
  return getSignedUrl(
    client(),
    new PutObjectCommand({ Bucket: env.S3_BUCKET!, Key: key, ContentType: contentType }),
    { expiresIn: URL_TTL },
  );
}

/** رابط مشاهدة موقّع — presigned GET URL for playback. */
export function presignDownload(key: string): Promise<string> {
  return getSignedUrl(client(), new GetObjectCommand({ Bucket: env.S3_BUCKET!, Key: key }), {
    expiresIn: PLAYBACK_TTL,
  });
}

/** حذف كائن — delete an object. */
export async function deleteObject(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET!, Key: key }));
}

/** يجلب بايتات كائن — fetch object bytes, or null if it doesn't exist. */
export async function getObjectBytes(key: string): Promise<Buffer | null> {
  try {
    const out = await client().send(new GetObjectCommand({ Bucket: env.S3_BUCKET!, Key: key }));
    if (!out.Body) return null;
    const bytes = await out.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch (e) {
    const status = (e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if ((e as { name?: string }).name === 'NoSuchKey' || status === 404) return null;
    throw e;
  }
}

/** يرفع بايتات كائن من الخادم — upload object bytes directly (server-side). */
export async function putObjectBytes(key: string, body: Buffer, contentType: string): Promise<void> {
  await client().send(
    new PutObjectCommand({ Bucket: env.S3_BUCKET!, Key: key, Body: body, ContentType: contentType }),
  );
}
