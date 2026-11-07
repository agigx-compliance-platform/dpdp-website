import Link from 'next/link'
import { Brain, Compass, Headphones, Wrench } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

const PACKAGES = [
  {
    icon: Compass,
    title: 'Readiness',
    description: 'Find out what applies to you, where the gaps are, and what to fix first.',
    href: '/services#readiness',
  },
  {
    icon: Wrench,
    title: 'Implementation',
    description: 'Put the right processes and tools in place across your website, systems, and vendors.',
    href: '/services#implementation',
  },
  {
    icon: Headphones,
    title: 'Managed privacy',
    description: 'Let our team run the daily privacy work with you, if you would rather not build a team.',
    href: '/services#managed',
  },
  {
    icon: Brain,
    title: 'AI governance',
    description: 'Set clear rules for using AI tools when personal data is involved.',
    href: '/services#ai-governance',
  },
]

export function ServicesOverview() {
  return (
    <SectionWrapper id="services-preview">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Help from our team
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Need more than software? Choose how much help you want.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PACKAGES.map((pkg) => (
          <Link
            key={pkg.title}
            href={pkg.href}
            className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-colors hover:border-primary/40"
          >
            <pkg.icon className="mb-4 h-5 w-5 text-primary" aria-hidden />
            <h3 className="text-base font-semibold">{pkg.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/services">
          <Button variant="outline">See all services</Button>
        </Link>
        <Link href="/pricing">
          <Button variant="ghost">How pricing works</Button>
        </Link>
      </div>
    </SectionWrapper>
  )
}
