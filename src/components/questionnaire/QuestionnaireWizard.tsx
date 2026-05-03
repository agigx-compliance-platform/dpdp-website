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
import { submitQuestionnaire, initiateScan } from '@/lib/api'

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

  const handleStartScan = async () => {
    setIsSubmitting(true)
    try {
      const { data } = await initiateScan({
        url: formData.websiteUrl!,
        email: formData.email!,
        name: formData.name!,
        company: formData.company!,
        consent: formData.consentGiven,
      })
      updateState({
        wantsScan: true,
        scanId: data.scanId,
        scanDone: false,
        scanProgress: 0,
        scanResult: null,
        direction: 1,
        currentStep: 1,
      })
    } catch (e: any) {
      setErrors({ scan: e.message || 'Failed to start scan. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipScan = () => {
    updateState({
      wantsScan: false,
      scanId: null,
      scanDone: false,
      scanProgress: 0,
      scanResult: null,
      direction: 1,
      currentStep: 1,
    })
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitQuestionnaire(formData)
      if (wantsScan && !scanDone) {
        setIsFinalizing(true)
      } else {
        routeToResults()
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = () => {
    if (!validateCurrentStep()) return
    if (currentStep === 7) {
      handleFinalSubmit()
      return
    }
    updateState({ direction: 1, currentStep: currentStep + 1 })
  }

  const goBack = () => {
    setErrors({})
    updateState({ direction: -1, currentStep: Math.max(currentStep - 1, 1) })
  }

  if (isFinalizing) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-background rounded-2xl">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Finalizing your scan results...</h3>
        <p className="mt-2 text-muted-foreground">Almost done!</p>
        {scanProgress > 0 && (
          <div className="mt-6 w-full max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))]"
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-primary text-right">{scanProgress}%</p>
          </div>
        )}
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
