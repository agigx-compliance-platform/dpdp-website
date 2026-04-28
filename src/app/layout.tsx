import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'AGIGx — DPDP Compliance Intelligence Platform',
    template: '%s | AGIGx',
  },
  description:
    'Transform DPDP, GDPR, and AI governance into a living, enforceable compliance engine. Automated assessments, consent management, and AI-powered governance for Indian enterprises.',
  keywords: [
    'DPDP compliance',
    'Digital Personal Data Protection',
    'DPDP 2023',
    'consent management',
    'privacy compliance India',
    'GDPR compliance',
    'AI governance',
    'data protection',
    'compliance scanner',
    'DSAR management',
  ],
  authors: [{ name: 'AGIGx' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'AGIGx',
    title: 'AGIGx — DPDP Compliance Intelligence Platform',
    description:
      'Transform DPDP, GDPR, and AI governance into a living, enforceable compliance engine.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGIGx — DPDP Compliance Intelligence Platform',
    description:
      'Transform DPDP, GDPR, and AI governance into a living, enforceable compliance engine.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0f1a' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
