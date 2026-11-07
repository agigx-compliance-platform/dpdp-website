import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { pageSeo } from '@/lib/page-metadata'

const FAQS = [
  {
    question: 'What do these checks cover?',
    answer:
      'Cloud accounts and clusters where personal data may be kept, on AWS, Azure, GCP, and Kubernetes. We look for settings that could expose that data.',
  },
]

export const metadata: Metadata = pageSeo({
  title: 'Cloud and Code Checks for DPDP',
  description:
    'Spot cloud and code settings that could expose personal data, across AWS, Azure, GCP, and Kubernetes. More environments can be added.',
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
