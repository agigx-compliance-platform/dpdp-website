'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2, ArrowRight, Activity, ListTodo } from 'lucide-react'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { usePersistedQuestionnaireState } from '@/hooks/usePersistedQuestionnaireState'
import { cn } from '@/lib/utils'
import { safeHostname } from '@/lib/safe-url'
import { useEffect, useState, useRef, useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

export function FloatingBlob() {
  const { isModalOpen, openModal } = useQuestionnaireStore()
  const {
    isInitialized,
    currentStep,
    wantsScan,
    scanProgress,
    scanDone,
    formData,
    scanResult,
    scanId,
    updateState,
  } = usePersistedQuestionnaireState()
  
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [isHovered, setIsHovered] = useState(false)
  const [tempExpanded, setTempExpanded] = useState(false)
  const prevIsModalOpen = useRef(isModalOpen)

  useEffect(() => {
    if (isModalOpen && isHovered) {
      queueMicrotask(() => setIsHovered(false))
    }
  }, [isModalOpen, isHovered])

  const hasStarted = currentStep > 0 || !!scanId

  useEffect(() => {
    if (prevIsModalOpen.current && !isModalOpen && hasStarted) {
      setTempExpanded(true)
    }
    prevIsModalOpen.current = isModalOpen
  }, [isModalOpen, hasStarted])

  useEffect(() => {
    if (tempExpanded) {
      const timer = setTimeout(() => {
        setTempExpanded(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [tempExpanded])

  if (!mounted || !isInitialized) return null

  if (isModalOpen || !hasStarted) return null

  const domain = safeHostname(formData.websiteUrl) ?? 'yoursite.com'
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  let state: 'A' | 'B' | 'C' | 'D' = 'C'
  if (currentStep === 8) state = 'D'
  else if (wantsScan && scanId && !scanDone) state = 'A'
  else if (wantsScan && scanDone) state = 'B'

  const issuesFound =
    state === 'A'
      ? Math.floor(scanProgress / 14)
      : scanResult
        ? (scanResult.complianceFlags ?? []).filter((c) => !c.passed).length
        : 0

  const circumference = 2 * Math.PI * 16 // reduced radius for small mode (was 20)
  const offset = circumference - (scanProgress / 100) * circumference

  let ringColor = 'stroke-success'
  if (scanProgress > 50) ringColor = 'stroke-warning'
  if (scanProgress > 75) ringColor = 'stroke-destructive'

  const iconElement = (
    <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
      {state === 'A' && (
        <>
          <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              className={ringColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            />
          </svg>
          <span className="absolute text-[9px] font-bold">{scanProgress}%</span>
        </>
      )}
      
      {state === 'B' && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
      )}

      {state === 'D' && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
      )}

      {state === 'C' && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <ListTodo className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={cn(
          "fixed bottom-6 right-6 z-40 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-md)] cursor-pointer transition-colors hover:border-primary/50",
          state === 'A' ? "border-primary/50" : "",
          (state === 'B' || state === 'D') ? "border-warning/50" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          openModal()
          if (state === 'B') {
            updateState({ currentStep: 8, direction: 1 })
          }
        }}
        layout
      >
        <motion.div layout className="flex flex-col overflow-hidden">
          {isHovered || tempExpanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 flex flex-col gap-3 min-w-[200px] sm:min-w-[280px]"
            >
              {/* Header Row */}
              <div className="flex items-center gap-3">
                {iconElement}

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground truncate max-w-[140px] sm:max-w-[180px]">
                    {state === 'C' ? `Step ${currentStep} of 7` : state === 'D' ? 'Assessment Complete' : domain}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {state === 'A' ? 'Scanning...' : state === 'B' ? 'SCAN DONE' : state === 'D' ? 'View your results' : 'Resume your assessment'}
                  </span>
                </div>
              </div>

              {/* Details Row (Hidden on mobile) */}
              {!isMobile && (
                <>
                  <div className="h-px w-full bg-border" />
                  
                  {state === 'A' && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity className="h-3.5 w-3.5" />
                      {issuesFound} issues found so far
                    </div>
                  )}

                  {state === 'B' && (
                    <div className="flex items-center gap-2 text-xs text-destructive font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {issuesFound} issues found
                    </div>
                  )}

                  {state === 'B' && scanResult && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Grade preview:</span>
                      <span className="font-bold blur-[4px] bg-secondary px-1 rounded select-none">
                        {scanResult.grade}
                      </span>
                      <span className="text-[10px]">(tap to reveal)</span>
                    </div>
                  )}
                </>
              )}

              {/* Action Button */}
              <div className="flex items-center text-xs font-semibold text-primary mt-1 group">
                {state === 'C' ? 'Continue' : state === 'B' ? 'Finish questionnaire' : state === 'D' ? 'View Results' : 'Resume questionnaire'}
                <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 flex flex-col items-center justify-center gap-1.5 w-[72px]"
            >
              {iconElement}
              <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                {state === 'A' ? 'Scanning' : state === 'B' ? 'Ready' : state === 'D' ? 'Results' : 'Resume'}
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
