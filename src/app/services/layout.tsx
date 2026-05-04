import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compliance Services',
  description:
    'Expert-led DPDP compliance services: advisory, privacy operations, AI governance, technical implementation, assurance, cyber privacy, and managed services. Penalties up to ₹250 Crore.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
