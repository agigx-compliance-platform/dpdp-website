import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'badge bg-secondary text-secondary-foreground border border-border',
        success: 'badge-success',
        warning: 'badge-warning',
        destructive: 'badge-destructive',
        info: 'badge-info',
        outline: 'badge border border-border text-foreground bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
