import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'What does infrastructure posture cover?',
    answer:
      'Cloud accounts and clusters where personal data may sit. Findings are misconfigurations that make that data reachable.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Infrastructure Posture for DPDP',
  description:
    'Cloud and code posture for personal data: AWS, Azure, GCP, and Kubernetes. Open storage and leaked identifiers in one list. More estates can be added.',
  path: '/infra-posture',
  keywords: ['DPDP infrastructure', 'cloud privacy posture', 'reasonable security safeguards'],
})

export default function InfraPostureLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Infrastructure posture', href: '/infra-posture' }]} />
      <FaqJsonLd faqs={FAQS} />
      {children}
    </>
  )
}
