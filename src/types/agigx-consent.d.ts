interface AgigxConsentRecord {
  action: string
  consentData: Record<string, boolean>
  ts: number
}

interface AgigxConsentAPI {
  getConsent(): AgigxConsentRecord | null
  acceptAll(): void
  rejectAll(): void
  showPreferences(): void
  withdraw(): void
  recheck(): void
  identify(userId: string): void
  on(event: string, callback: (data: { consentData?: Record<string, boolean> }) => void): void
}

interface Window {
  AgigxConsent?: AgigxConsentAPI
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[]
}
