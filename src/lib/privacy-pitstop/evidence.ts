import type { Evidence, EvidenceType } from './types'

/**
 * Factory for creating structured evidence objects.
 * Every finding MUST include at least one evidence item.
 */
export function createEvidence(
  type: EvidenceType,
  opts: {
    url?: string
    snippet?: string
    domLocation?: string
    cookieName?: string
    headerName?: string
    headerValue?: string
    scanId?: string
  } = {},
): Evidence {
  return {
    type,
    url: opts.url,
    snippet: opts.snippet?.slice(0, 500), // Cap snippet length
    domLocation: opts.domLocation,
    cookieName: opts.cookieName,
    headerName: opts.headerName,
    headerValue: opts.headerValue,
    timestamp: new Date().toISOString(),
    scanId: opts.scanId,
  }
}

/** Convenience: page URL evidence */
export function pageEvidence(url: string, scanId?: string): Evidence {
  return createEvidence('page_url', { url, scanId })
}

/** Convenience: HTML snippet evidence */
export function snippetEvidence(url: string, snippet: string, scanId?: string): Evidence {
  return createEvidence('html_snippet', { url, snippet, scanId })
}

/** Convenience: HTTP header evidence */
export function headerEvidence(url: string, headerName: string, headerValue: string, scanId?: string): Evidence {
  return createEvidence('http_header', { url, headerName, headerValue, scanId })
}

/** Convenience: script URL evidence */
export function scriptEvidence(scriptUrl: string, pageUrl: string, scanId?: string): Evidence {
  return createEvidence('script_url', { url: scriptUrl, snippet: `Found on ${pageUrl}`, scanId })
}

/** Convenience: cookie evidence */
export function cookieEvidence(cookieName: string, url: string, headerValue?: string, scanId?: string): Evidence {
  return createEvidence('cookie', { cookieName, url, headerValue, scanId })
}

/** Convenience: policy clause evidence */
export function clauseEvidence(url: string, clause: string, scanId?: string): Evidence {
  return createEvidence('policy_clause', { url, snippet: clause, scanId })
}

/** Convenience: link URL evidence */
export function linkEvidence(linkUrl: string, pageUrl: string, scanId?: string): Evidence {
  return createEvidence('link_url', { url: linkUrl, snippet: `Link found on ${pageUrl}`, scanId })
}
