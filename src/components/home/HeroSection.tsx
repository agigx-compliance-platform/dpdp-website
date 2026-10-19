'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { HeroBackground, LedgerScene } from '@/components/illustrations'

export function HeroSection() {
  const prefersReduced = useReducedMotion()
  const openModal = () => useQuestionnaireStore.getState().openModal()
  const delay = (n: number) => (prefersReduced ? 0 : n)

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-32 md:pb-24">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay(0.05) }}
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            >
              DPDP Act 2023 · India
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: delay(0.12) }}
              className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              Consent, inventory, and rights. A ledger the Board can read.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay(0.2) }}
              className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Personal data stays in your network. Every grant, withdrawal, and
              erasure writes a receipt the Board can ask for.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay(0.28) }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button variant="primary" size="lg" onClick={openModal}>
                Start Assessment
              </Button>
              <Link href="/privacy-pitstop">
                <Button variant="outline" size="lg">
                  Scan a public site
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: delay(0.2) }}
          >
            <LedgerScene />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
