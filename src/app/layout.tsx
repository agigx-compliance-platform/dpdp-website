import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { QuestionnaireModal } from '@/components/questionnaire/QuestionnaireModal'
import { FloatingBlob } from '@/components/questionnaire/FloatingBlob'

export const metadata: Metadata = {
  metadataBase:
    typeof process.env.NEXT_PUBLIC_SITE_URL === 'string'
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : new URL('http://localhost:8000'),
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
    images: [
      {
        url: '/images/hero-poster.png',
        width: 1536,
        height: 1024,
        alt: 'AGIGx compliance intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGIGx — DPDP Compliance Intelligence Platform',
    description:
      'Transform DPDP, GDPR, and AI governance into a living, enforceable compliance engine.',
    images: ['/images/hero-poster.png'],
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
          <SmoothScrollProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <QuestionnaireModal />
            <FloatingBlob />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
