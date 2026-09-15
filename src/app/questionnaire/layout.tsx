import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Free DPDP Consultancy Assessment — Check Your Readiness',
  description:
    'Free DPDP Consultancy assessment: 10 questions, optional website scan, and personalised DPDP compliance recommendations.',
  path: '/questionnaire',
  keywords: ['DPDP Consultancy assessment', 'dpdpconsultancy', 'DPDP readiness check', 'free DPDP assessment', 'DPDP compliance questionnaire'],
  ogDescription: 'Take the free DPDP compliance assessment: 10 questions, free privacy scan, and personalized recommendations.',
})

export default function QuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Free DPDP Compliance Assessment', href: '/questionnaire' }]} />
      {children}
    </>
  )
}
