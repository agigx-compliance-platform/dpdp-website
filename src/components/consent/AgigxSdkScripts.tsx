import Script from 'next/script'

const CONSENT_API_BASE =
  process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  ''

const CONSENT_DOMAIN =
  process.env.NEXT_PUBLIC_CONSENT_DOMAIN?.trim() || 'dpdpconsultancy.in'

const SDK_BASE =
  process.env.NEXT_PUBLIC_SDK_BASE_URL?.trim() || CONSENT_API_BASE

const DSAR_API_BASE = process.env.NEXT_PUBLIC_DSAR_API_URL?.trim() || undefined

/**
 * Loads the unified Agigx SDK:
 *   consent - cookie consent banner
 *   policies - Privacy / Cookie policy links in the footer (#agigx-policy-links)
 *   rights - DSAR + Grievance links/modals in the footer ([data-agigx-rights="footer"])
 *   form - anonymous form consent (checkbox cards on [data-agigx-form-consent]);
 *              ignored by SDK builds that do not ship form mode yet.
 */
export function AgigxSdkScripts() {
  if (!CONSENT_API_BASE) return null

  return (
    <Script
      src={`${SDK_BASE}/api/v1/sdk/agigx.js`}
      data-domain={CONSENT_DOMAIN}
      data-api={CONSENT_API_BASE}
      data-dsar-api={DSAR_API_BASE}
      data-features="consent,policies,rights,form"
      // Consent checkboxes only exist in English. Without this the form follows the browser
      // language, finds no checkboxes for other languages, and submits with no consent recorded.
      data-locale="en"
      data-logo-url="/images/brand/logo-icon.png"
      data-policy-container="agigx-policy-links"
      data-rights-footer="true"
      strategy="afterInteractive"
    />
  )
}
