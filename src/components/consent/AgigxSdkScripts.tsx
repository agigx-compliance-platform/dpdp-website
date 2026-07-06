import Script from 'next/script'

const CONSENT_API_BASE =
  process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  ''

const CONSENT_DOMAIN =
  process.env.NEXT_PUBLIC_CONSENT_DOMAIN?.trim() || 'dpdpconsultancy.in'

const SDK_BASE =
  process.env.NEXT_PUBLIC_SDK_BASE_URL?.trim() || CONSENT_API_BASE

export function AgigxSdkScripts() {
  if (!CONSENT_API_BASE) return null

  return (
    <Script
      src={`${SDK_BASE}/api/v1/sdk/agigx.js`}
      data-domain={CONSENT_DOMAIN}
      data-api={CONSENT_API_BASE}
      data-features="consent,policies"
      data-policy-container="agigx-policy-links"
      strategy="afterInteractive"
    />
  )
}
