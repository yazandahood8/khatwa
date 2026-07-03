'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPair, getPair, newPairId, type MediaType } from '@/lib/pair-api';
import { cn } from '@/lib/utils';

interface Props {
  problemId: string;
  onPhoto: (image: string, mediaType: MediaType) => void;
  triggerClassName?: string;
}

const DEADLINE_MS = 5 * 60 * 1000; // صلاحية الرمز — matches server TTL

/**
 * ربط الجوال بالكمبيوتر لتصوير الورقة — shows a QR on the PC; the phone scans it,
 * photographs the paper, and the photo streams back here to feed the AI on the PC.
 */
export function PhoneCaptureHandoff({ problemId, onPhoto, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    stop();
    setOpen(false);
    setQr(null);
    setError(null);
  }, [stop]);

  const start = useCallback(async () => {
    stop();
    const pairId = newPairId();
    setOpen(true);
    setError(null);
    setQr(null);
    try {
      await createPair(pairId, problemId);
      const url = `${window.location.origin}/capture?pair=${pairId}&p=${encodeURIComponent(problemId)}`;
      setQr(await QRCode.toDataURL(url, { margin: 1, width: 220 }));

      const deadline = Date.now() + DEADLINE_MS;
      let inFlight = false;
      timerRef.current = setInterval(async () => {
        if (inFlight) return;
        if (Date.now() > deadline) {
          stop();
          setError('انتهت صلاحية الرمز. أعد المحاولة.');
          return;
        }
        inFlight = true;
        try {
          const res = await getPair(pairId);
          if (res.status === 'ready' && res.image) {
            stop();
            onPhoto(res.image, res.mediaType ?? 'image/jpeg');
            close();
          } else if (res.status === 'expired') {
            stop();
            setError('انتهت صلاحية الرمز. أعد المحاولة.');
          }
        } catch {
          /* خطأ استعلام مؤقت — نتجاهله ونعيد المحاولة */
        } finally {
          inFlight = false;
        }
      }, 2000);
    } catch (e) {
      stop();
      setError(e instanceof Error ? e.message : 'تعذّر إنشاء جلسة الربط');
    }
  }, [problemId, onPhoto, stop, close]);

  useEffect(() => () => stop(), [stop]); // تنظيف عند مغادرة الصفحة

  return (
    <>
      <Button
        variant="secondary"
        className={cn(triggerClassName)}
        onClick={open ? close : start}
      >
        <Smartphone /> صوّر بالجوال
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 text-center shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display font-semibold">صوّر ورقتك بالجوال</span>
              <button
                onClick={close}
                aria-label="إغلاق"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error ? (
              <div className="space-y-3">
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
                <Button onClick={start} className="w-full">
                  إعادة المحاولة
                </Button>
              </div>
            ) : qr ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="رمز الربط" className="mx-auto w-44" />
                <p className="text-sm text-muted-foreground">
                  امسح الرمز بكاميرا جوالك، صوّر ورقتك، وبيوصل الرد هون على شاشة الكمبيوتر.
                </p>
                <p className="flex items-center justify-center gap-2 text-xs text-primary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> بانتظار الصورة…
                </p>
              </div>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">جارٍ التجهيز…</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
