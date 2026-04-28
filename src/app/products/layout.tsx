import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compliance Products',
  description:
    'AI-powered compliance products: Consent Management Platform, TrustScope Scanner, DSAR Management, Infrastructure Scanner, AI Compliance Assistant, and Adaptive Compliance Engine.',
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
