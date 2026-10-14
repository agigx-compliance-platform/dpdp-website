import type { Recommendation } from './types'
import { PRODUCTS } from './products-data'

/** Recommendations with their own page. Anything listed on /products links to its anchor there. */
const DEDICATED_PAGES: Record<string, string> = {
  'consent-platform': '/consent-management',
  'consent-sdk': '/consent-management',
  advisory: '/services',
  assurance: '/services',
  'technical-implementation': '/services',
  'managed-operations': '/services',
  'gap-assessment': '/services',
  'compliance-starter': '/contact',
  'compliance-accelerator': '/contact',
  'priority-fix': '/contact',
}

const PRODUCT_ANCHORS = new Set<string>(PRODUCTS.map(product => product.id))

export function getRecommendationHref(rec: Recommendation): string {
  const page = DEDICATED_PAGES[rec.id]
  if (page) return page
  if (PRODUCT_ANCHORS.has(rec.id)) return `/products#${rec.id}`

  if (rec.type === 'service') return '/services'
  if (rec.type === 'package') return '/contact'
  return '/products'
}

export function getConsultationHref(): string {
  return '/contact'
}
