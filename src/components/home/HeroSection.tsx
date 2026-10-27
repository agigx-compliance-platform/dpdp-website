'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { HeroBackground, LedgerScene } from '@/components/illustrations'

/**
 * Entrance animation is CSS, not Framer Motion, so the headline paints from the
 * server HTML instead of waiting at opacity 0 for hydration.
 */
const enter = (delay: number) => ({ animationDelay: `${delay}s` })

export function HeroSection() {
  const openModal = () => useQuestionnaireStore.getState().openModal()

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-32 md:pb-24">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="max-w-xl">
            <p
              style={enter(0.05)}
              className="hero-enter mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            >
              DPDP Act 2023 · India
            </p>
            <h1
              style={enter(0.12)}
              className="hero-enter text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              Consent, inventory, and rights. A ledger the Board can read.
            </h1>
            <p
              style={enter(0.2)}
              className="hero-enter mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Personal data stays in your network. Every grant, withdrawal, and
              erasure writes a receipt the Board can ask for.
            </p>
            <div style={enter(0.28)} className="hero-enter mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" onClick={openModal}>
                Start Assessment
              </Button>
              <Link href="/privacy-pitstop">
                <Button variant="outline" size="lg">
                  Scan a public site
                </Button>
              </Link>
            </div>
          </div>
          <div style={enter(0.2)} className="hero-enter">
            <LedgerScene />
          </div>
        </div>
      </div>
    </section>
  )
}
