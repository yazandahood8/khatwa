import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * شعار خطوة — the wordmark: a paper tile stamped with «خ», a red margin
 * tick on its start edge, and the name set in the display face.
 * `tone="ink"` is for dark (ink) surfaces such as the sidebar.
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
  const tile = size === 'lg' ? 'h-10 w-10 text-xl' : 'h-9 w-9 text-lg';
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 font-display font-bold',
        size === 'lg' ? 'text-2xl' : 'text-xl',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative grid place-items-center overflow-hidden rounded-md border-[1.5px] transition-transform duration-200 group-hover:-rotate-3',
          tile,
          tone === 'paper'
            ? 'border-foreground bg-card text-foreground shadow-[0_3px_0_0_hsl(var(--foreground))]'
            : 'border-sidebar-foreground/80 bg-sidebar-foreground text-sidebar shadow-[0_3px_0_0_hsl(var(--margin))]',
        )}
      >
        <span className="absolute inset-y-0 start-1.5 w-px bg-margin/80" />
        خ
      </span>
      خطوة
    </Link>
  );
}
