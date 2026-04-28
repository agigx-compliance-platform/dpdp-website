'use client'

import { Input } from '@/components/ui/Input'

interface ScanDetailsStepProps {
  values: {
    websiteUrl: string
    name: string
    company: string
    email: string
  }
  onChange: (field: string, value: string) => void
  errors?: Record<string, string>
}

export function ScanDetailsStep({ values, onChange, errors }: ScanDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tell us about yourself</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;ll send your scan results and compliance report to this email.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Website URL"
          type="url"
          placeholder="https://yourwebsite.com"
          value={values.websiteUrl}
          onChange={(e) => onChange('websiteUrl', e.target.value)}
          error={errors?.websiteUrl}
        />
        <Input
          label="Full Name"
          type="text"
          placeholder="Your name"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors?.name}
        />
        <Input
          label="Company Name"
          type="text"
          placeholder="Your company"
          value={values.company}
          onChange={(e) => onChange('company', e.target.value)}
          error={errors?.company}
        />
        <Input
          label="Business Email"
          type="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors?.email}
        />
      </div>
    </div>
  )
}
