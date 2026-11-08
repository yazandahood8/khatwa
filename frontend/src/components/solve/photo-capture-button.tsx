'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImageToBase64, type CompressResult } from '@/lib/image-compress';

export interface PhotoCaptureHandle {
  /** يفتح الكاميرا برمجياً — programmatically open the camera (used after a barcode scan). */
  open: () => void;
}

interface Props {
  onCapture: (result: CompressResult) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

/**
 * زر "صوّر ورقتك" — يفتح كاميرا الجوال (input capture)، يضغط الصورة، ويسلّمها للمساعد.
 * Native rear-camera capture on mobile; falls back to a file picker on desktop.
 */
export const PhotoCaptureButton = forwardRef<PhotoCaptureHandle, Props>(function PhotoCaptureButton(
  { onCapture, onError, disabled },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => inputRef.current?.click(),
  }));

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // اسمح بإعادة التقاط نفس الملف — allow re-selecting the same file
    if (!file) return;
    setBusy(true);
    try {
      const result = await compressImageToBase64(file);
      onCapture(result);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'تعذّر معالجة الصورة');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFile}
      />
      <Button
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || busy}
      >
        <Camera /> {busy ? 'جارٍ التجهيز…' : 'صوّر ورقتك'}
      </Button>
    </>
  );
});
