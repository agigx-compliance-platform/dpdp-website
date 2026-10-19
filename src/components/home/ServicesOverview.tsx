'use client'

import Link from 'next/link'
import { Compass, ShieldCheck, Brain, Wrench } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

const services = [
  {
    icon: Compass,
    title: 'Advisory',
    description:
      'Applicability against Sections 5–16, SDF readiness, and a sequenced remediation plan.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy operations',
    description:
      'Consent, DSAR, breach notification, and processor contracts running as daily work.',
  },
  {
    icon: Brain,
    title: 'AI governance',
    description:
      'Purpose, notice, and rights controls on models that process personal data of Indian residents.',
  },
  {
    icon: Wrench,
    title: 'Technical implementation',
    description:
      'Embed on the site, connect the stores you already run, and keep records in your network.',
  },
]

export function ServicesOverview() {
  return (
    <SectionWrapper id="services-preview">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Services
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Software plus people who have read the Act.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc) => (
          <div key={svc.title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
            <svc.icon className="mb-4 h-5 w-5 text-primary" aria-hidden />
            <h3 className="text-base font-semibold">{svc.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/services">
          <Button variant="outline">All services</Button>
        </Link>
      </div>
    </SectionWrapper>
  )
}
