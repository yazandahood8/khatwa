import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * عناصر زخرفية — playful decorative shapes shared by every page.
 * All are aria-hidden, pointer-events-none and meant to be absolutely
 * positioned by the caller through `className`.
 */
type DecorProps = { className?: string };

const base = 'pointer-events-none select-none';

export function Blob({ className, color = 'hsl(var(--primary-light))' }: DecorProps & { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={cn(base, 'absolute', className)}>
      <path
        fill={color}
        d="M44.7,-58.4C57.9,-48.5,68.4,-34.6,72.6,-18.9C76.8,-3.1,74.7,14.5,66.5,28.6C58.3,42.7,44,53.3,28.4,60.4C12.8,67.5,-4.1,71.1,-20.3,67.4C-36.5,63.7,-52,52.7,-62.2,38C-72.4,23.3,-77.3,4.9,-73.6,-11.4C-69.9,-27.7,-57.6,-41.9,-43.5,-51.6C-29.4,-61.3,-14.7,-66.5,0.7,-67.4C16.1,-68.3,31.5,-68.3,44.7,-58.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function Ring({ className, color = 'hsl(var(--primary) / 0.18)' }: DecorProps & { color?: string }) {
  return (
    <span
      aria-hidden
      className={cn(base, 'absolute rounded-full border-[14px]', className)}
      style={{ borderColor: color }}
    />
  );
}

export function DotGrid({ className, tone = 'blue' }: DecorProps & { tone?: 'blue' | 'white' }) {
  return (
    <span
      aria-hidden
      className={cn(base, 'absolute', tone === 'white' ? 'dots-white' : 'dots', className)}
    />
  );
}

export function Squiggle({ className, color = 'hsl(var(--primary))' }: DecorProps & { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 30" fill="none" className={cn(base, 'absolute', className)}>
      <path
        d="M2 15 C 14 2, 26 2, 38 15 S 62 28, 74 15 S 98 2, 118 15"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PaperPlane({ className }: DecorProps) {
  return (
    <svg aria-hidden viewBox="0 0 80 50" fill="none" className={cn(base, 'absolute', className)}>
      <path d="M4 22 L70 4 L46 44 L36 28 Z" fill="hsl(var(--lime))" />
      <path d="M36 28 L70 4 L40 34 Z" fill="hsl(var(--lime-dark) / 0.5)" />
      <path
        d="M2 40 C 12 36, 14 28, 6 24"
        stroke="hsl(var(--primary))"
        strokeWidth="1.8"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sparkle({ className, color = 'hsl(var(--lime))' }: DecorProps & { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn(base, 'absolute', className)}>
      <path d="M12 0 C13 8, 16 11, 24 12 C16 13, 13 16, 12 24 C11 16, 8 13, 0 12 C8 11, 11 8, 12 0Z" fill={color} />
    </svg>
  );
}

export function Star({ className, color = 'hsl(var(--gold))' }: DecorProps & { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn(base, 'absolute', className)}>
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Atom({ className, color = 'hsl(var(--primary))' }: DecorProps & { color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 80 80" fill="none" className={cn(base, 'absolute', className)}>
      <g stroke={color} strokeWidth="2" strokeLinecap="round">
        <ellipse cx="40" cy="40" rx="30" ry="11" />
        <ellipse cx="40" cy="40" rx="30" ry="11" transform="rotate(60 40 40)" />
        <ellipse cx="40" cy="40" rx="30" ry="11" transform="rotate(120 40 40)" />
      </g>
      <circle cx="40" cy="40" r="4" fill={color} />
    </svg>
  );
}

export function Trophy({ className }: DecorProps) {
  return (
    <svg aria-hidden viewBox="0 0 80 90" fill="none" className={cn(base, 'absolute', className)}>
      <g stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10h36v22a18 18 0 0 1-36 0V10Z" fill="hsl(var(--tint-sun))" />
        <path d="M22 16H10c0 12 5 18 14 20M58 16h12c0 12-5 18-14 20" />
        <path d="M40 50v14M28 78h24M32 64h16v14H32z" />
      </g>
      <path d="M40 18l2.6 5.2 5.8.8-4.2 4 1 5.8L40 31l-5.2 2.8 1-5.8-4.2-4 5.8-.8z" fill="hsl(var(--gold))" />
    </svg>
  );
}

/** Floating math symbols — «+ × ÷ π» — drifting around a hero. */
export function MathSymbol({
  char,
  className,
  tone = 'primary',
}: DecorProps & { char: string; tone?: 'primary' | 'lime' | 'pink' | 'sun' }) {
  const tones = {
    primary: 'bg-primary text-primary-foreground',
    lime: 'bg-lime text-foreground',
    pink: 'bg-tint-pink text-foreground',
    sun: 'bg-gold text-foreground',
  } as const;
  return (
    <span
      aria-hidden
      dir="ltr"
      className={cn(
        base,
        'absolute grid h-11 w-11 place-items-center rounded-2xl font-display text-2xl font-bold shadow-card',
        tones[tone],
        className,
      )}
    >
      {char}
    </span>
  );
}

/**
 * Hero illustration — an original "learner's desk": a progress card with a
 * step-by-step solution, a mascot-style badge, trophy, atom and math chips.
 * Purely decorative; sits in a relative box of any size ≥ 280px.
 */
export function HeroIllustration({ className }: DecorProps) {
  return (
    <div aria-hidden className={cn('relative mx-auto aspect-square w-full max-w-[460px]', className)}>
      <Blob className="inset-0 h-full w-full" color="hsl(var(--tint-sky))" />
      <Ring className="-start-4 bottom-6 h-24 w-24 animate-float-slow" />
      <DotGrid className="-end-2 top-10 h-24 w-28 opacity-70" />

      {/* Main card */}
      <div className="absolute inset-x-[10%] top-[14%] rotate-[-3deg] rounded-3xl bg-card p-5 shadow-float ring-1 ring-primary/10">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary font-display text-2xl font-bold text-primary-foreground shadow-glow-primary">
            خ
          </span>
          <div className="flex-1 space-y-2">
            <span className="block h-3 w-3/4 rounded-full bg-foreground/80" />
            <span className="block h-2.5 w-1/2 rounded-full bg-muted-foreground/30" />
          </div>
          <span className="rounded-full bg-lime px-3 py-1 font-display text-xs font-bold text-foreground">مستوى 5</span>
        </div>
        <div dir="ltr" className="space-y-2.5 rounded-2xl bg-secondary p-4 font-mono text-sm text-foreground">
          <p className="text-muted-foreground">x² − 5x + 6 = 0</p>
          <p>(x − 2)(x − 3) = 0</p>
          <p className="inline-block rounded-lg bg-lime px-2 py-0.5 font-bold">x = 2 , x = 3</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-light">
          <span className="block h-full w-2/3 rounded-full bg-primary" />
        </div>
      </div>

      {/* Chat bubble */}
      <div className="absolute bottom-[12%] end-[2%] w-[48%] rotate-2 rounded-3xl rounded-es-md bg-primary p-4 text-primary-foreground shadow-float animate-float">
        <span className="mb-2 block h-2.5 w-4/5 rounded-full bg-white/80" />
        <span className="block h-2.5 w-3/5 rounded-full bg-white/50" />
      </div>

      <Trophy className="-start-2 top-[2%] h-24 w-20 animate-float" />
      <Atom className="bottom-[8%] start-[4%] h-16 w-16 animate-drift" />
      <MathSymbol char="+" className="end-[4%] top-[4%] animate-float [--rot:8deg]" tone="lime" />
      <MathSymbol char="π" className="start-[28%] -bottom-1 animate-float-slow [--rot:-6deg]" tone="sun" />
      <MathSymbol char="×" className="end-[26%] bottom-[2%] animate-drift [--rot:6deg]" tone="pink" />
      <Sparkle className="end-[18%] top-[0%] h-6 w-6 animate-float" />
      <Sparkle className="start-[14%] top-[38%] h-5 w-5 animate-float-slow" color="hsl(var(--primary))" />
      <Star className="end-[0%] top-[44%] h-8 w-8 animate-drift" />
    </div>
  );
}

/** Compact decorative corner for banners and cards. */
export function CornerShapes({ className, tone = 'white' }: DecorProps & { tone?: 'white' | 'blue' }) {
  return (
    <div aria-hidden className={cn(base, 'absolute inset-0 overflow-hidden', className)}>
      <Ring
        className="-end-10 -top-10 h-40 w-40"
        color={tone === 'white' ? 'hsl(0 0% 100% / 0.14)' : 'hsl(var(--primary) / 0.1)'}
      />
      <DotGrid tone={tone === 'white' ? 'white' : 'blue'} className="bottom-4 start-4 h-16 w-24 opacity-60" />
      <Sparkle className="end-[22%] bottom-5 h-5 w-5 animate-float" />
    </div>
  );
}
