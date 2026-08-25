import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { JsonLd } from '@/components/seo/JsonLd'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { QuestionnaireModal } from '@/components/questionnaire/QuestionnaireModal'
import { FloatingBlob } from '@/components/questionnaire/FloatingBlob'
import { PrivacyPitstopCallout } from '@/components/ui/PrivacyPitstopCallout'
import { AgigxSdkScripts } from '@/components/consent/AgigxSdkScripts'
import { ConsentGatedGtagScripts } from '@/components/analytics/ConsentGatedGtagScripts'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DPDP Consultancy · DPDP Compliance Intelligence Platform India',
    template: '%s | DPDP Consultancy — DPDP Compliance India',
  },
  description:
    'India\'s leading DPDP compliance intelligence platform. Transform DPDP Act 2023 and AI governance into a living, enforceable compliance engine. Automated privacy assessments, consent management, DSAR automation, and AI-powered governance for Indian enterprises. Avoid penalties up to ₹250 Crore.',
  keywords: [
    'DPDP',
    'DPDP compliance',
    'DPDP Act',
    'DPDP Act 2023',
    'Digital Personal Data Protection',
    'Digital Personal Data Protection Act',
    'DPDP compliance India',
    'DPDP consultancy',
    'DPDP consultant',
    'DPDP consulting',
    'DPDP compliance platform',
    'DPDP compliance software',
    'DPDP compliance tool',
    'DPDP penalty',
    'DPDP Act penalty ₹250 crore',
    'consent management India',
    'consent management platform',
    'privacy compliance India',
    'data protection India',
    'AI governance India',
    'DSAR management',
    'DSAR automation',
    'data principal rights',
    'data fiduciary compliance',
    'privacy impact assessment India',
    'compliance scanner',
    'website privacy scan',
    'what is DPDP',
    'DPDP full form',
    'DPDP Act India',
    'DPDP Rules 2025',
    'Digital Personal Data Protection Act 2023',
    'Data Protection Board of India',
    'MeitY DPDP',
    'DPDP vs GDPR',
    'Significant Data Fiduciary',
    'DPDP DPO',
  ],
  authors: [{ name: 'DPDP Consultancy' }],
  alternates: {
    canonical: '/',
  },
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
    title: 'DPDP Consultancy · India\'s DPDP Compliance Intelligence Platform',
    description:
      'India\'s leading DPDP compliance platform. Automated privacy assessments, consent management, DSAR automation, and AI governance. Avoid penalties up to ₹250 Crore.',
    images: [
      {
        url: '/images/brand/social-icon-1024.png',
        width: 1024,
        height: 1024,
        alt: 'DPDP Consultancy — DPDP Compliance Intelligence Platform for India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPDP Consultancy · India\'s DPDP Compliance Intelligence Platform',
    description:
      'India\'s leading DPDP compliance platform. Automated assessments, consent management, DSAR automation & AI governance. Avoid ₹250 Crore penalties.',
    images: ['/images/brand/social-icon-1024.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    <html lang="en-IN" suppressHydrationWarning data-scroll-behavior="smooth" data-theme="dark">
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
        {consentApiUrl ? (
          <Script
            id="runtime-config"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.__RUNTIME_CONFIG__=Object.assign(window.__RUNTIME_CONFIG__||{},{consentApiUrl:${JSON.stringify(consentApiUrl)}});`,
            }}
          />
        ) : null}
        <ConsentGatedGtagScripts />
        <JsonLd />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <QuestionnaireModal />
            <FloatingBlob />
            <PrivacyPitstopCallout />
            <GoogleAnalytics />
          </SmoothScrollProvider>
        </ThemeProvider>
        <AgigxSdkScripts />
      </body>
    </html>
  )
}
