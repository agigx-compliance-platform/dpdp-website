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
    href: '/cookie-consent',
    title: 'Cookie consent',
    blurb: 'Two banner layouts now. More can be added. Block until grant.',
  },
  {
    href: '/policy-notice',
    title: 'Policy and notice',
    blurb: 'Privacy notice and cookie policy today. More notice types can be added.',
  },
  {
    href: '/consent-management',
    title: 'Consent management',
    blurb: 'Purpose grant, withdrawal, and a record you can produce later.',
  },
  {
    href: '/infra-posture',
    title: 'Infrastructure posture',
    blurb: 'Cloud and code, seen as a privacy duty. More estates can be added.',
  },
  {
    href: '/dpdp-platform',
    title: 'DPDP platform',
    blurb: 'Consent, scanning, DSAR automation, and AI governance in one compliance platform.',
  },
  {
    href: '/data-discovery',
    title: 'Data discovery',
    blurb: 'Inventory of systems and fields. Records stay in your network.',
  },
  {
    href: '/data-lineage',
    title: 'Data lineage',
    blurb: 'How data moved, and which stores are still unknown.',
  },
] as const

type RelatedGuidesProps = {
  current: string
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
