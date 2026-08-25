'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Compass,
  Sparkles,
  ShieldAlert,
  Building2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lock,
} from 'lucide-react'
import { BrandMark } from '@/components/brand/BrandMark'
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

interface InfoCard {
  id: string
  badge: string
  title: string
  tagline: string
  content: string
  icon: React.ComponentType<{ className?: string }>
}

const INFO_CARDS: InfoCard[] = [
  {
    id: 'approach',
    badge: 'OUR APPROACH',
    title: 'Our Approach to Privacy',
    tagline: 'Practical, Structured Guidance for Real-World Workflows',
    content:
      'DPDP Consultancy helps organisations understand and improve their privacy and data-protection readiness through a practical, structured approach tailored to operational workflows.',
    icon: Compass,
  },
  {
    id: 'privacy-runway',
    badge: 'FRAMEWORK',
    title: 'Privacy Runway',
    tagline: 'A Guided Path from Obligations to Privacy Maturity',
    content:
      'Privacy Runway is a structured framework that guides organisations on a step-by-step journey—from understanding compliance obligations to achieving audit-ready privacy readiness.',
    icon: Sparkles,
  },
  {
    id: 'dpdpa-readiness',
    badge: 'STATUTORY RISK',
    title: 'DPDPA Readiness',
    tagline: 'Identify Compliance Gaps under India’s DPDP Act 2023',
    content:
      'Organisations can assess their readiness for India’s Digital Personal Data Protection Act, identify technical and operational gaps, and pinpoint high-priority areas needing attention.',
    icon: ShieldAlert,
  },
  {
    id: 'help-organisations',
    badge: 'FOR ORGANISATIONS',
    title: 'How We Help Organisations',
    tagline: 'Actionable Services & Privacy Maturity Advancement',
    content:
      'We provide privacy & DPDPA readiness assessments, identify data protection gaps, clarify data-processing practices, and deliver practical guidance to build strong privacy posture.',
    icon: Building2,
  },
  {
    id: 'help-principals',
    badge: 'FOR DATA PRINCIPALS',
    title: 'How We Help Data Principals',
    tagline: 'Understanding Your Personal Data Rights & Consent',
    content:
      'Data Principals can better understand privacy notices, consent mechanisms, and responsible data handling, enabling informed choices and effective grievance redressal.',
    icon: UserCheck,
  },
]

export function ScanProgressLoader({
  domain,
  activeStep,
  steps,
  className,
}: ScanProgressLoaderProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Auto-rotate informational cards every 6 seconds unless hovered/touched
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % INFO_CARDS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused])

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

  const currentCard = INFO_CARDS[activeCardIndex]
  const CardIcon = currentCard.icon

  const progressPercent = Math.min(
    100,
    Math.round(((Math.max(0, activeStep) + 1) / steps.length) * 100)
  )

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev - 1 + INFO_CARDS.length) % INFO_CARDS.length)
  }

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev + 1) % INFO_CARDS.length)
  }

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
          'w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 space-y-6 text-left shadow-lg backdrop-blur-2xl focus:outline-none custom-scrollbar',
          className
        )}
      >
        {/* Top Header: Logo + Non-Dismissable Scanner Lock Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
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
        <div className="space-y-2 bg-muted border border-border rounded-2xl p-4 sm:p-5">
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

          <p
            id="scan-loader-desc"
            className="text-sm sm:text-base text-foreground font-medium leading-relaxed pt-1"
          >
            <strong className="text-primary font-semibold">
              Hang on while we complete the scan
            </strong>{' '}
            — meanwhile, here’s a quick introduction to who we are and how we help.
          </p>
        </div>

        {/* Fancy Radar Loader Animation & Live Step Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-1">
          {/* Fancy Animated Radar Shield (5 cols on MD+) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              {/* Outer Rotating Glowing Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_12s_linear_infinite] motion-reduce:animate-none" />

              {/* Middle Counter-rotating Ring */}
              <div className="absolute inset-2 rounded-full border border-emerald-400/30 animate-[spin_8s_linear_infinite_reverse] motion-reduce:animate-none" />

              {/* Inner Radar Sweep Aura */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary/15 via-emerald-500/10 to-transparent animate-pulse motion-reduce:animate-none" />

              {/* Center Shield Icon */}
              <div className="relative z-10 p-4 rounded-full bg-background border border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.35)] flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-sm font-mono font-medium text-primary tracking-wider">
                {steps[activeStep]?.label || 'Analyzing compliance signals...'}
              </span>
            </div>
          </div>

          {/* Live Steps Checklist & Progress Bar (7 cols on MD+) */}
          <div className="md:col-span-7 space-y-4">
            {/* Step Breakdown */}
            <div className="space-y-2.5 bg-card p-4 rounded-2xl border border-border">
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

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground font-mono">
                <span>Scan Execution Progress</span>
                <span className="text-primary font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden border border-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Rotating Informational Cards Section */}
        <div
          className="relative pt-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded border border-border">
                {currentCard.badge}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                • DPDP Consultancy Overview
              </span>
            </div>

            {/* Controls: Prev / Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-1 rounded-md border border-border hover:border-primary/50 text-primary hover:bg-muted transition-colors"
                aria-label="Previous slide"
                type="button"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-mono text-muted-foreground px-1">
                {activeCardIndex + 1} / {INFO_CARDS.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1 rounded-md border border-border hover:border-primary/50 text-primary hover:bg-muted transition-colors"
                aria-label="Next slide"
                type="button"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Animated Info Card Container */}
          <div className="relative min-h-[140px] sm:min-h-[120px] rounded-2xl border border-border bg-gradient-to-br from-muted via-card to-muted p-5 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-primary shrink-0 hidden sm:flex">
                  <CardIcon className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <CardIcon className="w-4 h-4 text-primary sm:hidden shrink-0" />
                    <h4 className="text-sm font-bold text-foreground tracking-wide">
                      {currentCard.title}
                    </h4>
                  </div>
                  <div className="text-xs font-semibold text-primary/90">
                    {currentCard.tagline}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentCard.content}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Indicators (Dots) */}
          <div className="flex justify-center gap-1.5 mt-3">
            {INFO_CARDS.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setActiveCardIndex(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === activeCardIndex
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-primary/20 hover:bg-primary/40'
                )}
                aria-label={`Go to slide ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>

        {/* Statutory Risk Notice (Stat Card) */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5">
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shrink-0 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  DPDP ACT 2023 STATUTORY RISK AWARENESS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground font-medium leading-snug">
                DPDP fines in India can be up to{' '}
                <span className="font-bold text-amber-500 underline decoration-amber-500/40 underline-offset-2">
                  ₹250 Crore
                </span>{' '}
                per violation instance.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                Our automated scanner evaluates notice disclosures, cookie consent enforcement, user grievance redressal, and security posture against statutory DPDP requirements.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
