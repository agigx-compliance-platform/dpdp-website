'use client'

import { useState, useCallback, useMemo } from 'react'
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
import type {
  QuestionnaireResponses,
  ScanReportResponse,
  ScanResult,
  ScanStatusResponse,
} from '@/lib/types'

type ApiEnvelope<T> = { data?: T }

/**
 * Axios `response.data` is consent-management `ApiResponse<T>` with `.data` = payload T.
 */
function unwrapConsentApiInner<T>(
  axiosData: ApiEnvelope<T> | (T & Record<string, unknown>) | undefined
): T | undefined {
  if (!axiosData || typeof axiosData !== 'object') return undefined
  if ('data' in axiosData && (axiosData as ApiEnvelope<T>).data !== undefined) {
    return (axiosData as ApiEnvelope<T>).data as T
  }
  return axiosData as T
}

/** Extract inner payload from an axios wrapper: `unwrapAxiosConsentBody((await api).data)` */
function unwrapScanStatus(inner: ScanStatusResponse | undefined): ScanStatusResponse {
  if (!inner || typeof inner.progress !== 'number') {
    throw new Error('Invalid scan status payload')
  }
  return inner
}

function unwrapScanReport(inner: ScanReportResponse | undefined): ScanReportResponse {
  if (!inner || typeof inner.score !== 'number') {
    throw new Error('Invalid scan report payload')
  }
  return inner
}

function computePenaltyExposure(score: number): string {
  if (score >= 90) return '₹0, low risk'
  if (score >= 75) return 'Up to ₹50 Crore'
  if (score >= 60) return 'Up to ₹150 Crore'
  if (score >= 40) return 'Up to ₹250 Crore'
  return 'Up to ₹750 Crore (cumulative)'
}

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

const POLL_INTERVAL_MS = 1600

function ScanRunningPanel({ scanProgress }: { scanProgress: number }) {
  const pct = Math.min(100, Math.max(0, scanProgress))
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  const statusLabel = useMemo(() => {
    if (pct < 22) return 'Connecting to scanner'
    if (pct < 55) return 'Crawling pages and detecting trackers'
    if (pct < 88) return 'Evaluating compliance checks'
    return 'Finalizing report'
  }, [pct])

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <svg className="absolute h-36 w-36 -rotate-90 text-muted/30" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="7"
            className="stroke-current"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            stroke="currentColor"
            className="text-primary"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </svg>
        <Loader2 className="relative h-10 w-10 shrink-0 animate-spin text-primary" aria-hidden />
      </div>
      <div className="mx-auto max-w-md text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Scanning in progress</h3>
        <p className="text-sm text-muted-foreground">{statusLabel}</p>
        <div className="pt-4">
          <div className="mx-auto h-2.5 max-w-xs overflow-hidden rounded-full bg-muted/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-3 text-xs font-semibold tabular-nums text-primary">{Math.round(pct)}%</p>
        </div>
      </div>
    </div>
  )
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

  const handleSubmitWithoutScan = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await submitQuestionnaire(formData).catch(() => undefined)
    } finally {
      try {
        const params = new URLSearchParams()
        params.set('data', btoa(JSON.stringify(formData)))
        router.push(`/questionnaire/results?${params.toString()}`)
      } catch {
        setErrors({ general: 'Could not open results. Please try again.' })
      }
      setIsSubmitting(false)
    }
  }, [formData, router])

  const handleSubmitWithScan = useCallback(async () => {
    if (!validateCurrentStep()) return
    setIsSubmitting(true)
    setIsScanning(true)

    try {
      const { data: scanResponse } = await initiateScan({
        url: formData.websiteUrl!,
        email: formData.email!,
        name: formData.name!,
        company: formData.company!,
        consent: formData.consentGiven,
      })

      const scanId = scanResponse.data.scanId
      setScanProgress(15)

      let report: ScanReportResponse | null = null
      let polled = false
      while (!report) {
        if (polled) {
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        }
        polled = true

        const statusResp = await getScanStatus(scanId)
        const status = unwrapScanStatus(
          unwrapConsentApiInner<ScanStatusResponse>(
            statusResp.data as ApiEnvelope<ScanStatusResponse>
          )
        )

        const nextPct =
          status.status === 'completed'
            ? 100
            : typeof status.progress === 'number'
              ? Math.min(98, Math.max(6, status.progress))
              : 38
        setScanProgress(nextPct)

        if (status.status === 'completed') {
          const reportResp = await getScanReport(scanId)
          report = unwrapScanReport(
            unwrapConsentApiInner<ScanReportResponse>(
              reportResp.data as ApiEnvelope<ScanReportResponse>
            )
          )
        } else if (status.status === 'failed') {
          throw new Error('Scan failed')
        }
      }

      const scanResult: ScanResult = {
        scanId,
        scannedUrl: report.scannedUrl,
        overallScore: report.score,
        grade: report.grade,
        summary: report.summary,
        complianceFlags: report.complianceFlags,
        totalCookies: report.totalCookies,
        totalTrackers: report.totalTrackers,
        consentBannerPresent: report.consentBannerPresent,
        consentRejectOption: report.consentRejectOption,
        penaltyExposure: computePenaltyExposure(report.score),
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
  }, [validateCurrentStep, formData, router])

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) return

    setDirection(1)
    if (currentStep === 7 && !formData.wantsScan) {
      void handleSubmitWithoutScan()
      return
    }
    setCurrentStep((s) => Math.min(s + 1, totalSteps))
  }, [
    currentStep,
    totalSteps,
    formData.wantsScan,
    validateCurrentStep,
    handleSubmitWithoutScan,
  ])

  const goBack = useCallback(() => {
    setDirection(-1)
    setErrors({})
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  const updateField = (field: keyof QuestionnaireResponses, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors({})
  }

  if (isScanning) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        <div className="glass-card overflow-hidden rounded-xl p-6 sm:p-10">
          <ScanRunningPanel scanProgress={scanProgress} />
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

  const showNextButton = currentStep !== 9

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
