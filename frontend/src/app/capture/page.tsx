'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Camera, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImageToBase64 } from '@/lib/image-compress';
import { uploadPairPhoto } from '@/lib/pair-api';

type Status = 'idle' | 'processing' | 'done' | 'error';

function CaptureFlow() {
  const pairId = useSearchParams().get('pair') ?? '';
  const inputRef = useRef<HTMLInputElement>(null);
  const autoRef = useRef(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const openCamera = useCallback(() => inputRef.current?.click(), []);

  // افتح الكاميرا فور فتح الصفحة (أفضل جهد) — auto-open the camera on arrival.
  useEffect(() => {
    if (autoRef.current || !pairId) return;
    autoRef.current = true;
    openCamera();
  }, [pairId, openCamera]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // اسمح بإعادة الالتقاط
    if (!file) return;
    setStatus('processing');
    setError(null);
    try {
      const { base64, mediaType } = await compressImageToBase64(file);
      await uploadPairPhoto(pairId, { image: base64, mediaType });
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'تعذّر إرسال الصورة');
    }
  }

  if (!pairId) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">رابط غير صالح. أعد المسح من شاشة الكمبيوتر.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFile}
      />

      {status === 'done' ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 className="h-14 w-14 text-success" />
          <h1 className="font-display text-xl font-bold">تم إرسال الصورة ✅</h1>
          <p className="text-sm text-muted-foreground">
            شوف رد المساعد الذكي على شاشة الكمبيوتر. تقدر تصوّر صورة ثانية إذا بدك.
          </p>
          <Button onClick={openCamera} variant="secondary">
            <Camera /> صوّر مرة ثانية
          </Button>
        </div>
      ) : status === 'processing' ? (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">جارٍ إرسال الصورة…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <Camera className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold">صوّر ورقتك</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              التقط صورة واضحة للسؤال وحلّك، وبتنبعث تلقائياً للمساعد على الكمبيوتر.
            </p>
          </div>
          {status === 'error' && error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button onClick={openCamera} size="lg" className="w-full">
            <Camera /> فتح الكاميرا
          </Button>
          <Link href="/courses" className="text-xs text-muted-foreground hover:underline">
            إلغاء
          </Link>
        </div>
      )}
    </main>
  );
}

export default function CapturePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-muted-foreground">
          جارٍ التحميل…
        </main>
      }
    >
      <CaptureFlow />
    </Suspense>
  );
}
