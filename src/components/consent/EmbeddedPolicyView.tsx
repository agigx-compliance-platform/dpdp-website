'use client'

import { useEffect } from 'react'

const CONSENT_API =
  process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  ''

const CONSENT_DOMAIN =
  process.env.NEXT_PUBLIC_CONSENT_DOMAIN?.trim() || 'dpdpconsultancy.in'

const SDK_BASE =
  process.env.NEXT_PUBLIC_SDK_BASE_URL?.trim() || CONSENT_API

interface EmbeddedPolicyViewProps {
  policyType: 'privacy_policy' | 'cookie_policy'
  containerId: string
  scriptId: string
}

export function EmbeddedPolicyView({
  policyType,
  containerId,
  scriptId,
}: EmbeddedPolicyViewProps) {
  useEffect(() => {
    if (!CONSENT_API) return

    document.getElementById(scriptId)?.remove()

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `${SDK_BASE.replace(/\/$/, '')}/api/v1/sdk/embed-policy.js`
    script.async = true
    script.setAttribute('data-domain', CONSENT_DOMAIN)
    script.setAttribute('data-type', policyType)
    script.setAttribute('data-api', CONSENT_API.replace(/\/$/, ''))
    script.setAttribute('data-policy-container', containerId)

    document.body.appendChild(script)
    return () => {
      document.getElementById(scriptId)?.remove()
    }
  }, [policyType, containerId, scriptId])

  return (
    <div
      id={containerId}
      className="min-h-[320px] w-full prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary agigx-embed-policy-host"
    >
      {!CONSENT_API ? (
        <p className="text-sm text-muted-foreground not-prose">
          Policy content is unavailable — consent API URL is not configured.
        </p>
      ) : (
        <div className="not-prose space-y-3 animate-pulse">
          <div className="h-4 bg-secondary rounded w-3/4" />
          <div className="h-4 bg-secondary rounded w-full" />
          <div className="h-4 bg-secondary rounded w-5/6" />
          <div className="h-4 bg-secondary rounded w-2/3" />
        </div>
      )}
    </div>
  )
}
