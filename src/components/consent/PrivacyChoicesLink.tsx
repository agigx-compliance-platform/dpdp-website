'use client'

import type { MouseEvent } from 'react'

/**
 * Reopens the cookie preferences so a visitor can change or withdraw consent
 * at any time, as easily as they gave it. The href is a working fallback
 * (the cookie policy) for when the consent script has not loaded.
 */
export function PrivacyChoicesLink({ className }: { className?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const consent = window.AgigxConsent
    if (consent?.showPreferences) {
      event.preventDefault()
      consent.showPreferences()
    }
  }

  return (
    <a id="cookie-settings" href="/cookie-policy" onClick={onClick} className={className}>
      Your privacy choices
    </a>
  )
}
