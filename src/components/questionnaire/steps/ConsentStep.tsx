'use client'

import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { ShieldCheck } from 'lucide-react'

interface ConsentStepProps {
  value: boolean
  onChange: (value: boolean) => void
  onSubmit: () => void
  isSubmitting: boolean
  error?: string
}

export function ConsentStep({ value, onChange, onSubmit, isSubmitting, error }: ConsentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">One last step</h2>
        <p className="mt-2 text-muted-foreground">
          Please review and consent before we begin scanning.
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

      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!value || isSubmitting}
        onClick={onSubmit}
      >
        <ShieldCheck className="h-5 w-5" />
        {isSubmitting ? 'Starting Scan...' : 'Start Scan & View Results'}
      </Button>
    </div>
  )
}
