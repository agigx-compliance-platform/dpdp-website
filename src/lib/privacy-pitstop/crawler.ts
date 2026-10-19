import type { FetchedPage } from './types'
import {
  PAGE_PATHS, FETCH_TIMEOUT_MS, MAX_HTML_SIZE,
  EXCLUDED_PATH_PATTERNS, EXCLUDED_DOMAINS, DISCOVERABLE_PRIVACY_LINKS,
} from './constants'
import { isBlockedScanHost } from '@/lib/private-host'

/* ═══════════════════════════════════════════════════════════════
   URL Utilities (extracted from analyzer.ts for reuse)
   ═══════════════════════════════════════════════════════════════ */

export function normalizeUrl(domain: string): string {
  let d = domain.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(d)) d = `https://${d}`
  return d
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url, 'https://placeholder.com').hostname
  } catch {
    return ''
  }
}

/* ═══════════════════════════════════════════════════════════════
   Page Fetcher
   ═══════════════════════════════════════════════════════════════ */

export async function fetchPage(url: string, pageClass: string, hops = 0): Promise<FetchedPage> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const target = new URL(url)
    if (isBlockedScanHost(target.hostname)) {
      throw new Error(`Blocked host: ${target.hostname}`)
    }

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PrivacyPitstopBot/2.0 (+https://dpdpconsultancy.in/privacy-pitstop)',
        'Accept': 'text/html,application/xhtml+xml,text/plain',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-GPC': '1',
      },
      redirect: 'manual',
    })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      if (!location) throw new Error('Redirect without Location')
      const next = new URL(location, url)
      if (next.protocol !== 'http:' && next.protocol !== 'https:') {
        throw new Error('Redirect to non-http URL')
      }
      if (isBlockedScanHost(next.hostname)) {
        throw new Error(`Blocked redirect host: ${next.hostname}`)
      }
      if (hops >= 5) throw new Error('Too many redirects')
      return fetchPage(next.toString(), pageClass, hops + 1)
    }

    const headers: Record<string, string> = {}
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v })

    let html = ''
    if (res.ok) {
      const reader = res.body?.getReader()
      const chunks: Uint8Array[] = []
      let received = 0
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          received += value.byteLength
          if (received > MAX_HTML_SIZE) {
            await reader.cancel()
            throw new Error('Response exceeded size limit')
          }
          chunks.push(value)
        }
        const buffer = new Uint8Array(received)
        let offset = 0
        for (const chunk of chunks) {
          buffer.set(chunk, offset)
          offset += chunk.byteLength
        }
        html = new TextDecoder('utf-8').decode(buffer)
      }
    }

    return { url, status: res.status, html, headers, pageClass }
  } catch (err) {
    return {
      url, status: 0, html: '', headers: {}, pageClass,
      error: err instanceof Error ? err.message : 'Fetch failed',
    }
  } finally {
    clearTimeout(timeout)
  }
}

/* ═══════════════════════════════════════════════════════════════
   Safety Checks
   ═══════════════════════════════════════════════════════════════ */

function isExcludedPath(path: string): boolean {
  return EXCLUDED_PATH_PATTERNS.some(p => p.test(path))
}

function isExcludedDomain(domain: string): boolean {
  return EXCLUDED_DOMAINS.has(domain.replace(/^www\./, ''))
}

function isSameSite(linkDomain: string, siteDomain: string): boolean {
  const clean = (d: string) => d.replace(/^www\./, '')
  return clean(linkDomain) === clean(siteDomain) || linkDomain.endsWith(`.${clean(siteDomain)}`)
}

/* ═══════════════════════════════════════════════════════════════
   Link-based Page Discovery
   ═══════════════════════════════════════════════════════════════ */

function extractLinkHrefs(html: string): string[] {
  const hrefs: string[] = []
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) hrefs.push(m[1])
  return hrefs
}

/**
 * Discovers privacy-relevant pages by parsing links from fetched pages.
 * Only follows same-site links that match privacy-relevant patterns.
 * Excludes admin/login/private pages.
 */
function discoverLinkedPages(
  fetchedPages: FetchedPage[],
  baseUrl: string,
  siteDomain: string,
  alreadySeen: Set<string>,
): { url: string; pageClass: string }[] {
  const discovered: { url: string; pageClass: string }[] = []

  for (const page of fetchedPages) {
    if (page.status !== 200) continue

    const links = extractLinkHrefs(page.html)
    for (const href of links) {
      try {
        const resolved = new URL(href, page.url)
        const linkDomain = resolved.hostname
        const linkPath = resolved.pathname

        // Only same-site links
        if (!isSameSite(linkDomain, siteDomain)) continue

        // Skip excluded paths
        if (isExcludedPath(linkPath)) continue

        const fullUrl = `${resolved.protocol}//${resolved.host}${linkPath}`
        if (alreadySeen.has(fullUrl)) continue

        // Only follow privacy-relevant links
        const isRelevant = DISCOVERABLE_PRIVACY_LINKS.some(p => p.test(href))
        if (!isRelevant) continue

        // Determine page class from path
        let pageClass = 'discovered'
        if (/privacy|cookie|terms|legal|data.protect/i.test(linkPath)) pageClass = 'privacy'
        else if (/security|trust/i.test(linkPath)) pageClass = 'security'
        else if (/ai.polic|responsible.ai/i.test(linkPath)) pageClass = 'ai'
        else if (/rights|grievance|dpo|dsar|opt.out/i.test(linkPath)) pageClass = 'rights'
        else if (/contact|support|accessibility/i.test(linkPath)) pageClass = 'support'

        alreadySeen.add(fullUrl)
        discovered.push({ url: fullUrl, pageClass })
      } catch {
        // Invalid URL, skip
      }
    }
  }

  return discovered
}

/* ═══════════════════════════════════════════════════════════════
   Main Crawler
   ═══════════════════════════════════════════════════════════════ */

/**
 * Enhanced crawler: fetches configured PAGE_PATHS, then discovers additional
 * privacy-relevant pages via link extraction. Excludes admin/login/private pages.
 * Maximum 30 pages to prevent excessive crawling.
 */
export async function crawlPages(domain: string): Promise<FetchedPage[]> {
  const baseUrl = normalizeUrl(domain)
  const siteDomain = getDomainFromUrl(baseUrl)

  if (isBlockedScanHost(siteDomain) || isExcludedDomain(siteDomain)) {
    throw new Error(`Blocked or excluded domain: ${siteDomain}`)
  }

  const seen = new Set<string>()
  const tasks: Promise<FetchedPage>[] = []

  // Phase 1: Fetch all configured PAGE_PATHS
  for (const { path, pageClass } of PAGE_PATHS) {
    const url = `${baseUrl}${path === '/' ? '' : path}`
    if (seen.has(url)) continue
    seen.add(url)
    tasks.push(fetchPage(url, pageClass))
  }

  const configuredPages = await Promise.all(tasks)

  // Phase 2: Discover additional pages from links
  const discoveredLinks = discoverLinkedPages(configuredPages, baseUrl, siteDomain, seen)

  // Cap total pages at 30
  const MAX_TOTAL_PAGES = 30
  const remainingSlots = MAX_TOTAL_PAGES - configuredPages.length
  const linksToFetch = discoveredLinks.slice(0, Math.max(0, remainingSlots))

  let discoveredPages: FetchedPage[] = []
  if (linksToFetch.length > 0) {
    discoveredPages = await Promise.all(
      linksToFetch.map(({ url, pageClass }) => fetchPage(url, pageClass))
    )
  }

  return [...configuredPages, ...discoveredPages]
}
