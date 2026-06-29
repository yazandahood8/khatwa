import { cn } from '@/lib/utils';

/** هيكل تحميل — shimmering loading skeleton (never a bare spinner). */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent',
        className,
      )}
      {...props}
    />
  );
}
