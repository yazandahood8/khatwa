'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { QrCode } from 'lucide-react';
import { getProblemByCode } from '@/lib/problems-api';
import { QRScanner } from '@/components/scan/qr-scanner';
import { Button } from '@/components/ui/button';

/** يستخرج كود المسألة من نص الباركود (رابط …/scan?c=CODE أو الكود مباشرة). */
function extractCode(raw: string): string | null {
  const t = raw.trim();
  try {
    const c = new URL(t).searchParams.get('c');
    if (c) return c;
  } catch {
    /* ليس رابطاً كاملاً — قد يكون الكود مباشرة */
  }
  return /^[A-Za-z0-9._-]+$/.test(t) ? t : null;
}

function ScanFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const handledRef = useRef(false);

  const resolveCode = useCallback(
    async (code: string) => {
      if (handledRef.current) return;
      handledRef.current = true;
      setResolving(true);
      setError(null);
      try {
        const p = await getProblemByCode(code);
        // الميزة للرياضيات فقط: أسئلة البرمجة (language) تفتح صفحة الحل بلا تصوير.
        router.replace(p.language ? `/problems/${p.id}/solve` : `/problems/${p.id}/solve?photo=1`);
      } catch {
        setError('لم نتعرّف على السؤال. تأكد أن الباركود من ورقة خطوة.');
        handledRef.current = false;
        setResolving(false);
      }
    },
    [router],
  );

  const handleDecode = useCallback(
    (text: string) => {
      const code = extractCode(text);
      if (!code) {
        setError('الباركود غير صالح. جرّب مرة ثانية.');
        return;
      }
      void resolveCode(code);
    },
    [resolveCode],
  );

  // كود ممرَّر مباشرة عبر الرابط (?c=) — من كاميرا الهاتف الأصلية التي فتحت الرابط.
  useEffect(() => {
    const c = params.get('c');
    if (c) void resolveCode(c);
  }, [params, resolveCode]);

  const directCode = params.get('c');

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow-primary">
          <QrCode className="h-7 w-7" />
        </span>
        <h1 className="font-display text-3xl font-extrabold">امسح سؤال الرياضيات</h1>
        <p className="text-sm text-muted-foreground">
          وجّه الكاميرا على الباركود الموجود بجانب السؤال في ورقتك، وبعدها صوّر حلّك ليحلّله المساعد الذكي.
        </p>
      </div>

      {resolving || directCode ? (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">جارٍ فتح السؤال…</span>
        </div>
      ) : (
        <div className="w-full">
          <QRScanner onDecode={handleDecode} onError={setError} />
        </div>
      )}

      {error && (
        <div className="space-y-3">
          <p className="rounded-2xl bg-destructive/10 px-5 py-3 text-sm font-semibold text-destructive">
            {error}
          </p>
          <Link href="/courses">
            <Button variant="secondary">العودة للدروس</Button>
          </Link>
        </div>
      )}
    </main>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-muted-foreground">
          جارٍ التحميل…
        </main>
      }
    >
      <ScanFlow />
    </Suspense>
  );
}
