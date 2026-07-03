import { apiFetch } from './api';

/**
 * ربط الكمبيوتر بالجوال لتصوير الورقة — cross-device photo handoff client.
 * الكمبيوتر ينشئ الجلسة ويستعلم؛ الجوال يرفع الصورة.
 */
export type MediaType = 'image/png' | 'image/jpeg';

export interface PairPollResult {
  status: 'waiting' | 'ready' | 'expired';
  image?: string;
  mediaType?: MediaType;
}

/** رمز ربط عشوائي (بلا شرطات) — unguessable pairing token for the QR. */
export function newPairId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

export const createPair = (pairId: string, problemId: string) =>
  apiFetch<{ ok: boolean }>('/api/pair', {
    method: 'POST',
    body: JSON.stringify({ pairId, problemId }),
  });

export const uploadPairPhoto = (
  pairId: string,
  body: { image: string; mediaType: MediaType },
) =>
  apiFetch<{ ok: boolean }>(`/api/pair/${pairId}/photo`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const getPair = (pairId: string) => apiFetch<PairPollResult>(`/api/pair/${pairId}`);
