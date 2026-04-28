'use client'

import { Checkbox } from '@/components/ui/Checkbox'

const SUPPORT_TYPES = [
  { id: 'quick-assessment', label: 'Quick readiness assessment' },
  { id: 'legal-advisory', label: 'Legal advisory' },
  { id: 'technical', label: 'Technical implementation' },
  { id: 'audit', label: 'Audit support' },
  { id: 'managed', label: 'Managed operations' },
  { id: 'training', label: 'Training' },
]

interface SupportTypeStepProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function SupportTypeStep({ value, onChange, error }: SupportTypeStepProps) {
  const toggle = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...value, id])
    } else {
      onChange(value.filter((v) => v !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          What type of support are you looking for?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Select all that apply.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SUPPORT_TYPES.map(({ id, label }) => (
          <div
            key={id}
            className="rounded-xl border border-border p-3 transition-colors hover:border-primary/30"
          >
            <Checkbox
              label={label}
              checked={value.includes(id)}
              onChange={(checked) => toggle(id, checked)}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
