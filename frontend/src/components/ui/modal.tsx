'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/**
 * نافذة منبثقة — accessible modal: portal, Esc / backdrop / close button,
 * body scroll lock, focus moved in and restored on close, Tab kept inside.
 */
export function Modal({
  open,
  onClose,
  title,
  headerClassName,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Tint of the header strip, e.g. `bg-tint-lavender`. */
  headerClassName?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="إغلاق"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[88vh] w-full max-w-3xl animate-fade-slide-up flex-col overflow-hidden rounded-[2rem] bg-card shadow-float outline-none ring-1 ring-primary/10',
          className,
        )}
      >
        <div className={cn('flex items-center justify-between gap-4 px-6 py-4 sm:px-8', headerClassName ?? 'bg-primary-light')}>
          <h2 id={titleId} className="font-display text-2xl font-extrabold sm:text-3xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-card text-foreground shadow-subtle transition-transform hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-6 scrollbar-thin sm:p-8">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
