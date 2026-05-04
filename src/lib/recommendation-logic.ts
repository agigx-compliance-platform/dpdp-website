import type { QuestionnaireResponses, ScanResult, Recommendation } from './types'

interface ScoreEntry {
  score: number
  reasons: string[]
  gaps: string[]
  sections: string[]
}

type ScoreMap = Record<string, ScoreEntry>

function initEntry(map: ScoreMap, id: string) {
  if (!map[id]) {
    map[id] = { score: 0, reasons: [], gaps: [], sections: [] }
  }
}

function addScore(
  map: ScoreMap,
  id: string,
  points: number,
  reason: string,
  gap?: string,
  sections?: string[]
) {
  initEntry(map, id)
  map[id].score += points
  if (reason) map[id].reasons.push(reason)
  if (gap) map[id].gaps.push(gap)
  if (sections) map[id].sections.push(...sections)
}

function applyRoleSignals(map: ScoreMap, role: string) {
  switch (role) {
    case 'legal-compliance':
    case 'dpo-privacy':
      addScore(map, 'advisory', 3, 'Your role focuses on legal/compliance governance', undefined, ['Section 8(7)', 'Section 10'])
      addScore(map, 'assurance', 2, 'Compliance officers benefit from independent validation')
      break
    case 'cio-cto':
    case 'engineering-product':
      addScore(map, 'consent-platform', 3, 'Technical leaders need platform-level compliance tools', undefined, ['Section 6', 'Section 7'])
      addScore(map, 'technical-implementation', 2, 'Engineering roles require hands-on technical support')
      break
    case 'ciso-infosec':
      addScore(map, 'cyber-privacy', 3, 'Security leaders need integrated privacy and security controls', undefined, ['Section 8(5)'])
      addScore(map, 'infra-scanner', 2, 'InfoSec teams need continuous privacy scanning')
      break
    case 'audit-risk':
      addScore(map, 'assurance', 3, 'Audit professionals need formal compliance validation', undefined, ['Section 10'])
      break
  }
}

function applyOrgTypeSignals(map: ScoreMap, orgType: string) {
  switch (orgType) {
    case 'startup':
      addScore(map, 'trustscope', 3, 'Startups need lightweight, fast-track compliance solutions', undefined, ['Section 4'])
      addScore(map, 'ai-assistant', 2, 'AI-guided compliance reduces the need for large teams')
      break
    case 'mid-market':
    case 'enterprise':
      addScore(map, 'consent-platform', 3, 'Enterprises need comprehensive consent management at scale', undefined, ['Section 6', 'Section 7'])
      addScore(map, 'dsar-platform', 2, 'Large organizations handle high volumes of data subject requests', undefined, ['Section 11', 'Section 12', 'Section 13'])
      addScore(map, 'managed-operations', 2, 'Enterprises benefit from managed compliance operations')
      break
    case 'platform':
      addScore(map, 'consent-sdk', 3, 'Platforms need embeddable consent SDKs for their ecosystem', undefined, ['Section 6', 'Section 7'])
      addScore(map, 'processor-governance', 2, 'Platforms must govern data processing across participants', undefined, ['Section 8(2)'])
      break
    case 'gcc':
      addScore(map, 'data-sovereignty', 3, 'Global captive centers need data localization solutions', undefined, ['Section 16', 'Section 17'])
      break
  }
}

function applyJourneySignals(map: ScoreMap, stage: string) {
  switch (stage) {
    case 'just-starting':
      addScore(map, 'advisory', 3, 'You\'re beginning your compliance journey and need foundational guidance')
      addScore(map, 'infra-scanner', 2, 'A baseline scan helps identify where you stand')
      break
    case 'have-policies':
      addScore(map, 'gap-assessment', 2, 'Existing policies need to be validated against DPDP requirements')
      break
    case 'know-gaps':
      addScore(map, 'technical-implementation', 3, 'You\'ve identified gaps and need implementation support')
      addScore(map, 'consent-platform', 2, 'Known gaps typically include consent management')
      break
    case 'need-validation':
      addScore(map, 'assurance', 3, 'You need independent validation of your compliance posture')
      break
    case 'ongoing-support':
      addScore(map, 'managed-operations', 3, 'Ongoing compliance requires continuous managed support')
      break
  }
}

function applyDataTypeSignals(map: ScoreMap, dataTypes: string[]) {
  for (const dt of dataTypes) {
    switch (dt) {
      case 'children':
        addScore(map, 'consent-platform', 3, 'Children\'s data requires verifiable parental consent', 'Section 9 (Children\'s Data) compliance gap', ['Section 9'])
        break
      case 'financial':
        addScore(map, 'assurance', 2, 'Financial data handling needs SDF-grade assurance', 'Financial data protection gap', ['Section 8(5)'])
        break
      case 'health':
        addScore(map, 'cyber-privacy', 2, 'Health data requires enhanced security controls', 'Health data security gap', ['Section 8(5)'])
        break
      case 'ai-data':
        addScore(map, 'ai-governance', 3, 'AI training data needs governance frameworks', 'AI data governance gap', ['Section 4', 'Section 8'])
        addScore(map, 'adaptive-engine', 2, 'AI data processing needs adaptive compliance controls')
        break
      case 'behavioral':
        addScore(map, 'consent-platform', 2, 'Behavioral profiling requires explicit consent', 'Consent for profiling gap', ['Section 6', 'Section 7'])
        break
      case 'employee':
        addScore(map, 'dsar-platform', 2, 'Employee data generates DSAR obligations', undefined, ['Section 11'])
        break
      case 'third-party':
        addScore(map, 'processor-governance', 2, 'Third-party data requires processor agreements', undefined, ['Section 8(2)'])
        break
    }
  }
}

function applyPrioritySignals(map: ScoreMap, priorities: string[]) {
  for (const p of priorities) {
    switch (p) {
      case 'understand-applicability':
        addScore(map, 'advisory', 3, 'Understanding DPDP applicability is your stated priority')
        addScore(map, 'trustscope', 2, 'Quick applicability assessment tool')
        break
      case 'fix-consent':
        addScore(map, 'consent-platform', 3, 'Fixing consent flows is your stated priority', 'Consent management gap', ['Section 6', 'Section 7'])
        break
      case 'setup-rights':
        addScore(map, 'dsar-platform', 3, 'Setting up rights workflows is your stated priority', 'DSAR/grievance gap', ['Section 11', 'Section 12', 'Section 13'])
        break
      case 'vendor-risk':
        addScore(map, 'processor-governance', 3, 'Managing vendor privacy risk is your stated priority', 'Processor governance gap', ['Section 8(2)'])
        break
      case 'data-sovereignty':
        addScore(map, 'data-sovereignty', 3, 'Data sovereignty is your stated priority', 'Cross-border transfer gap', ['Section 16', 'Section 17'])
        break
      case 'ai-governance':
        addScore(map, 'ai-governance', 3, 'AI/GenAI governance is your stated priority', 'AI governance gap', ['Section 4'])
        addScore(map, 'adaptive-engine', 2, 'AI governance requires adaptive compliance')
        break
      case 'audit-prep':
        addScore(map, 'assurance', 3, 'Audit preparation is your stated priority', 'Audit readiness gap', ['Section 10'])
        break
      case 'breach-readiness':
        addScore(map, 'cyber-privacy', 3, 'Breach readiness is your stated priority', 'Breach notification gap', ['Section 8(6)'])
        break
      case 'workflow-automation':
        addScore(map, 'consent-platform', 2, 'Workflow automation for consent management')
        addScore(map, 'dsar-platform', 2, 'Workflow automation for rights management')
        break
      case 'dpo-support':
        addScore(map, 'managed-operations', 3, 'DPO support is your stated priority')
        addScore(map, 'advisory', 2, 'Virtual DPO services provide ongoing guidance')
        break
    }
  }
}

function applySupportTypeSignals(map: ScoreMap, supportTypes: string[]) {
  for (const st of supportTypes) {
    switch (st) {
      case 'quick-assessment':
        addScore(map, 'infra-scanner', 2, 'You want a quick readiness assessment')
        addScore(map, 'trustscope', 2, 'Quick compliance scoring tool')
        break
      case 'legal-advisory':
        addScore(map, 'advisory', 2, 'You need legal advisory support')
        break
      case 'technical':
        addScore(map, 'technical-implementation', 2, 'You need technical implementation support')
        break
      case 'audit':
        addScore(map, 'assurance', 2, 'You need audit support')
        break
      case 'managed':
        addScore(map, 'managed-operations', 2, 'You need managed operations')
        break
      case 'training':
        addScore(map, 'advisory', 1, 'Training component included')
        break
    }
  }
}

function applyScanSignals(map: ScoreMap, scanResult: ScanResult) {
  for (const flag of scanResult.complianceFlags) {
    if (flag.passed) continue

    switch (flag.id) {
      case 'NO_CONSENT_BANNER':
        addScore(map, 'consent-platform', 5, 'Your website lacks a consent banner', 'Missing consent banner', ['Section 6'])
        break
      case 'PRE_CONSENT_TRACKING':
        addScore(map, 'consent-platform', 4, 'Non-essential cookies set before consent', 'Pre-consent tracker loading', ['Section 6', 'Section 7'])
        break
      case 'MISSING_REJECT_OPTION':
        addScore(map, 'consent-platform', 3, 'No reject option in consent banner', 'Missing reject option', ['Section 6'])
        break
      case 'COOKIES_AFTER_REJECT':
        addScore(map, 'consent-platform', 4, 'Cookies still set after user rejected consent', 'Consent not honoured', ['Section 6'])
        addScore(map, 'technical-implementation', 2, 'Technical enforcement of consent decisions needed')
        break
      case 'NO_PRIVACY_POLICY':
        addScore(map, 'advisory', 4, 'Your website lacks a privacy policy', 'Missing privacy policy', ['Section 5', 'Section 7'])
        break
      case 'NO_COOKIE_POLICY':
        addScore(map, 'consent-platform', 3, 'No cookie policy found', 'Missing cookie policy', ['Section 5'])
        break
      case 'NO_DSAR_MECHANISM':
        addScore(map, 'dsar-platform', 5, 'No data subject request mechanism found', 'Missing DSAR mechanism', ['Section 11', 'Section 12', 'Section 13'])
        break
      case 'FINGERPRINTING_DETECTED':
        addScore(map, 'cyber-privacy', 4, 'Browser fingerprinting detected', 'Fingerprinting without consent', ['Section 6'])
        break
      case 'HIGH_RISK_SCRIPTS':
        addScore(map, 'consent-platform', 3, 'High-risk data-collection scripts detected', 'Undisclosed high-risk scripts', ['Section 6', 'Section 7'])
        addScore(map, 'cyber-privacy', 2, 'High-risk script management needs security oversight')
        break
      case 'CROSS_BORDER_TRANSFER':
        addScore(map, 'data-sovereignty', 3, 'Cross-border data transfers detected', 'Cross-border transfer governance', ['Section 16'])
        break
      case 'NO_GRIEVANCE_REDRESSAL':
        addScore(map, 'advisory', 3, 'No grievance redressal mechanism found', 'Missing grievance mechanism', ['Section 13'])
        addScore(map, 'dsar-platform', 2, 'Grievance officer setup required')
        break
      case 'NO_DATA_RETENTION_MENTION':
        addScore(map, 'advisory', 2, 'Data retention period not disclosed', 'Retention disclosure gap', ['Section 8(7)'])
        break
      case 'MISSING_DPO_CONTACT':
        addScore(map, 'managed-operations', 2, 'No privacy/DPO contact found', 'Missing DPO contact', ['Section 10'])
        break
      case 'NO_GRANULAR_CONSENT':
        addScore(map, 'consent-platform', 3, 'No granular consent choices available', 'Granular consent gap', ['Section 6(2)'])
        break
    }
  }

  const score = scanResult.overallScore
  if (score <= 39) {
    addScore(map, 'managed-operations', 3, 'Critical compliance score suggests full-service support is needed', 'Critical overall compliance posture')
    addScore(map, 'advisory', 2, 'Foundational compliance guidance urgently needed')
  } else if (score <= 59) {
    addScore(map, 'technical-implementation', 2, 'Moderate score indicates targeted technical fixes are needed')
  } else if (score <= 74) {
    addScore(map, 'gap-assessment', 1, 'Specific compliance gaps need targeted remediation')
  } else if (score <= 89) {
    addScore(map, 'infra-scanner', 1, 'Good score but continuous monitoring recommended')
  }
}

const PRODUCT_METADATA: Record<string, { title: string; type: 'product' | 'service' }> = {
  'consent-platform': { title: 'Consent Management Platform', type: 'product' },
  'consent-sdk': { title: 'Consent Platform SDK', type: 'product' },
  'dsar-platform': { title: 'DSAR Automation Platform', type: 'product' },
  'infra-scanner': { title: 'Privacy Infrastructure Scanner', type: 'product' },
  'trustscope': { title: 'TrustScope Compliance Suite', type: 'product' },
  'ai-governance': { title: 'AI Governance Framework', type: 'product' },
  'adaptive-engine': { title: 'Adaptive Compliance Engine', type: 'product' },
  'ai-assistant': { title: 'AI Compliance Assistant', type: 'product' },
  'cyber-privacy': { title: 'Cyber Privacy Shield', type: 'product' },
  'data-sovereignty': { title: 'Data Sovereignty Manager', type: 'product' },
  'processor-governance': { title: 'Processor Governance Platform', type: 'product' },
  'advisory': { title: 'DPDP Advisory Services', type: 'service' },
  'assurance': { title: 'Compliance Assurance & Audit', type: 'service' },
  'technical-implementation': { title: 'Technical Implementation Services', type: 'service' },
  'managed-operations': { title: 'Managed Compliance Operations', type: 'service' },
  'gap-assessment': { title: 'DPDP Gap Assessment', type: 'service' },
}

function generatePackages(topRecs: Recommendation[]): Recommendation[] {
  const packages: Recommendation[] = []
  const products = topRecs.filter((r) => r.type === 'product').slice(0, 3)
  const services = topRecs.filter((r) => r.type === 'service').slice(0, 2)

  if (products.length >= 2 && services.length >= 1) {
    packages.push({
      type: 'package',
      id: 'compliance-starter',
      title: 'Compliance Starter Package',
      reason: `Combines ${products[0].title} + ${products[1].title} with ${services[0].title} for a comprehensive compliance foundation.`,
      relevanceScore: Math.round((products[0].relevanceScore + products[1].relevanceScore + services[0].relevanceScore) / 3),
      gapsAddressed: Array.from(new Set([...products[0].gapsAddressed, ...products[1].gapsAddressed, ...services[0].gapsAddressed])),
      dpdpSections: Array.from(new Set([...products[0].dpdpSections, ...products[1].dpdpSections, ...services[0].dpdpSections])),
    })
  }

  if (products.length >= 3 && services.length >= 2) {
    packages.push({
      type: 'package',
      id: 'compliance-accelerator',
      title: 'Compliance Accelerator Package',
      reason: `Full-stack compliance with ${products.map((p) => p.title).join(', ')} backed by ${services.map((s) => s.title).join(' and ')}.`,
      relevanceScore: Math.round(topRecs.slice(0, 5).reduce((sum, r) => sum + r.relevanceScore, 0) / 5),
      gapsAddressed: Array.from(new Set(topRecs.slice(0, 5).flatMap((r) => r.gapsAddressed))),
      dpdpSections: Array.from(new Set(topRecs.slice(0, 5).flatMap((r) => r.dpdpSections))),
    })
  }

  if (topRecs.length >= 2) {
    const topTwo = topRecs.slice(0, 2)
    packages.push({
      type: 'package',
      id: 'priority-fix',
      title: 'Priority Fix Package',
      reason: `Addresses your most critical gaps with ${topTwo.map((r) => r.title).join(' and ')}.`,
      relevanceScore: Math.round((topTwo[0].relevanceScore + topTwo[1].relevanceScore) / 2),
      gapsAddressed: Array.from(new Set(topTwo.flatMap((r) => r.gapsAddressed))),
      dpdpSections: Array.from(new Set(topTwo.flatMap((r) => r.dpdpSections))),
    })
  }

  return packages.slice(0, 3)
}

export function generateRecommendations(
  responses: QuestionnaireResponses,
  scanResult?: ScanResult
): Recommendation[] {
  const scoreMap: ScoreMap = {}

  applyRoleSignals(scoreMap, responses.role)
  applyOrgTypeSignals(scoreMap, responses.orgType)
  applyJourneySignals(scoreMap, responses.journeyStage)
  applyDataTypeSignals(scoreMap, responses.dataTypes)
  applyPrioritySignals(scoreMap, responses.priorities)
  applySupportTypeSignals(scoreMap, responses.supportType)

  if (scanResult) {
    applyScanSignals(scoreMap, scanResult)
  }

  const recommendations: Recommendation[] = Object.entries(scoreMap)
    .filter(([id]) => PRODUCT_METADATA[id])
    .map(([id, entry]) => ({
      type: PRODUCT_METADATA[id].type,
      id,
      title: PRODUCT_METADATA[id].title,
      reason: entry.reasons.slice(0, 3).join('. ') + '.',
      relevanceScore: entry.score,
      gapsAddressed: Array.from(new Set(entry.gaps)),
      dpdpSections: Array.from(new Set(entry.sections)),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)

  const topRecs = recommendations.slice(0, 8)
  const packages = generatePackages(topRecs)

  return [...topRecs, ...packages]
}
