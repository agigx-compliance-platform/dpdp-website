'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] text-white hover:shadow-[0_0_28px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5',
        secondary:
          'bg-secondary border border-border text-secondary-foreground hover:bg-secondary-hover hover:border-border/150',
        ghost:
          'text-muted-foreground hover:bg-secondary hover:text-foreground',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-secondary hover:border-primary/30',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_20px_hsl(var(--destructive)/0.3)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 py-2.5',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
