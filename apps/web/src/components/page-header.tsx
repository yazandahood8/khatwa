import * as React from 'react';
import { cn } from '@/lib/utils';
import { DotGrid, Ring } from '@/components/decor';

const TONES = {
  lavender: 'bg-tint-lavender',
  sky: 'bg-tint-sky',
  lime: 'bg-lime-light',
  sun: 'bg-tint-sun',
  pink: 'bg-tint-pink',
} as const;

/**
 * رأس الصفحة — friendly tinted banner used at the top of app pages.
 * `icon` sits in a white round tile; `actions` render on the far side.
 */
export function PageHeader({
  title,
  description,
  icon,
  actions,
  tone = 'lavender',
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-wrap items-center gap-4 overflow-hidden rounded-3xl p-5 sm:p-6',
        TONES[tone],
        className,
      )}
    >
      <Ring className="-end-8 -top-10 h-32 w-32" />
      <DotGrid className="bottom-3 end-28 hidden h-12 w-20 sm:block" />
      {icon && (
        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-card">
          {icon}
        </span>
      )}
      <div className="relative min-w-0 flex-1">
        <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-0.5 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="relative flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
