'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { usePersistedQuestionnaireState } from '@/hooks/usePersistedQuestionnaireState'
import { QuestionnaireWizard } from './QuestionnaireWizard'
import { getScanStatus, getScanReport } from '@/lib/api'
import { unwrapConsentApiEnvelope, mapScanReportToResult } from '@/lib/website-scan'
import type { ScanReportResponse, ScanStatusResponse } from '@/lib/types'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuestionnaireModal() {
  const { isModalOpen, closeModal } = useQuestionnaireStore()
  const { scanId, scanDone, updateState, currentStep, clearPersistedState } = usePersistedQuestionnaireState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Background polling loop that runs as long as this component is mounted
  // (which is typically global if placed in layout or a top-level page)
  useEffect(() => {
    if (!scanId || scanDone) return
    const interval = setInterval(async () => {
      try {
        const status = unwrapConsentApiEnvelope<ScanStatusResponse>(await getScanStatus(scanId))
        updateState({ scanProgress: status.progress })

        if (status.status === 'completed') {
          const report = unwrapConsentApiEnvelope<ScanReportResponse>(await getScanReport(scanId))
          updateState({
            scanResult: mapScanReportToResult(report, scanId),
            scanDone: true,
            scanProgress: 100,
            ...(currentStep >= 7 ? { currentStep: 8, direction: 1 } : {}),
          })
          clearInterval(interval)
        } else if (status.status === 'failed') {
          updateState({ scanDone: true }) // Stop polling on fail
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Failed to poll scan status', err)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [scanId, scanDone, updateState, currentStep])

  const handleClose = () => {
    closeModal()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, handleClose])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          data-lenis-prevent="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <motion.div
            className={cn("relative w-full bg-background rounded-2xl shadow-2xl my-8 overflow-hidden flex flex-col transition-all duration-500 max-h-[90vh]", currentStep === 8 ? "max-w-5xl" : "max-w-2xl")}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted border border-border/50"
              onClick={handleClose}
            >
              <X className="h-5 w-5 text-foreground" />
            </Button>
            <QuestionnaireWizard />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
