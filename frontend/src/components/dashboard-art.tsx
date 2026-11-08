'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * مكان صورة — an illustration slot served from /public/dashboard/<name>.png.
 * Until the file exists it renders `fallback` (or nothing), so the layout never shows a broken image.
 */
export function DashArt({
  name,
  className,
  fallback = null,
  ext = 'png',
}: {
  name: string;
  className?: string;
  fallback?: React.ReactNode;
  ext?: 'png' | 'jpg' | 'webp' | 'svg';
}) {
  const [failed, setFailed] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>(null);

  // The image may fail before hydration attaches onError.
  React.useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={`/dashboard/${name}.${ext}`}
      alt=""
      aria-hidden
      draggable={false}
      onError={() => setFailed(true)}
      className={cn('pointer-events-none select-none object-contain', className)}
    />
  );
}
