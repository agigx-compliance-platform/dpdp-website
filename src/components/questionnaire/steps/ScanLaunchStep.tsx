'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const STATS = [
  "E-commerce platforms face avg ₹82 Crore exposure under DPDP",
  "72-hour breach notification window — are you ready?",
  "Section 6 violations alone carry ₹50 Crore penalty"
]

export function ScanLaunchStep({
  values,
  onChange,
  onStartScan,
  onSkipScan,
  isSubmitting,
  scanError,
}: ScanLaunchStepProps) {
  const [activeStatIndex, setActiveStatIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % STATS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Scan your website for free</h2>
        <p className="mt-3 text-base text-muted-foreground">
          We&apos;ll check for consent banners, cookie compliance, DSAR mechanisms, and privacy policy gaps — takes 90 seconds.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative h-10 w-full max-w-sm overflow-hidden rounded-full border-l-4 border-l-primary bg-secondary/50 px-4 py-2 flex items-center shadow-sm">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeStatIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-medium text-muted-foreground text-center w-full"
            >
              {STATS[activeStatIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
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

      <div className="flex flex-col items-center gap-4 pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full text-base sm:w-auto sm:min-w-[300px]"
          onClick={handleStartScan}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Start Scan & Begin Assessment →'
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
