import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Labels look like tabs cut from paper — small radius, never pills
  'inline-flex items-center gap-1 rounded-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-light text-primary',
        secondary: 'bg-muted text-muted-foreground',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        destructive: 'bg-destructive/10 text-destructive',
        // Streak — solid warning chip on a ledge
        streak: 'gradient-streak text-white shadow-glow-streak',
        // Achievement — highlighter swatch
        achievement: 'bg-highlight/70 text-foreground',
        outline: 'border border-border text-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-tiny',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
