'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { QuestionnaireResponses } from '@/lib/types'
import { z } from 'zod'

type ScanLaunchField = keyof Pick<QuestionnaireResponses, 'websiteUrl' | 'name' | 'company' | 'email'>

interface ScanLaunchStepProps {
  values: {
    websiteUrl: string
    name: string
    company: string
    email: string
  }
  onChange: (field: ScanLaunchField, value: string) => void
  onStartScan: () => Promise<void>
  onSkipScan: () => void
  isSubmitting: boolean
  scanError?: string
}

const scanLaunchSchema = z.object({
  websiteUrl: z.string().url('Please enter a valid URL including http:// or https://'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
})

export function ScanLaunchStep({
  values,
  onChange,
  onStartScan,
  onSkipScan,
  isSubmitting,
  scanError,
}: ScanLaunchStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleStartScan = async () => {
    try {
      setErrors({})
      scanLaunchSchema.parse(values)
      await onStartScan()
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach((e) => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Scan a public site</h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Consent banner, cookies, rights links, and the privacy notice. About 90 seconds. Skipping still requires consent before contact details are stored.
        </p>
      </div>

      {scanError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
          {scanError}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Website URL"
          type="url"
          placeholder="https://yourwebsite.com"
          value={values.websiteUrl}
          onChange={(e) => onChange('websiteUrl', e.target.value)}
          error={errors.websiteUrl}
          className="text-lg py-6"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            error={errors.name}
          />
          <Input
            label="Company Name"
            type="text"
            placeholder="Your company"
            value={values.company}
            onChange={(e) => onChange('company', e.target.value)}
            error={errors.company}
          />
          <Input
            label="Business Email"
            type="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-4 pt-2 sm:items-start">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleStartScan}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Start scan and continue'
          )}
        </Button>
        <button
          type="button"
          onClick={onSkipScan}
          disabled={isSubmitting}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          Skip scan, just show me recommendations
        </button>
      </div>
    </div>
  )
}
