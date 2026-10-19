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
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Consent to store this assessment</h2>
        <p className="mt-2 text-muted-foreground">
          Required even if you skipped the scan. Contact details are not submitted without it.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <Checkbox
          label="I consent to Consent Cockpit scanning the provided website URL, storing my contact information, and receiving a compliance report via email. I understand my data will be processed in accordance with Consent Cockpit's privacy policy."
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
