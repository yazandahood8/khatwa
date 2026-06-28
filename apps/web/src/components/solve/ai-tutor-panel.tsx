'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { streamTutor, getAiQuota, type TutorTurn } from '@/lib/ai-api';
import { ApiClientError } from '@/lib/api';
import { Button } from '@/components/ui/button';

export interface AiTutorHandle {
  sendStep: (stepText: string) => void;
}

interface Props {
  problemId: string;
  getState: () => { attemptsCount: number; current: string };
}

export const AiTutorPanel = forwardRef<AiTutorHandle, Props>(function AiTutorPanel(
  { problemId, getState },
  ref,
) {
  const [messages, setMessages] = useState<TutorTurn[]>([
    { role: 'assistant', content: 'أهلاً! أنا هون معك 😊 ابدأ تحلّ واسألني وقت ما تعلق.' },
  ]);
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAiQuota()
      .then((q) => {
        setRemaining(q.remaining);
        setConfigured(q.configured);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send(userMessage: string) {
    if (busy) return;
    setError(null);
    const history = messages.filter((m) => m.content.trim()).slice(-10);
    setMessages((m) => [...m, { role: 'user', content: userMessage }, { role: 'assistant', content: '' }]);
    setRemaining((r) => (r != null ? Math.max(0, r - 1) : r)); // تحديث فوري
    setBusy(true);
    try {
      const { remaining: rem } = await streamTutor(
        problemId,
        { message: userMessage, attemptsCount: getState().attemptsCount, history },
        (chunk) => {
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
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : 'تعذّر الاتصال بالمساعد';
      setError(msg);
      setMessages((m) => m.slice(0, -1)); // أزل فقاعة الرد الفارغة
    } finally {
      setBusy(false);
    }
  }

  useImperativeHandle(ref, () => ({
    sendStep: (stepText: string) => {
      if (stepText.trim()) void send(`خطوتي: ${stepText}`);
    },
  }));

  function askHint() {
    const { current } = getState();
    void send(current.trim() ? `أنا عند: ${current} — ممكن تلميح؟` : 'ممكن تلميح للبداية؟');
  }
  function askSimpler() {
    void send('مش فاهم، ممكن تشرح أبسط؟');
  }

  return (
    <div className="flex h-full flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="font-medium">🤖 المساعد الذكي</span>
        {configured && remaining != null && (
          <span className="text-xs text-muted-foreground">بقي {remaining} اليوم</span>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3" style={{ maxHeight: '50vh' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              m.role === 'user'
                ? 'ms-auto bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {m.content.replace(/\s*\[NEW_METHOD\]\s*/g, '') ||
              (busy && i === messages.length - 1 ? '…' : '')}
          </div>
        ))}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {!configured && (
        <p className="px-3 pb-2 text-xs text-muted-foreground">
          المساعد الذكي قيد الإعداد. سيتفعّل قريباً.
        </p>
      )}

      <div className="flex gap-2 border-t p-2">
        <Button size="sm" variant="outline" onClick={askHint} disabled={busy || !configured}>
          💡 تلميح
        </Button>
        <Button size="sm" variant="outline" onClick={askSimpler} disabled={busy || !configured}>
          🤔 مش فاهم
        </Button>
      </div>
    </div>
  );
});
