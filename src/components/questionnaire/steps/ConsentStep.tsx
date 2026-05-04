'use client'

import { Checkbox } from '@/components/ui/Checkbox'

interface ConsentStepProps {
  value: boolean
  onChange: (value: boolean) => void
  error?: string
}

export function ConsentStep({ value, onChange, error }: ConsentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">One last step</h2>
        <p className="mt-2 text-muted-foreground">
          Please review and consent before we finish.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <Checkbox
          label="I consent to AGIGx scanning the provided website URL, storing my contact information, and receiving a compliance report via email. I understand my data will be processed in accordance with AGIGx's privacy policy."
          checked={value}
          onChange={onChange}
        />
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-primary hover:underline"
        >
          Read our Privacy Policy
        </a>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
