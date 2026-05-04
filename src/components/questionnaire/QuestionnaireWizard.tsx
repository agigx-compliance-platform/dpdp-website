'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StepProgress } from './StepProgress'
import { RiskMeter } from './RiskMeter'
import { RoleStep } from './steps/RoleStep'
import { OrgTypeStep } from './steps/OrgTypeStep'
import { JourneyStep } from './steps/JourneyStep'
import { DataTypesStep } from './steps/DataTypesStep'
import { PrioritiesStep } from './steps/PrioritiesStep'
import { SupportTypeStep } from './steps/SupportTypeStep'
import { ScanLaunchStep } from './steps/ScanLaunchStep'
import { ConsentStep } from './steps/ConsentStep'
import { ResultsView } from './ResultsView'
import { usePersistedQuestionnaireState } from '@/hooks/usePersistedQuestionnaireState'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step9Schema,
} from '@/lib/questionnaire-schema'
import { submitQuestionnaire, initiateScan, getScanStatus, getScanReport } from '@/lib/api'
import type {
  QuestionnaireResponses,
  ScanReportResponse,
  ScanResult,
  ScanStatusResponse,
} from '@/lib/types'

/**
 * Backend returns `{ data: T, message?: string }`.
 * Axios wraps that in `response.data`, so the payload lives at `response.data.data`.
 * This helper digs into the envelope safely regardless of nesting.
 */
function unwrap<T>(axiosResponse: { data: unknown }): T {
  const body = axiosResponse.data
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as Record<string, unknown>).data as T
  }
  return body as T
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

export function QuestionnaireWizard() {
  const router = useRouter()
  const { closeModal } = useQuestionnaireStore()
  const {
    currentStep,
    direction,
    formData,
    wantsScan,
    scanProgress,
    scanDone,
    scanResult,
    scanId,
    updateState,
    updateFormData,
    clearPersistedState,
  } = usePersistedQuestionnaireState()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const scrollHeight = target.scrollHeight - target.clientHeight
    if (scrollHeight > 0) {
      setScrollProgress(target.scrollTop / scrollHeight)
    } else {
      setScrollProgress(0)
    }
  }

  const routeToResults = useCallback(() => {
    updateState({ currentStep: 8, direction: 1 })
  }, [updateState])

  // Resume animation
  useEffect(() => {
    if (currentStep > 0) {
      setIsResuming(true)
      const t = setTimeout(() => setIsResuming(false), 400)
      return () => clearTimeout(t)
    }
  }, []) // run once on mount


  // Check if finalizing is done
  useEffect(() => {
    if (isFinalizing && (scanDone || !wantsScan)) {
      routeToResults()
    }
  }, [isFinalizing, scanDone, wantsScan, routeToResults])


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
        case 7:
          if (wantsScan) {
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
  }, [currentStep, formData, wantsScan])

  const handleSubmitWithoutScan = async () => {
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
  }

  const handleSubmitWithScan = async () => {
    if (!validateCurrentStep()) return
    if (isSubmitting || isScanning) return
    setIsSubmitting(true)
    setIsScanning(true)
    setIsFinalizing(true)

    try {
      const { data: scanResponse } = await initiateScan({
        url: formData.websiteUrl!,
        email: formData.email!,
        name: formData.name!,
        company: formData.company!,
        consent: formData.consentGiven,
      })

      const scanId = scanResponse.data.scanId

      let report: ScanReportResponse | null = null
      let polled = false
      while (!report) {
        if (polled) {
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        }
        polled = true

        const status = unwrap<ScanStatusResponse>(await getScanStatus(scanId))

        if (status.status === 'completed') {
          report = unwrap<ScanReportResponse>(await getScanReport(scanId))
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
      const params = new URLSearchParams()
      params.set('data', btoa(JSON.stringify(formData)))
      router.push(`/questionnaire/results?${params.toString()}`)
    } finally {
      setIsScanning(false)
      setIsSubmitting(false)
      setIsFinalizing(false)
    }
  }

  const handleStartScan = () => {
    updateState({ wantsScan: true, direction: 1, currentStep: 1 })
  }

  const handleSkipScan = () => {
    updateState({ wantsScan: false, direction: 1, currentStep: 1 })
  }

  const goNext = () => {
    if (!validateCurrentStep()) return
    if (currentStep === 7) {
      if (formData.wantsScan) {
        void handleSubmitWithScan()
      } else {
        void handleSubmitWithoutScan()
      }
      return
    }
    updateState({ direction: 1, currentStep: currentStep + 1 })
  }

  const goBack = () => {
    setErrors({})
    updateState({ direction: -1, currentStep: Math.max(currentStep - 1, 1) })
  }

  if (isFinalizing || isScanning) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
        <StepProgress currentStep={currentStep} totalSteps={8} />
        <div className="glass-card overflow-hidden rounded-xl p-6 sm:p-10">
          <div className="flex flex-col items-center justify-center gap-6 py-12">
            <Loader2 className="h-14 w-14 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Scanning in progress</h3>
              <p className="text-sm text-muted-foreground">
                Analyzing your website for privacy compliance.
                <br />
                This may take a minute or two.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ScanLaunchStep
            values={{
              websiteUrl: formData.websiteUrl || '',
              name: formData.name || '',
              company: formData.company || '',
              email: formData.email || '',
            }}
            onChange={updateFormData}
            onStartScan={handleStartScan}
            onSkipScan={handleSkipScan}
            isSubmitting={isSubmitting}
            scanError={errors.scan}
          />  
        )
      case 1:
        return <RoleStep value={formData.role} onChange={(v) => updateFormData('role', v)} error={errors.role} />
      case 2:
        return <OrgTypeStep value={formData.orgType} onChange={(v) => updateFormData('orgType', v)} error={errors.orgType} />
      case 3:
        return <JourneyStep value={formData.journeyStage} onChange={(v) => updateFormData('journeyStage', v)} error={errors.journeyStage} />
      case 4:
        return <DataTypesStep value={formData.dataTypes} onChange={(v) => updateFormData('dataTypes', v)} error={errors.dataTypes} />
      case 5:
        return <PrioritiesStep value={formData.priorities} onChange={(v) => updateFormData('priorities', v)} error={errors.priorities} />
      case 6:
        return <SupportTypeStep value={formData.supportType} onChange={(v) => updateFormData('supportType', v)} error={errors.supportType} />
      case 7:
        return (
          <ConsentStep
            value={formData.consentGiven}
            onChange={(v) => updateFormData('consentGiven', v)}
            error={errors.consentGiven}
          />
        )
      case 8:
        return <ResultsView responses={formData} scanResult={scanResult || undefined} />
      default:
        return null
    }
  }

  const showNextButton = currentStep !== 9
  return (
    <div 
      onScroll={handleScroll}
      data-lenis-prevent="true"
      className="flex flex-col w-full h-full bg-background min-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-hide relative"
    >
      {/* Custom Scroll Progress Indicator */}
      <div className="sticky top-0 z-50 h-1 w-full bg-transparent pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          style={{ scaleX: scrollProgress, transformOrigin: 'left' }}
        />
      </div>

      {/* Scan status bar — visible when scan is running */}
      {wantsScan && scanId && currentStep > 0 && (
        <div className="w-full bg-secondary/30 px-6 py-2 border-b border-border flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${scanDone ? 'bg-green-500' : 'bg-primary animate-pulse'}`} />
            <span className="text-muted-foreground">
              {scanDone ? 'Scan Complete' : 'Scanning in background...'}
            </span>
            <span className="font-medium text-foreground ml-1 hidden sm:inline">
              {formData.websiteUrl && new URL(formData.websiteUrl).hostname}
            </span>
          </div>
          <span className="font-semibold text-primary">{scanProgress}%</span>
        </div>
      )}

      {currentStep > 0 && currentStep < 8 && (
        <div className="px-4 pt-6 sm:px-8">
          <StepProgress currentStep={currentStep} totalSteps={8} />
          <div className="mt-6">
            <RiskMeter formData={formData} isVisible={true} />
          </div>
        </div>
      )}

      {isResuming && currentStep > 0 ? (
        <div className="flex flex-col items-center justify-center p-12 flex-1">
          <p className="text-sm text-muted-foreground mb-4">Resuming from step {currentStep}...</p>
          <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.4, ease: 'linear' as const }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 sm:p-8 flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
              className="flex-1"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {errors.general && (
            <p className="mt-4 text-sm text-destructive">{errors.general}</p>
          )}

          {currentStep > 0 && currentStep < 8 && (
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                disabled={currentStep === 1 || isSubmitting}
                className={currentStep === 1 ? 'invisible' : ''}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={goNext}
                disabled={isSubmitting || (currentStep === 7 && wantsScan && !formData.consentGiven)}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {currentStep === 7 ? 'Submit' : 'Next'}
                {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
