import { createHash } from 'node:crypto';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getObjectBytes, putObjectBytes, isStorageConfigured } from './storage';

/**
 * تحويل النص إلى كلام عربي عبر Azure Neural TTS مع تخزين مؤقت في R2.
 * Arabic text-to-speech via Azure, with generated MP3s cached in object storage
 * so identical text is synthesized once and served free thereafter.
 */

export const isTtsConfigured = () =>
  Boolean(env.AZURE_SPEECH_KEY && env.AZURE_SPEECH_REGION);

// MP3 صغير الحجم وجودة كافية للنطق — small, clear enough for speech.
const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

/** ينظّف النص للقراءة — strip tags, emojis, and markdown before speaking. */
function cleanForSpeech(text: string): string {
  return text
    .replace(/\[(SOLVED|NEW_METHOD|CORRECT|PARTIAL|INCORRECT)\]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '') // إزالة الإيموجي
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSsml(text: string, voice: string): string {
  const lang = voice.split('-').slice(0, 2).join('-'); // ar-SA-ZariyahNeural → ar-SA
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}"><voice name="${voice}">${escapeXml(
    text,
  )}</voice></speak>`;
}

async function azureSynthesize(text: string, voice: string): Promise<Buffer> {
  const url = `https://${env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': env.AZURE_SPEECH_KEY!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': OUTPUT_FORMAT,
      'User-Agent': 'khatwa-tts',
    },
    body: buildSsml(text, voice),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    logger.error(`Azure TTS ${res.status}: ${detail.slice(0, 300)}`);
    throw ApiError.internal('تعذّر توليد الصوت');
  }
  return Buffer.from(await res.arrayBuffer());
}

/**
 * ينطق النص ويعيد بايتات MP3 — synthesize speech, returning MP3 bytes.
 * يفحص الذاكرة المؤقتة أولاً، ثم يولّد من Azure ويخزّن الناتج.
 */
export async function synthesizeSpeech(rawText: string, voiceOverride?: string): Promise<Buffer> {
  if (!isTtsConfigured()) {
    throw ApiError.internal('خدمة الصوت غير مهيأة بعد (AZURE_SPEECH_KEY مفقود)');
  }
  const text = cleanForSpeech(rawText);
  if (!text) throw ApiError.badRequest('لا يوجد نص لقراءته');
  const voice = voiceOverride || env.AZURE_TTS_VOICE;

  const hash = createHash('sha256').update(`${voice}:${text}`).digest('hex');
  const key = `tts/${hash}.mp3`;

  // 1) الذاكرة المؤقتة — cache lookup (best-effort; failure just means we regenerate)
  if (isStorageConfigured()) {
    const cached = await getObjectBytes(key).catch((e) => {
      logger.warn(`TTS cache read failed: ${e instanceof Error ? e.message : e}`);
      return null;
    });
    if (cached) return cached;
  }

  // 2) توليد من Azure — synthesize
  const audio = await azureSynthesize(text, voice);

  // 3) تخزين للمرات القادمة — store (fire-and-forget)
  if (isStorageConfigured()) {
    void putObjectBytes(key, audio, 'audio/mpeg').catch((e) =>
      logger.warn(`TTS cache write failed: ${e instanceof Error ? e.message : e}`),
    );
  }
  return audio;
}
