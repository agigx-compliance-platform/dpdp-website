import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compliance Assessment',
  description:
    'Take the Consent Cockpit compliance assessment: 10 tailored questions, optional free website privacy scan, and personalized product and service recommendations.',
}

export default function QuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return children
}
