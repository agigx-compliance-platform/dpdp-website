'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
} from 'lucide-react'
import { BrandMark } from '@/components/brand/BrandMark'
import { ScannerProductAds } from '@/components/ui/ScannerProductAds'
import { cn } from '@/lib/utils'

export type AnalysisStep = {
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface ScanProgressLoaderProps {
  domain: string
  activeStep: number
  steps: AnalysisStep[]
  className?: string
}

export function ScanProgressLoader({
  domain,
  activeStep,
  steps,
  className,
}: ScanProgressLoaderProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Prevent background scrolling and trap Escape key while scan is active
  useEffect(() => {
    const originalStyle = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Escape key from closing or bypassing the modal
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)

    // Focus container on mount
    if (modalRef.current) {
      modalRef.current.focus()
    }

    return () => {
      document.body.style.overflow = originalStyle
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-loader-title"
      aria-describedby="scan-loader-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-xl overflow-hidden pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" className="sr-only">
        Privacy compliance scan in progress for {domain}. Phase {activeStep + 1} of {steps.length}.
      </div>

      {/* Main Centered Modal Window */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl border border-primary/30 bg-card p-4 sm:p-6 space-y-4 text-left shadow-lg backdrop-blur-2xl focus:outline-none scrollbar-thin',
          className
        )}
      >
        {/* Top Header: Logo + Non-Dismissable Scanner Lock Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
          <div className="flex items-center gap-3">
            <BrandMark priority />
            <div className="hidden sm:block w-px h-8 bg-primary/20" />
            <div className="hidden sm:block text-left">
              <div
                id="scan-loader-title"
                className="text-xs text-primary font-bold tracking-widest uppercase"
              >
                Privacy Pitstop Scanner
              </div>
              <div className="text-xs text-muted-foreground">
                Public Assessment Engine
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary font-semibold self-start sm:self-auto shadow-sm">
            <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="font-mono text-sm tracking-wider uppercase">
              Live Scan Active
            </span>
          </div>
        </div>

        {/* Target Domain + Prominent Main Message */}
        <div className="space-y-1.5 bg-muted border border-border rounded-2xl p-3.5 sm:px-5 sm:py-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs text-primary font-semibold uppercase tracking-wider">
              Target Domain:{' '}
              <span className="font-mono text-foreground text-sm lowercase font-bold">
                {domain}
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              Phase {Math.min(activeStep + 1, steps.length)} of {steps.length}
            </div>
          </div>

          <div id="scan-loader-desc" className="space-y-0.5 pt-0.5">
            <p className="text-sm sm:text-base font-semibold text-primary">
              Hang on while we complete the scan.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Meanwhile, explore our DPDP compliance products and capabilities below.
            </p>
          </div>
        </div>

        {/* Fancy Radar Loader Animation & Live Step Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-center">
          {/* Fancy Animated Radar Shield (5 cols on MD+) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center py-1 px-2">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Outer Rotating Glowing Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_12s_linear_infinite] motion-reduce:animate-none" />

              {/* Middle Counter-rotating Ring */}
              <div className="absolute inset-2 rounded-full border border-emerald-400/30 animate-[spin_8s_linear_infinite_reverse] motion-reduce:animate-none" />

              {/* Inner Radar Sweep Aura */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary/15 via-emerald-500/10 to-transparent animate-pulse motion-reduce:animate-none" />

              {/* Center Shield Icon */}
              <div className="relative z-10 p-3.5 rounded-full bg-background border border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.35)] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 text-primary" />
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-xs sm:text-sm font-mono font-medium text-primary tracking-wider">
                {steps[activeStep]?.label || 'Analyzing compliance signals...'}
              </span>
            </div>
          </div>

          {/* Live Steps Checklist (7 cols on MD+) */}
          <div className="md:col-span-7">
            {/* Step Breakdown */}
            <div className="space-y-2 bg-card p-3.5 sm:p-4 rounded-2xl border border-border">
              {steps.map((step, i) => {
                const Icon = step.icon
                const isActive = i === activeStep
                const isComplete = i < activeStep

                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-3 transition-colors"
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin motion-reduce:animate-none shrink-0" />
                    ) : (
                      <Icon className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-medium transition-colors',
                        isComplete && 'text-muted-foreground line-through opacity-70',
                        isActive && 'text-primary font-semibold text-sm',
                        !isActive && !isComplete && 'text-muted-foreground/40'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Section: Product Advertisements */}
        <ScannerProductAds />
      </motion.div>
    </div>
  )
}
