/**
 * تحويل النص إلى كلام بالعربي — Arabic text-to-speech via the browser Web Speech API (free).
 * يقرأ ردود المساعد بصوت الجهاز. لا تكلفة ولا خادم.
 */

export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** يختار صوتاً عربياً إن وُجد — pick an Arabic voice if the device has one. */
function arabicVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang?.toLowerCase().startsWith('ar')) ?? null;
}

/** ينظّف النص للقراءة — strip tags, emojis, and markdown before speaking. */
function cleanForSpeech(text: string): string {
  return text
    .replace(/\[(SOLVED|NEW_METHOD)\]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '') // إزالة الإيموجي
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** يحمّل الأصوات مبكراً (تُحمّل بشكل غير متزامن) — warm up the voice list. */
export function primeVoices(): void {
  if (!ttsAvailable()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

export function stopSpeaking(): void {
  if (ttsAvailable()) window.speechSynthesis.cancel();
}

/** ينطق النص بالعربي — speak Arabic text (cancels any current speech first). */
export function speak(text: string): void {
  if (!ttsAvailable()) return;
  const clean = cleanForSpeech(text);
  if (!clean) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'ar-SA';
  const v = arabicVoice();
  if (v) u.voice = v;
  u.rate = 1;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}
