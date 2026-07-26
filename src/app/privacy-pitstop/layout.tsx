import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Pitstop',
  description:
    'Know what websites collect about you. Analyze any website\'s privacy policy in about 10 seconds — free, no signup required.',
}

export default function PrivacyPitstopLayout({ children }: { children: React.ReactNode }) {
  return children
}
