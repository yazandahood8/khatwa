/**
 * تحويل النص إلى كلام بالعربي — Arabic text-to-speech.
 * يستدعي خادم Khatwa (Azure Neural TTS، صوت فصحى واضح) ويشغّل الـ MP3 الناتج.
 * عند تعذّر الخادم يرجع تلقائياً لصوت المتصفح (Web Speech API) كحل بديل.
 */
import { getToken } from './auth-cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

let current: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
let seq = 0; // لتجاهل الطلبات القديمة عند تتابع النداءات

/** الصوت مدعوم دائماً في المتصفح (تشغيل MP3) — audio playback is available. */
export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

/** لم يعد لازماً مع الخادم — kept as a no-op so callers don't change. */
export function primeVoices(): void {
  /* الأصوات الآن على الخادم — nothing to warm up client-side. */
}

/** ينظّف النص للقراءة — strip tags, emojis, and markdown before speaking. */
function cleanForSpeech(text: string): string {
  return text
    .replace(/\[(SOLVED|NEW_METHOD|CORRECT|PARTIAL|INCORRECT)\]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '') // إزالة الإيموجي
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stopSpeaking(): void {
  seq++; // يُبطل أي طلب قيد التنفيذ
  if (current) {
    current.pause();
    current.src = '';
    current = null;
  }
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/** حل بديل بصوت المتصفح عند تعذّر الخادم — browser-voice fallback. */
function fallbackSpeak(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  const arVoice = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith('ar'));
  if (arVoice) u.voice = arVoice;
  window.speechSynthesis.speak(u);
}

/** ينطق النص بالعربي — speak Arabic text (cancels any current speech first). */
export function speak(text: string): void {
  if (!ttsAvailable()) return;
  const clean = cleanForSpeech(text);
  if (!clean) return;

  stopSpeaking();
  const mySeq = ++seq;

  const token = getToken();
  void fetch(`${API_URL}/api/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text: clean }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      if (mySeq !== seq) return; // طلب أحدث ألغى هذا — a newer speak() superseded us
      const url = URL.createObjectURL(blob);
      currentUrl = url;
      const audio = new Audio(url);
      current = audio;
      audio.onended = () => {
        if (currentUrl === url) {
          URL.revokeObjectURL(url);
          currentUrl = null;
        }
        if (current === audio) current = null;
      };
      await audio.play();
    })
    .catch(() => {
      if (mySeq === seq) fallbackSpeak(clean); // الخادم غير متاح — استعمل صوت المتصفح
    });
}
