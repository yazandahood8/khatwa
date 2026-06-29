import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-[1.1em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary — indigo, lifts + glows on hover
        default:
          'bg-primary text-primary-foreground shadow-card hover:bg-primary-dark hover:-translate-y-px hover:shadow-elevated',
        // Secondary — white w/ border, indigo on hover
        secondary:
          'border-[1.5px] border-border bg-card text-foreground hover:border-primary hover:text-primary',
        // Ghost — transparent, soft indigo wash on hover
        ghost: 'text-primary hover:bg-accent hover:text-accent-foreground',
        // Danger — soft red that fills on hover
        destructive:
          'border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive hover:text-destructive-foreground',
        // Outline (kept for shadcn compatibility)
        outline:
          'border-[1.5px] border-border bg-card text-foreground hover:border-primary hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline',
        // Gradient hero CTA
        gradient:
          'gradient-primary text-white shadow-glow-primary hover:-translate-y-px hover:shadow-float',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-sm',
        default: 'h-11 rounded-md px-6 text-[15px]',
        md: 'h-11 rounded-md px-6 text-[15px]',
        lg: 'h-[52px] rounded-md px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
