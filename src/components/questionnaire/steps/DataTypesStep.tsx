'use client'

import { Checkbox } from '@/components/ui/Checkbox'

const DATA_TYPES = [
  { id: 'customer', label: 'Customer / User Data' },
  { id: 'employee', label: 'Employee / HR Data' },
  { id: 'children', label: "Children's Data" },
  { id: 'financial', label: 'Financial / KYC Data' },
  { id: 'health', label: 'Health / Medical Data' },
  { id: 'ai-data', label: 'AI Training / Prompt Data' },
  { id: 'behavioral', label: 'Behavioral / Profiling Data' },
  { id: 'third-party', label: 'Third-Party / Vendor Data' },
]

interface DataTypesStepProps {
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function DataTypesStep({ value, onChange, error }: DataTypesStepProps) {
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
          What types of personal data do you handle?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Select all that apply. This shapes which DPDP sections are most relevant.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DATA_TYPES.map(({ id, label }) => (
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
