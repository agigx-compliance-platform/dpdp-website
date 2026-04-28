'use client'

import { cn } from '@/lib/utils'
import { ShieldCheck, ArrowRight } from 'lucide-react'

interface ScanOptionStepProps {
  value: boolean | undefined
  onChange: (value: boolean) => void
}

export function ScanOptionStep({ value, onChange }: ScanOptionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Would you like a free privacy risk scan?
        </h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;ll scan your website for consent banners, cookie compliance, privacy
          policies, and DSAR mechanisms — giving you an instant compliance score.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'flex flex-col items-center gap-4 rounded-xl border p-6 text-center transition-all duration-200',
            value === true
              ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.15)]'
              : 'border-border hover:border-primary/30 hover:bg-secondary/50'
          )}
        >
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl',
              value === true ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
            )}
          >
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Yes, scan my website</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Get a detailed compliance score in under 2 minutes
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'flex flex-col items-center gap-4 rounded-xl border p-6 text-center transition-all duration-200',
            value === false
              ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.15)]'
              : 'border-border hover:border-primary/30 hover:bg-secondary/50'
          )}
        >
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl',
              value === false ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
            )}
          >
            <ArrowRight className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Skip, show me recommendations</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Get personalized recommendations based on your answers
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
