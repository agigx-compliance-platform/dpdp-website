import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Consent Cockpit for DPDP compliance advisory, product demos, and partnership enquiries.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
