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
    default: 'DPDP Consultancy · DPDP Compliance Intelligence',
    template: '%s | DPDP Consultancy',
  },
  description:
    'Transform DPDP and AI governance into a living, enforceable compliance engine. Automated assessments, consent management, and AI-powered governance for Indian enterprises.',
  keywords: [
    'DPDP compliance',
    'Digital Personal Data Protection',
    'DPDP 2023',
    'consent management',
    'privacy compliance India',
    'AI governance',
    'data protection',
    'compliance scanner',
    'DSAR management',
  ],
  authors: [{ name: 'DPDP Consultancy' }],
  icons: {
    icon: [
      { url: '/images/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/brand/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'DPDP Consultancy',
    title: 'DPDP Consultancy · DPDP Compliance Intelligence',
    description:
      'Transform DPDP and AI governance into a living, enforceable compliance engine.',
    images: [
      {
        url: '/images/brand/social-icon-1024.png',
        width: 1024,
        height: 1024,
        alt: 'DPDP Consultancy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPDP Consultancy · DPDP Compliance Intelligence',
    description:
      'Transform DPDP and AI governance into a living, enforceable compliance engine.',
    images: ['/images/brand/social-icon-1024.png'],
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
  const consentApiUrl =
    process.env.CONSENT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    ''

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
        {consentApiUrl ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__RUNTIME_CONFIG__=Object.assign(window.__RUNTIME_CONFIG__||{},{consentApiUrl:${JSON.stringify(consentApiUrl)}});`,
            }}
          />
        ) : null}
      </head>
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
