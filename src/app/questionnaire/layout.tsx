import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { pageSeo } from '@/lib/page-metadata'

export const metadata: Metadata = pageSeo({
  title: 'Free DPDP Compliance Assessment — Check Your Readiness',
  description:
    'Take the free DPDP compliance assessment by DPDP Consultancy: 10 tailored questions, optional free website privacy scan, and personalized DPDP compliance recommendations for your business.',
  path: '/questionnaire',
  keywords: ['DPDP compliance assessment', 'DPDP readiness check', 'free DPDP assessment', 'DPDP compliance questionnaire', 'DPDP compliance score'],
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
