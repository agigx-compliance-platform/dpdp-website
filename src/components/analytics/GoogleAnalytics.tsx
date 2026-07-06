'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

function hasAnalyticsConsent(): boolean {
  return window.AgigxConsent?.getConsent()?.consentData?.analytics === true
}

function sendPageView(pagePath: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: pagePath })
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    if (hasAnalyticsConsent()) {
      sendPageView(pagePath)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const onConsent = (data: { consentData?: Record<string, boolean> }) => {
      if (data.consentData?.analytics) {
        sendPageView(window.location.pathname + window.location.search)
      }
    }

    const subscribe = () => {
      if (!window.AgigxConsent?.on) return false
      window.AgigxConsent.on('consent', onConsent)
      if (hasAnalyticsConsent()) {
        sendPageView(window.location.pathname + window.location.search)
      }
      return true
    }

    if (subscribe()) return

    const interval = window.setInterval(() => {
      if (subscribe()) window.clearInterval(interval)
    }, 200)

    return () => window.clearInterval(interval)
  }, [])

  return null
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker />
    </Suspense>
  )
}
