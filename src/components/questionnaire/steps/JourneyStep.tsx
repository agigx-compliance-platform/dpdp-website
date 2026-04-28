'use client'

import { cn } from '@/lib/utils'
import { Map, FileText, Target, CheckCircle, Repeat } from 'lucide-react'

const STAGES = [
  {
    id: 'just-starting',
    label: 'Just starting out',
    description: 'We haven\'t begun our DPDP compliance journey yet.',
    icon: Map,
  },
  {
    id: 'have-policies',
    label: 'Have policies in place',
    description: 'We have privacy policies but aren\'t sure if they meet DPDP requirements.',
    icon: FileText,
  },
  {
    id: 'know-gaps',
    label: 'Know our gaps',
    description: 'We\'ve identified compliance gaps and need help fixing them.',
    icon: Target,
  },
  {
    id: 'need-validation',
    label: 'Need validation',
    description: 'We believe we\'re compliant but need independent verification.',
    icon: CheckCircle,
  },
  {
    id: 'ongoing-support',
    label: 'Need ongoing support',
    description: 'We need continuous monitoring and managed compliance operations.',
    icon: Repeat,
  },
]

interface JourneyStepProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function JourneyStep({ value, onChange, error }: JourneyStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Where are you on your DPDP journey?
        </h2>
        <p className="mt-2 text-muted-foreground">
          This helps us recommend the right level of support.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {STAGES.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200',
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
            <div>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
