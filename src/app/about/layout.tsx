import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About AGIGx',
  description:
    'AGIGx builds compliance intelligence engines that transform regulatory frameworks into enforceable technical controls for enterprises.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
