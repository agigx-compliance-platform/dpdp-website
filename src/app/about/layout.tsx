import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Consent Cockpit',
  description:
    'Consent Cockpit builds compliance intelligence that transforms regulatory frameworks into enforceable technical controls for enterprises.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
