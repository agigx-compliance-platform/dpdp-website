/**
 * Server-side fetch of the policy HTML that the Agigx SDK (embed-policy.js) shows.
 *
 * The SDK renders the policy in the browser, so crawlers and compliance scanners see an
 * empty page. Fetching the same endpoint on the server puts the text in the initial HTML;
 * embed-policy.js still runs afterwards and adds the language selector.
 */

const CONSENT_API = (
  process.env.NEXT_PUBLIC_CONSENT_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  ''
).replace(/\/$/, '')

const CONSENT_DOMAIN = process.env.NEXT_PUBLIC_CONSENT_DOMAIN?.trim() || 'dpdpconsultancy.in'

/** Policy edits in the SDK editor show up on the page within this many seconds. */
const REVALIDATE_SECONDS = 3600

export type SdkPolicyType = 'privacy_policy' | 'cookie_policy'

/** Mirrors embed-policy.js: keeps the <body> content and the first <style> from <head>. */
export function extractPolicyBody(raw: string): string {
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(raw)?.[1] ?? raw
  const head = /<head[^>]*>([\s\S]*)<\/head>/i.exec(raw)?.[1]
  const style = head ? /<style[^>]*>([\s\S]*?)<\/style>/i.exec(head)?.[1] : undefined
  const html = style ? `<style>${style}</style>${body}` : body
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
}

export async function fetchSdkPolicyHtml(policyType: SdkPolicyType): Promise<string | null> {
  if (!CONSENT_API) return null
  const url = `${CONSENT_API}/api/v1/sdk/policy/${policyType}?domain=${encodeURIComponent(CONSENT_DOMAIN)}`
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = extractPolicyBody(await res.text()).trim()
    return html.length > 0 ? html : null
  } catch {
    // API unreachable at build/render time: the SDK still loads the policy in the browser.
    return null
  }
}
