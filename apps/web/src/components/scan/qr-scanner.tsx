'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REGION_ID = 'khatwa-qr-region';

interface Props {
  onDecode: (text: string) => void;
  onError?: (message: string) => void;
}

/**
 * ماسح باركود (QR) بكاميرا الجوال — live camera QR scanner (html5-qrcode).
 * يُشغَّل بلمسة المستخدم (شرط iOS Safari) ويحتاج HTTPS. يُوقف الكاميرا عند الخروج.
 */
export function QRScanner({ onDecode, onError }: Props) {
  // نوع الماسح مُحمَّل ديناميكياً (مكتبة تعتمد على DOM) — keep it out of SSR.
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const decodedRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    return () => {
      void stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function stop() {
    const s = scannerRef.current;
    scannerRef.current = null;
    if (s) {
      try {
        await s.stop();
        s.clear();
      } catch {
        /* الكاميرا موقوفة أصلاً */
      }
    }
    setScanning(false);
  }

  async function start() {
    setStarting(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode(REGION_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text: string) => {
          if (decodedRef.current) return; // امسك أول قراءة فقط
          decodedRef.current = true;
          void stop();
          onDecode(text);
        },
        () => {
          /* أخطاء فك كل إطار — نتجاهلها */
        },
      );
      setScanning(true);
    } catch {
      onError?.('تعذّر تشغيل الكاميرا. تأكد من إعطاء الإذن واستخدام اتصال آمن (HTTPS).');
      await stop();
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        id={REGION_ID}
        className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-black/5"
      />
      {!scanning && (
        <Button onClick={start} disabled={starting} size="lg" className="w-full">
          <Camera /> {starting ? 'جارٍ التشغيل…' : 'شغّل الكاميرا وامسح الباركود'}
        </Button>
      )}
    </div>
  );
}
