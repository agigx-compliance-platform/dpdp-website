'use client'

import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Badge'

const PRIORITIES = [
  { id: 'understand-applicability', label: 'Understand DPDP applicability' },
  { id: 'fix-consent', label: 'Fix privacy policies / consent' },
  { id: 'setup-rights', label: 'Set up rights / grievance workflows' },
  { id: 'vendor-risk', label: 'Manage vendor privacy risk' },
  { id: 'data-sovereignty', label: 'Address data sovereignty' },
  { id: 'ai-governance', label: 'Govern AI / GenAI use' },
  { id: 'audit-prep', label: 'Prepare for audit' },
  { id: 'breach-readiness', label: 'Improve breach readiness' },
  { id: 'workflow-automation', label: 'Implement workflow automation' },
  { id: 'dpo-support', label: 'Get DPO support' },
]

interface PrioritiesStepProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function PrioritiesStep({ value, onChange, error }: PrioritiesStepProps) {
  const maxReached = value.length >= 3

  const toggle = (id: string, checked: boolean) => {
    if (checked && !maxReached) {
      onChange([...value, id])
    } else if (!checked) {
      onChange(value.filter((v) => v !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            What are your top 3 compliance priorities?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Choose up to 3 priorities that matter most right now.
          </p>
        </div>
        <Badge variant={maxReached ? 'success' : 'default'}>
          {value.length}/3
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PRIORITIES.map(({ id, label }) => (
          <div
            key={id}
            className="rounded-xl border border-border p-3 transition-colors hover:border-primary/30"
          >
            <Checkbox
              label={label}
              checked={value.includes(id)}
              onChange={(checked) => toggle(id, checked)}
              disabled={maxReached && !value.includes(id)}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
