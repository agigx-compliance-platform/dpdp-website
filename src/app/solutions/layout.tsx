import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Industry Solutions',
  description:
    'Industry-specific DPDP compliance solutions for e-commerce, healthcare, financial services, SaaS, regulated enterprises, GCC, and consulting firms.',
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
