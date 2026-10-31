import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-bold transition-all duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[1.1em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary — bright blue pill on a chunky ledge; presses down on click
        default:
          'bg-primary text-primary-foreground shadow-glow-primary hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-[3px] active:shadow-none',
        // Secondary — white pill with a soft blue ring
        secondary:
          'bg-card text-foreground ring-2 ring-primary/20 hover:bg-primary-light hover:ring-primary/40 active:translate-y-px',
        // Ghost — transparent, soft blue wash on hover
        ghost: 'text-primary hover:bg-accent hover:text-accent-foreground',
        // Danger — soft red that fills on hover
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground',
        // Outline (kept for shadcn compatibility)
        outline:
          'bg-card text-foreground ring-2 ring-primary/20 hover:bg-primary-light hover:ring-primary/40 active:translate-y-px',
        link: 'text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary',
        // Hero CTA — lime pill with navy text and a dark-lime ledge
        gradient:
          'bg-lime text-foreground shadow-glow-lime hover:-translate-y-0.5 hover:brightness-105 active:translate-y-[3px] active:shadow-none',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-[15px]',
        md: 'h-11 px-6 text-[15px]',
        lg: 'h-[54px] px-9 text-base',
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
