import { cn } from '@/lib/utils';

/**
 * عنوان قسم — bold section title; wrap the key word in `<em>` style by passing
 * `accent` (rendered in blue with a lime underline stroke).
 */
export function SectionHeading({
  kicker,
  title,
  accent,
  description,
  align = 'center',
  tone = 'light',
  className,
}: {
  kicker?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: 'center' | 'start';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-start', className)}>
      {kicker && (
        <span
          className={cn(
            'mb-4 inline-flex rounded-full px-4 py-1.5 font-display text-sm font-bold',
            tone === 'dark' ? 'bg-white/15 text-white' : 'bg-primary-light text-primary-dark',
          )}
        >
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          'font-display text-3xl font-extrabold leading-tight sm:text-4xl',
          tone === 'dark' ? 'text-white' : 'text-foreground',
        )}
      >
        {title}{' '}
        {accent && (
          <span className={cn('relative inline-block', tone === 'dark' ? 'text-lime' : 'text-primary')}>
            {accent}
            <svg
              aria-hidden
              viewBox="0 0 120 10"
              preserveAspectRatio="none"
              className="absolute -bottom-1.5 start-0 h-2 w-full"
              fill="none"
            >
              <path
                d="M2 6 C 30 1, 60 9, 118 3"
                stroke="hsl(var(--lime))"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </h2>
      {description && (
        <p className={cn('mt-4 text-lg', tone === 'dark' ? 'text-white/80' : 'text-muted-foreground')}>
          {description}
        </p>
      )}
    </div>
  );
}
