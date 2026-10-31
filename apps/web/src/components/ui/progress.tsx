'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** شريط تقدّم خطّي — animated linear progress bar drawn like a ruler (10% ticks). */
export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative h-2 w-full overflow-hidden rounded-sm bg-muted', className)}
    >
      <div
        className={cn(
          'h-full rounded-sm bg-primary transition-[width] duration-700 ease-soft',
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--card))_1px,transparent_1px)] bg-[length:10%_100%] opacity-70"
      />
    </div>
  );
}

/** تقدّم دائري — SVG circular progress with centered label. */
export function CircularProgress({
  value,
  size = 96,
  stroke = 8,
  className,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 rtl:rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-primary-light"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="butt"
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-soft"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display font-bold">
        {children ?? `${Math.round(pct)}%`}
      </div>
    </div>
  );
}
