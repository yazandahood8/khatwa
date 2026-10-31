'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Volume2, VolumeX, Send } from 'lucide-react';
import { streamLessonChat, getAiQuota, type TutorTurn } from '@/lib/ai-api';
import { ApiClientError } from '@/lib/api';
import { createSpeaker, stopSpeaking, primeVoices, ttsAvailable, type Speaker } from '@/lib/tts';

interface Props {
  lessonId: string;
  lessonTitle?: string;
}

/**
 * معلّم الدرس — lesson-scoped AI chat. يشرح ويجاوب على أسئلة الطالب حول هذا الدرس فقط.
 * مبنيّ على نمط AiTutorPanel لكن بصندوق إدخال نصّي حرّ بدل أزرار الخطوات.
 */
export function LessonChatPanel({ lessonId, lessonTitle }: Props) {
  const [messages, setMessages] = useState<TutorTurn[]>([
    {
      role: 'assistant',
      content: `أهلاً! أنا معلّمك لدرس${lessonTitle ? ` «${lessonTitle}»` : ' هذا'} 😊 اسألني أيّ إشي عن الدرس وأنا بشرحلك.`,
    },
  ]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false); // يُحدَّد بعد التحميل لتفادي اختلاف الـ SSR
  const mutedRef = useRef(false);
  const speakerRef = useRef<Speaker | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanSpeak(ttsAvailable());
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      localStorage.setItem('khatwa_tts_muted', next ? '1' : '0');
      if (next) stopSpeaking();
      return next;
    });
  }

  async function send(userMessage: string) {
    const text = userMessage.trim();
    if (busy || !text || !configured) return;
    setError(null);
    setDraft('');
    const history = messages.filter((m) => m.content.trim()).slice(-10);
    setMessages((m) => [...m, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    setRemaining((r) => (r != null && r > 0 ? r - 1 : r)); // تحديث فوري (إلا غير المحدود)
    setBusy(true);
    const speaker = mutedRef.current ? null : createSpeaker();
    speakerRef.current = speaker;
    try {
      const { remaining: rem } = await streamLessonChat(
        lessonId,
        { message: text, history },
        (chunk) => {
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
      speaker?.finish();
    } catch (e) {
      speaker?.stop();
      const msg = e instanceof ApiClientError ? e.message : 'تعذّر الاتصال بالمساعد';
      setError(msg);
      setMessages((m) => m.slice(0, -1)); // أزل فقاعة الرد الفارغة
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card">
      {/* رأس — header */}
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <span className="flex items-center gap-2 font-display font-bold text-primary-foreground">
          <Sparkles className="h-[18px] w-[18px]" /> اسأل عن الدرس
        </span>
        <div className="flex items-center gap-2">
          {configured && remaining != null && (
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {remaining < 0 ? 'غير محدود ∞' : `بقي ${remaining} اليوم`}
            </span>
          )}
          {canSpeak && (
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
          // أزل الحركات من العرض — strip harakat (kept only for speech)
          const text = m.content.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u0640]/g, '');
          const isAssistant = m.role === 'assistant';
          const isEmptyStreaming = isAssistant && !text && busy && i === messages.length - 1;
          return (
            <div
              key={i}
              className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-slide-up`}
            >
              <div
                className={`max-w-[88%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
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
        {error && (
          <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}
      </div>

      {!configured && (
        <p className="px-4 pb-2 text-xs text-muted-foreground">
          المساعد الذكي قيد الإعداد. سيتفعّل قريباً.
        </p>
      )}

      {/* صندوق الإدخال — text input */}
      <form
        className="flex items-end gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send(draft);
            }
          }}
          rows={1}
          placeholder="اكتب سؤالك عن الدرس…"
          disabled={busy || !configured}
          className="max-h-28 min-h-[40px] flex-1 resize-none rounded-2xl border-2 border-input/80 bg-secondary/60 px-4 py-2 text-sm outline-none transition-colors focus:border-primary focus:bg-card disabled:opacity-50 scrollbar-thin"
        />
        <button
          type="submit"
          disabled={busy || !configured || !draft.trim()}
          aria-label="إرسال"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow-primary transition-all hover:-translate-y-0.5 disabled:opacity-40"
        >
          <Send className="h-[18px] w-[18px]" />
        </button>
      </form>
    </div>
  );
}

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
