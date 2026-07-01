import type { Recommendation } from './types'

const RECOMMENDATION_HREFS: Record<string, string> = {
  'consent-platform': '/products',
  'consent-sdk': '/products',
  'dsar-platform': '/products',
  'infra-scanner': '/products',
  trustscope: '/products',
  'ai-governance': '/products',
  'adaptive-engine': '/products',
  'ai-assistant': '/products',
  'cyber-privacy': '/products',
  'data-sovereignty': '/products',
  'processor-governance': '/products#processor-governance',
  advisory: '/services',
  assurance: '/services',
  'technical-implementation': '/services',
  'managed-operations': '/services',
  'gap-assessment': '/services',
  'compliance-starter': '/contact',
  'compliance-accelerator': '/contact',
  'priority-fix': '/contact',
}

export function getRecommendationHref(rec: Recommendation): string {
  const mapped = RECOMMENDATION_HREFS[rec.id]
  if (mapped) return mapped

  if (rec.type === 'service') return '/services'
  if (rec.type === 'package') return '/contact'
  return '/products'
}

export function getConsultationHref(): string {
  return '/contact'
}
