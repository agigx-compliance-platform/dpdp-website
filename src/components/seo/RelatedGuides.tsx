import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

const GUIDES = [
  {
    href: '/what-is-dpdp',
    title: 'What is DPDP?',
    blurb: 'The Digital Personal Data Protection Act 2023, who it applies to, and penalties.',
  },
  {
    href: '/dpdp-compliance',
    title: 'DPDP compliance',
    blurb: 'Obligation domains, a practical compliance path, and how Indian organisations operationalise the Act.',
  },
  {
    href: '/consent-management',
    title: 'Consent management',
    blurb: 'Notices, granular purpose consent, withdrawal, and audit-ready proof under Section 6.',
  },
  {
    href: '/dpdp-platform',
    title: 'DPDP platform',
    blurb: 'Consent, scanning, DSAR automation, and AI governance in one compliance platform.',
  },
] as const

type RelatedGuidesProps = {
  current: (typeof GUIDES)[number]['href']
}

export function RelatedGuides({ current }: RelatedGuidesProps) {
  const items = GUIDES.filter((guide) => guide.href !== current)

  return (
    <SectionWrapper className="py-8 pb-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground">Related guides</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {items.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="block h-full rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
              >
                <p className="font-semibold text-foreground">{guide.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  )
}
