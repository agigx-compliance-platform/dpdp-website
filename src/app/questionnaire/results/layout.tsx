import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your DPDP Compliance Recommendations',
  description: 'Personalized DPDP compliance product and service recommendations based on your assessment.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/questionnaire',
  },
}

export default function QuestionnaireResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
