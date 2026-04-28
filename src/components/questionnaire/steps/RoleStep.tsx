'use client'

import { cn } from '@/lib/utils'
import {
  Scale,
  Shield,
  Monitor,
  Lock,
  Code,
  ClipboardCheck,
} from 'lucide-react'

const ROLES = [
  { id: 'legal-compliance', label: 'Legal / Compliance Officer', icon: Scale },
  { id: 'dpo-privacy', label: 'DPO / Privacy Lead', icon: Shield },
  { id: 'cio-cto', label: 'CIO / CTO', icon: Monitor },
  { id: 'ciso-infosec', label: 'CISO / InfoSec Head', icon: Lock },
  { id: 'engineering-product', label: 'Engineering / Product Lead', icon: Code },
  { id: 'audit-risk', label: 'Audit / Risk Manager', icon: ClipboardCheck },
]

interface RoleStepProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function RoleStep({ value, onChange, error }: RoleStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What&apos;s your role?</h2>
        <p className="mt-2 text-muted-foreground">
          This helps us tailor recommendations to your perspective.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ROLES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200',
              value === id
                ? 'border-primary/50 bg-primary/5 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
                : 'border-border hover:border-primary/30 hover:bg-secondary/50'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                value === id ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
