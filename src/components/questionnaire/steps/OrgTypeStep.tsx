'use client'

import { cn } from '@/lib/utils'
import {
  Rocket,
  Building,
  Building2,
  Network,
  Globe,
  Landmark,
} from 'lucide-react'

const ORG_TYPES = [
  { id: 'startup', label: 'Startup / SMB', icon: Rocket },
  { id: 'mid-market', label: 'Mid-Market Enterprise', icon: Building },
  { id: 'enterprise', label: 'Large Enterprise / Conglomerate', icon: Building2 },
  { id: 'platform', label: 'Platform / Marketplace', icon: Network },
  { id: 'gcc', label: 'GCC / Global Captive', icon: Globe },
  { id: 'government', label: 'Government / PSU', icon: Landmark },
]

interface OrgTypeStepProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function OrgTypeStep({ value, onChange, error }: OrgTypeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          What type of organization are you?
        </h2>
        <p className="mt-2 text-muted-foreground">
          This helps us recommend solutions sized for your needs.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ORG_TYPES.map(({ id, label, icon: Icon }) => (
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
