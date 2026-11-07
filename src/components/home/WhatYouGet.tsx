import Link from 'next/link'
import { ArrowUpRight, ClipboardCheck, Cookie, FileSearch, FileText, GitBranch, Users } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Find personal data',
    body: 'See which of your systems hold personal details, without copying the records out.',
    href: '/data-discovery',
  },
  {
    icon: GitBranch,
    title: 'See where it goes',
    body: 'Follow how details move between systems, and see what is still unknown.',
    href: '/data-lineage',
  },
  {
    icon: Cookie,
    title: 'Ask before you collect',
    body: 'A clear cookie banner and privacy notice, with a real choice for visitors.',
    href: '/cookie-consent',
  },
  {
    icon: FileText,
    title: 'Answer people’s requests',
    body: 'Handle requests to see, correct, or delete data, and track each one to the end.',
    href: '/products#dsar-platform',
  },
  {
    icon: Users,
    title: 'Keep vendors in step',
    body: 'List who receives people’s data, and tell them when a choice changes.',
    href: '/products#processor-governance',
  },
  {
    icon: ClipboardCheck,
    title: 'Keep the proof',
    body: 'Records of who agreed to what and when, ready if an auditor or the regulator asks.',
    href: '/consent-management',
  },
]

export function WhatYouGet() {
  return (
    <SectionWrapper id="platform">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">What you get</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          One place to do the daily work.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Start with what you need most and add the rest later.
        </p>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <Link
              href={feature.href}
              className="group block h-full rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-colors hover:border-primary/40"
            >
              <span className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-4 block text-base font-semibold text-foreground">{feature.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{feature.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  )
}
