'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { ConnectorCanvas } from '@/components/workflow'
import {
  consentCenter,
  consentEdges,
  consentNodes,
  discoveryCenter,
  discoveryEdges,
  discoveryNodes,
  dsarCenter,
  dsarEdges,
  dsarNodes,
  lineageCenter,
  lineageEdges,
  lineageNodes,
  processorCenter,
  processorEdges,
  processorNodes,
} from '@/lib/workflows'
import { cn } from '@/lib/utils'

const TABS = [
  {
    id: 'discover',
    label: 'Discover',
    href: '/data-discovery',
    copy: 'Locate the stores you already run, classify the personal data, and mark what a rights request can look up. Records stay in your network.',
    bullets: [
      'Start from the catalogs those systems already expose',
      'Name contact, financial, and children’s data',
      'Exact lookups for rights, not a guessed search',
      'Further connectors can be added',
      'Inventory of fields, not a copy of the rows',
    ],
    nodes: discoveryNodes,
    edges: discoveryEdges,
    center: discoveryCenter,
  },
  {
    id: 'lineage',
    label: 'Map lineage',
    href: '/data-lineage',
    copy: 'How personal data moved, and which stores are still unknown. Pipeline definitions, infrastructure, query history, and job runs feed the map. Gaps stay listed.',
    bullets: [
      'Pipeline definitions',
      'Infrastructure definitions',
      'Query history',
      'Job runs',
      'Coverage of known versus unknown stores',
    ],
    nodes: lineageNodes,
    edges: lineageEdges,
    center: lineageCenter,
  },
  {
    id: 'consent',
    label: 'Collect consent',
    href: '/consent-management',
    copy: 'Notice, purpose grant, withdrawal, and a sealed receipt. Two cookie banner layouts ship today. The same purpose is what vendors receive when a choice changes.',
    bullets: [
      'Bar and modal layouts now. More can be added',
      'Cookie discovery on the live property',
      'Consent log you can produce later',
      'Withdrawal as easy as the grant',
      'Privacy notice and cookie policy, versioned together',
    ],
    nodes: consentNodes,
    edges: consentEdges,
    center: consentCenter,
  },
  {
    id: 'rights',
    label: 'Fulfil rights',
    href: '/products#dsar-platform',
    copy: 'Access, correction, and erasure run against the inventory, not a ticket queue. Lookups are exact indexed keys. Backups that cannot erase are disclosed as retained.',
    bullets: [
      'Multi-channel intake',
      'Locate via indexed identity, never a sampled search',
      'SLA tracking for access, correction, and erasure',
      'Named grievance officer',
      'Evidence of each downstream action',
    ],
    nodes: dsarNodes,
    edges: dsarEdges,
    center: dsarCenter,
  },
  {
    id: 'processors',
    label: 'Govern processors',
    href: '/products#processor-governance',
    copy: 'Vendors sit in a registry mapped to purposes. Consent changes and DSAR actions propagate on webhooks. Delivery failures stay visible.',
    bullets: [
      'Processor registry with lifecycle states',
      'Purpose mapping',
      'Downstream notify when a choice or ticket changes',
      'Delivery, retry, and failure view',
      'Vendor risk on the organisation dashboard',
    ],
    nodes: processorNodes,
    edges: processorEdges,
    center: processorCenter,
  },
  {
    id: 'prove',
    label: 'Prove compliance',
    href: '/dpdp-platform',
    copy: 'Receipts, scan reports, and lineage coverage are the artefacts a DPO or the Board inspects. Scores without evidence are not shown.',
    bullets: [
      'Consent receipts with IST timestamps',
      'Public-site scans with findings, not invented scores',
      'DSAR response ledger',
      'Lineage coverage gaps listed, not hidden',
      'Self-hosted option when records cannot leave',
    ],
    nodes: consentNodes,
    edges: consentEdges,
    center: consentCenter,
  },
] as const

export function SolutionTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('discover')
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]

  return (
    <SectionWrapper id="platform">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Platform
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          One control plane. Six jobs.
        </h2>
      </div>

      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Platform jobs"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === active}
            onClick={() => setActive(item.id)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors',
              item.id === active
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-base leading-relaxed text-muted-foreground">{tab.copy}</p>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            {tab.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
          <Link
            href={tab.href}
            className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Learn more
          </Link>
        </div>
        <ConnectorCanvas
          variant="canvas"
          nodes={tab.nodes}
          edges={tab.edges}
          center={tab.center}
          minHeight={480}
        />
      </div>
    </SectionWrapper>
  )
}
