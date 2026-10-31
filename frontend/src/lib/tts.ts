/**
 * تحويل النص إلى كلام بالعربي — Arabic text-to-speech.
 * يستدعي خادم Khatwa (Azure Neural TTS، صوت فصحى واضح مع الحركات) ويشغّل الـ MP3.
 *
 * البثّ المتزامن: بدل انتظار اكتمال الرد، يقطّع النص المتدفّق إلى جُمل وينطق كل جملة
 * فور اكتمالها، فيسير الصوت مع ظهور النص جملةً جملة. عند تعذّر الخادم يرجع لصوت المتصفح.
 */
import { getToken } from './auth-cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

let activeStop: (() => void) | null = null; // يوقف المتحدّث الحالي

/** تشغيل الصوت مدعوم دائماً في المتصفح — audio playback is available. */
export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

/** لم يعد لازماً مع الخادم — kept as a no-op so callers don't change. */
export function primeVoices(): void {
  /* الأصوات الآن على الخادم — nothing to warm up client-side. */
}

/** ينظّف النص للقراءة — strip tags, emojis, and markdown (الحركات تبقى للنطق). */
function stripForSpeech(text: string): string {
  return text
    .replace(/\[OPTIONS\][^\n]*/g, '') // سطر الخيارات السريعة — لا يُقرأ بصوت
    .replace(/\[(SOLVED|NEW_METHOD|CORRECT|PARTIAL|INCORRECT)\]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '') // إزالة الإيموجي
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchMp3(text: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}`);
  return res.blob();
}

/** صوت المتصفح كحل بديل — browser-voice fallback (queues, does not cancel). */
function fallbackSpeak(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  const v = window.speechSynthesis.getVoices().find((x) => x.lang?.toLowerCase().startsWith('ar'));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  activeStop?.();
  activeStop = null;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/** متحدّث بثّي — feed streamed text, it speaks each sentence as it completes. */
export interface Speaker {
  feed(chunk: string): void; // ادفع قطعة نص متدفّقة
  finish(): void; // انتهى التدفّق — انطق ما تبقّى
  stop(): void; // ألغِ كل شيء
}

// حدود الجُمل — flush audio at sentence-ending punctuation (not commas: too small).
const BOUNDARY = /[.!?؟؛\n]/;

const NOOP_SPEAKER: Speaker = { feed() {}, finish() {}, stop() {} };

/**
 * ينشئ متحدّثاً بثّياً — creates a streaming speaker. يلغي أي نطق جارٍ.
 * الجمل تُجلب بالتوازي وتُشغَّل بالترتيب، فيبدأ الصوت فور اكتمال أول جملة.
 */
export function createSpeaker(): Speaker {
  if (!ttsAvailable()) return NOOP_SPEAKER;
  stopSpeaking(); // ألغِ المتحدّث السابق

  let buffer = '';
  let stopped = false;
  let chain: Promise<void> = Promise.resolve(); // تشغيل متسلسل بالترتيب
  const audios = new Set<HTMLAudioElement>();

  const stop = () => {
    stopped = true;
    for (const a of audios) {
      a.pause();
      a.src = '';
    }
    audios.clear();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  activeStop = stop;

  function playBlob(blob: Blob): Promise<void> {
    return new Promise((resolve) => {
      if (stopped) return resolve();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audios.add(audio);
      const done = () => {
        URL.revokeObjectURL(url);
        audios.delete(audio);
        resolve();
      };
      audio.onended = done;
      audio.onerror = done;
      audio.play().catch(done);
    });
  }

  function enqueue(rawSentence: string) {
    const clean = stripForSpeech(rawSentence);
    if (!clean) return;
    const audioP = fetchMp3(clean).catch(() => null); // ابدأ الجلب فوراً (بالتوازي)
    chain = chain.then(async () => {
      if (stopped) return;
      const blob = await audioP;
      if (stopped) return;
      if (blob) await playBlob(blob);
      else fallbackSpeak(clean); // الخادم غير متاح — صوت المتصفح (مصفوف في الطابور)
    });
  }

  function drain(flushAll: boolean) {
    if (stopped) return;
    let idx: number;
    while ((idx = buffer.search(BOUNDARY)) !== -1) {
      enqueue(buffer.slice(0, idx + 1));
      buffer = buffer.slice(idx + 1);
    }
    if (flushAll && buffer.trim()) {
      enqueue(buffer);
      buffer = '';
    }
  }

  return {
    feed(chunk: string) {
      if (stopped) return;
      buffer += chunk;
      drain(false);
    },
    finish() {
      drain(true);
    },
    stop,
  };
}

/** ينطق نصاً كاملاً دفعة واحدة — one-shot speak (kept for compatibility). */
export function speak(text: string): void {
  const s = createSpeaker();
  s.feed(text);
  s.finish();
}
