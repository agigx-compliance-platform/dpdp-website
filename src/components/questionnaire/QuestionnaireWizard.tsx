'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StepProgress } from './StepProgress'
import { RoleStep } from './steps/RoleStep'
import { OrgTypeStep } from './steps/OrgTypeStep'
import { JourneyStep } from './steps/JourneyStep'
import { DataTypesStep } from './steps/DataTypesStep'
import { PrioritiesStep } from './steps/PrioritiesStep'
import { SupportTypeStep } from './steps/SupportTypeStep'
import { ScanOptionStep } from './steps/ScanOptionStep'
import { ScanDetailsStep } from './steps/ScanDetailsStep'
import { ConsentStep } from './steps/ConsentStep'
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step8Schema,
  step9Schema,
} from '@/lib/questionnaire-schema'
import { submitQuestionnaire, initiateScan, getScanStatus, getScanReport } from '@/lib/api'
import type { QuestionnaireResponses, ScanResult } from '@/lib/types'

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

export function QuestionnaireWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  const [formData, setFormData] = useState<QuestionnaireResponses>({
    role: '',
    orgType: '',
    journeyStage: '',
    dataTypes: [],
    priorities: [],
    supportType: [],
    wantsScan: false,
    websiteUrl: '',
    email: '',
    name: '',
    company: '',
    consentGiven: false,
  })

  const totalSteps = formData.wantsScan ? 9 : 7

  const validateCurrentStep = useCallback((): boolean => {
    setErrors({})
    try {
      switch (currentStep) {
        case 1:
          step1Schema.parse({ role: formData.role })
          break
        case 2:
          step2Schema.parse({ orgType: formData.orgType })
          break
        case 3:
          step3Schema.parse({ journeyStage: formData.journeyStage })
          break
        case 4:
          step4Schema.parse({ dataTypes: formData.dataTypes })
          break
        case 5:
          step5Schema.parse({ priorities: formData.priorities })
          break
        case 6:
          step6Schema.parse({ supportType: formData.supportType })
          break
        case 8:
          if (formData.wantsScan) {
            step8Schema.parse({
              websiteUrl: formData.websiteUrl,
              email: formData.email,
              name: formData.name,
              company: formData.company,
            })
          }
          break
        case 9:
          if (formData.wantsScan) {
            step9Schema.parse({ consentGiven: formData.consentGiven })
          }
          break
      }
      return true
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodErr = err as { errors: Array<{ path: string[]; message: string }> }
        const newErrors: Record<string, string> = {}
        zodErr.errors.forEach((e) => {
          const key = e.path[0] || 'general'
          newErrors[key] = e.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [currentStep, formData])

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) return

    setDirection(1)
    if (currentStep === 7 && !formData.wantsScan) {
      handleSubmitWithoutScan()
      return
    }
    setCurrentStep((s) => Math.min(s + 1, totalSteps))
  }, [currentStep, totalSteps, formData.wantsScan, validateCurrentStep])

  const goBack = useCallback(() => {
    setDirection(-1)
    setErrors({})
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleSubmitWithoutScan = async () => {
    setIsSubmitting(true)
    try {
      await submitQuestionnaire(formData)
      const params = new URLSearchParams()
      params.set('data', btoa(JSON.stringify(formData)))
      router.push(`/questionnaire/results?${params.toString()}`)
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitWithScan = async () => {
    if (!validateCurrentStep()) return
    setIsSubmitting(true)
    setIsScanning(true)

    try {
      await submitQuestionnaire(formData)
      const { data } = await initiateScan({
        url: formData.websiteUrl!,
        email: formData.email!,
        name: formData.name!,
        company: formData.company!,
        consent: formData.consentGiven,
      })

      const scanId = data.scanId
      let scanResult: ScanResult | null = null

      while (!scanResult) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const { data: status } = await getScanStatus(scanId)
        setScanProgress(status.progress)

        if (status.status === 'completed') {
          const { data: report } = await getScanReport(scanId)
          scanResult = report
        } else if (status.status === 'failed') {
          throw new Error('Scan failed')
        }
      }

      const params = new URLSearchParams()
      params.set('data', btoa(JSON.stringify(formData)))
      params.set('scan', btoa(JSON.stringify(scanResult)))
      router.push(`/questionnaire/results?${params.toString()}`)
    } catch {
      setErrors({ general: 'Scan failed. Showing recommendations based on your answers.' })
      setIsScanning(false)
      const params = new URLSearchParams()
      params.set('data', btoa(JSON.stringify(formData)))
      router.push(`/questionnaire/results?${params.toString()}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof QuestionnaireResponses, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors({})
  }

  if (isScanning) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-6">
        <motion.div
          className="relative flex h-32 w-32 items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">Scanning in progress...</h3>
          <p className="mt-2 text-muted-foreground">
            Analyzing your website for privacy compliance
          </p>
          <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))]"
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-primary">{scanProgress}%</p>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleStep
            value={formData.role}
            onChange={(v) => updateField('role', v)}
            error={errors.role}
          />
        )
      case 2:
        return (
          <OrgTypeStep
            value={formData.orgType}
            onChange={(v) => updateField('orgType', v)}
            error={errors.orgType}
          />
        )
      case 3:
        return (
          <JourneyStep
            value={formData.journeyStage}
            onChange={(v) => updateField('journeyStage', v)}
            error={errors.journeyStage}
          />
        )
      case 4:
        return (
          <DataTypesStep
            value={formData.dataTypes}
            onChange={(v) => updateField('dataTypes', v)}
            error={errors.dataTypes}
          />
        )
      case 5:
        return (
          <PrioritiesStep
            value={formData.priorities}
            onChange={(v) => updateField('priorities', v)}
            error={errors.priorities}
          />
        )
      case 6:
        return (
          <SupportTypeStep
            value={formData.supportType}
            onChange={(v) => updateField('supportType', v)}
            error={errors.supportType}
          />
        )
      case 7:
        return (
          <ScanOptionStep
            value={formData.wantsScan === true ? true : formData.wantsScan === false ? false : undefined}
            onChange={(v) => updateField('wantsScan', v)}
          />
        )
      case 8:
        return (
          <ScanDetailsStep
            values={{
              websiteUrl: formData.websiteUrl || '',
              name: formData.name || '',
              company: formData.company || '',
              email: formData.email || '',
            }}
            onChange={(field, value) => updateField(field as keyof QuestionnaireResponses, value)}
            errors={errors}
          />
        )
      case 9:
        return (
          <ConsentStep
            value={formData.consentGiven}
            onChange={(v) => updateField('consentGiven', v)}
            onSubmit={handleSubmitWithScan}
            isSubmitting={isSubmitting}
            error={errors.consentGiven}
          />
        )
      default:
        return null
    }
  }

  const showNextButton = currentStep < totalSteps && currentStep !== 9

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

      <div className="glass-card overflow-hidden rounded-xl p-6 sm:p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {errors.general && (
          <p className="mt-4 text-sm text-destructive">{errors.general}</p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {showNextButton && (
            <Button
              type="button"
              variant="primary"
              onClick={goNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {currentStep === 7 && !formData.wantsScan
                    ? 'View Recommendations'
                    : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
