import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About dpdpconsultancy',
  description:
    'dpdpconsultancy builds compliance intelligence that transforms DPDP obligations into enforceable technical controls for enterprises.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
