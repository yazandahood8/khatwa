import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * شعار خطوة — the wordmark: a rounded blue tile stamped with «خ», a lime
 * spark on its corner, and the name set in the chunky display face.
 * `tone="ink"` is for blue surfaces such as the sidebar (white tile, white text).
 */
export function BrandMark({
  tone = 'paper',
  href = '/',
  className,
  size = 'md',
}: {
  tone?: 'paper' | 'ink';
  href?: string;
  className?: string;
  size?: 'md' | 'lg';
}) {
  const tile = size === 'lg' ? 'h-12 w-12 text-3xl' : 'h-10 w-10 text-2xl';
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 font-display font-extrabold',
        size === 'lg' ? 'text-3xl' : 'text-2xl',
        tone === 'ink' ? 'text-white' : 'text-foreground',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative grid place-items-center rounded-2xl pb-0.5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105',
          tile,
          tone === 'paper'
            ? 'bg-primary text-primary-foreground shadow-glow-primary'
            : 'bg-white text-primary shadow-[0_4px_0_0_hsl(var(--lime))]',
        )}
      >
        خ
        <span className="absolute -end-1 -top-1 h-3.5 w-3.5 rounded-full bg-lime ring-2 ring-white" />
      </span>
      خطوة
    </Link>
  );
}
