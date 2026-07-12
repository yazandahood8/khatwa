'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Sparkles, Lightbulb, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { streamTutor, getAiQuota, type TutorTurn } from '@/lib/ai-api';
import { ApiClientError } from '@/lib/api';
import { createSpeaker, stopSpeaking, primeVoices, ttsAvailable, type Speaker } from '@/lib/tts';
import { Button } from '@/components/ui/button';

export interface AiTutorHandle {
  sendStep: (stepText: string) => void;
  sendDraft: (imageBase64: string) => void;
  sendPhoto: (imageBase64: string, mediaType?: 'image/png' | 'image/jpeg') => void;
}

interface Props {
  problemId: string;
  getState: () => { attemptsCount: number; current: string };
  onSolved?: () => void;
  /** نتيجة خطوة كتبها الطالب: صحيحة (true) أو خاطئة (false) — لتلوين قائمة الخطوات. */
  onStepResult?: (ok: boolean) => void;
}

/** يستخرج الخيارات السريعة من وسم [OPTIONS] — parses quick-choice options from the reply. */
function parseOptions(content: string): string[] {
  const m = content.match(/\[OPTIONS\]([^\n]*)/);
  if (!m) return [];
  return m[1]
    .split('|')
    .map((s) => s.replace(/[ؐ-ًؚ-ٰٟـ]/g, '').trim())
    .filter(Boolean)
    .slice(0, 4);
}

export const AiTutorPanel = forwardRef<AiTutorHandle, Props>(function AiTutorPanel(
  { problemId, getState, onSolved, onStepResult },
  ref,
) {
  const [messages, setMessages] = useState<TutorTurn[]>([
    { role: 'assistant', content: 'أهلاً! أنا هون معك 😊 ابدأ تحلّ واسألني وقت ما تعلق.' },
  ]);
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const speakerRef = useRef<Speaker | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const starterHintIndexRef = useRef(0); // فهرس تلميح البداية المتدرّج (يُصفَّر مع كل مسألة)

  useEffect(() => {
    primeVoices();
    const m = typeof localStorage !== 'undefined' && localStorage.getItem('khatwa_tts_muted') === '1';
    setMuted(m);
    mutedRef.current = m;
    getAiQuota()
      .then((q) => {
        setRemaining(q.remaining);
        setConfigured(q.configured);
      })
      .catch(() => {});
    return () => stopSpeaking();
  }, []);

  // مسألة جديدة — ابدأ تلميحات البداية من الأول
  useEffect(() => {
    starterHintIndexRef.current = 0;
  }, [problemId]);

  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      localStorage.setItem('khatwa_tts_muted', next ? '1' : '0');
      if (next) stopSpeaking();
      return next;
    });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send(
    userMessage: string,
    image?: string,
    mediaType?: 'image/png' | 'image/jpeg',
    starterHintIndex?: number,
    isStep?: boolean,
  ) {
    if (busy) return;
    setError(null);
    const history = messages.filter((m) => m.content.trim()).slice(-10);
    setMessages((m) => [...m, { role: 'user', content: userMessage }, { role: 'assistant', content: '' }]);
    setRemaining((r) => (r != null && r > 0 ? r - 1 : r)); // تحديث فوري (إلا غير المحدود)
    setBusy(true);
    // متحدّث بثّي ينطق الرد جملةً جملة مع تدفّق النص — speaks each sentence as it streams
    const speaker = mutedRef.current ? null : createSpeaker();
    speakerRef.current = speaker;
    let acc = '';
    try {
      const { remaining: rem } = await streamTutor(
        problemId,
        { message: userMessage, attemptsCount: getState().attemptsCount, history, image, mediaType, starterHintIndex },
        (chunk) => {
          acc += chunk;
          speaker?.feed(chunk); // ينطق فور اكتمال كل جملة
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              role: 'assistant',
              content: copy[copy.length - 1].content + chunk,
            };
            return copy;
          });
        },
      );
      if (rem != null) setRemaining(rem);
      speaker?.finish(); // انطق ما تبقّى من نص بعد آخر علامة وقف
      if (/\[SOLVED\]/.test(acc)) onSolved?.(); // المساعد أكّد اكتمال الحل
      if (isStep) onStepResult?.(!/\[WRONG\]/.test(acc)); // خطوة صحيحة إلا إذا حملت وسم [WRONG]
    } catch (e) {
      speaker?.stop();
      const msg = e instanceof ApiClientError ? e.message : 'تعذّر الاتصال بالمساعد';
      setError(msg);
      setMessages((m) => m.slice(0, -1)); // أزل فقاعة الرد الفارغة
    } finally {
      setBusy(false);
    }
  }

  useImperativeHandle(ref, () => ({
    sendStep: (stepText: string) => {
      if (stepText.trim()) void send(`خطوتي: ${stepText}`, undefined, undefined, undefined, true);
    },
    sendDraft: (imageBase64: string) => {
      void send('📝 هاي مسودتي المكتوبة بخط يدي، راجعها وساعدني', imageBase64);
    },
    sendPhoto: (imageBase64: string, mediaType: 'image/png' | 'image/jpeg' = 'image/jpeg') => {
      void send('📄 صورة ورقتي — السؤال وحلّي، حلّلها من فضلك', imageBase64, mediaType);
    },
  }));

  function askHint() {
    const { current } = getState();
    if (current.trim()) {
      void send(`أنا عند: ${current} — ممكن تلميح؟`);
      return;
    }
    // تلميح بداية مجاني (بلا AI): يتدرّج مع كل ضغطة حتى تنفد التلميحات المخزّنة
    const idx = starterHintIndexRef.current;
    starterHintIndexRef.current += 1;
    void send('ممكن تلميح للبداية؟', undefined, undefined, idx);
  }
  function askSimpler() {
    void send('مش فاهم، ممكن تشرح أبسط؟');
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* رأس — header */}
      <div className="flex items-center justify-between border-b border-border bg-primary-light/50 px-4 py-3">
        <span className="flex items-center gap-2 font-display font-semibold text-primary">
          <Sparkles className="h-[18px] w-[18px]" /> المساعد الذكي
        </span>
        <div className="flex items-center gap-2">
          {configured && remaining != null && (
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {remaining < 0 ? 'غير محدود ∞' : `بقي ${remaining} اليوم`}
            </span>
          )}
          {ttsAvailable() && (
            <button
              onClick={toggleMute}
              title={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
              aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
              className="grid h-7 w-7 place-items-center rounded-full bg-white text-muted-foreground transition-colors hover:text-primary"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* الرسائل — chat */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((m, i) => {
          // أزل الوسوم والحركات من العرض — strip tags + harakat (kept only for speech)
          const text = m.content
            .replace(/\s*\[(NEW_METHOD|SOLVED|WRONG)\]\s*/g, '')
            .replace(/\s*\[OPTIONS\][^\n]*/g, '')
            .replace(/[ؐ-ًؚ-ٰٟـ]/g, '');
          const isAssistant = m.role === 'assistant';
          const isEmptyStreaming = isAssistant && !text && busy && i === messages.length - 1;
          return (
            <div
              key={i}
              className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-slide-up`}
            >
              <div
                className={`max-w-[88%] px-4 py-2.5 text-sm leading-relaxed ${
                  isAssistant
                    ? 'rounded-[18px] rounded-bl-[4px] bg-primary-light text-foreground'
                    : 'rounded-[18px] rounded-br-[4px] bg-primary text-primary-foreground'
                }`}
              >
                {isEmptyStreaming ? <TypingDots /> : text}
              </div>
            </div>
          );
        })}
        {/* خيارات سريعة — clickable quick-choice pills for the last tutor turn */}
        {(() => {
          const last = messages[messages.length - 1];
          if (busy || !last || last.role !== 'assistant') return null;
          const options = parseOptions(last.content);
          if (!options.length) return null;
          return (
            <div className="flex flex-wrap justify-start gap-2 pt-1 animate-fade-slide-up">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => void send(opt)}
                  disabled={busy || !configured}
                  className="rounded-full border border-primary/40 bg-white px-3.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          );
        })()}
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}
      </div>

      {!configured && (
        <p className="px-4 pb-2 text-xs text-muted-foreground">
          المساعد الذكي قيد الإعداد. سيتفعّل قريباً.
        </p>
      )}

      {/* أزرار — actions */}
      <div className="flex gap-2 border-t border-border p-3">
        <Button size="sm" variant="secondary" className="flex-1" onClick={askHint} disabled={busy || !configured}>
          <Lightbulb className="text-gold" /> تلميح
        </Button>
        <Button size="sm" variant="secondary" className="flex-1" onClick={askSimpler} disabled={busy || !configured}>
          <HelpCircle /> مش فاهم
        </Button>
      </div>
    </div>
  );
});

/** مؤشّر الكتابة — three animated dots. */
function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-primary/70 animate-typing-dot"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}
