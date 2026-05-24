/** Captured from DPDP Consultancy / CMP UI (run `node scripts/capture-agigx-ui-screenshots.cjs` with dev server). */
export const AGIGX_UI_SCREENSHOT_DIR = '/images/products/agigx-ui'

export const productScreenshots = {
  'consent-platform': {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-consent-banner.png`,
    caption: 'Consent banner designer, banner preview, and manage-cookies flow in DPDP Consultancy.',
  },
  trustscope: {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dashboard.png`,
    caption:
      'Consent Management home: compliance health score, domain scan overview, and quick actions aligned with TrustScope-style scanning.',
  },
  'dsar-platform': {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dsar-requests.png`,
    caption:
      'DSAR and grievance analytics: daily request trends, SLA compliance, unique users, and resolution metrics in DPDP Consultancy.',
  },
  'infra-scanner': {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-analytics.png`,
    caption: 'Telemetry-style analytics and consent signal monitoring (representative platform view).',
  },
  'ai-assistant': {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dashboard.png`,
    caption: 'Operational dashboard and health signals used alongside AI compliance guidance.',
  },
  'adaptive-engine': {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-consent-logs.png`,
    caption: 'Immutable consent logs and audit trail views for continuous compliance evidence.',
  },
} as const

export type ProductScreenshotKey = keyof typeof productScreenshots

export const servicesPlatformStrip = [
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-domains.png`,
    title: 'Domains & scanning',
    caption: 'Register domains, trigger scans, and track domain-level posture.',
  },
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-analytics.png`,
    title: 'Analytics & monitoring',
    caption: 'Signals, trends, and consent analytics for operating compliance.',
  },
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dsar-requests.png`,
    title: 'Rights & DSAR',
    caption: 'Submission trends, SLA compliance, and grievance vs DSAR volume at a glance.',
  },
] as const

export const platformSnapshots = [
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dashboard.png`,
    title: 'Consent Management hub',
    caption: 'Health score and scan overview.',
  },
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-analytics.png`,
    title: 'Consent analytics',
    caption: 'Trend views and telemetry for your properties.',
  },
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-compliance-health.png`,
    title: 'Compliance health',
    caption: 'Category scores and remediation focus.',
  },
  {
    src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-cookie-policy.png`,
    title: 'Policy & disclosures',
    caption: 'Cookie & policy lifecycle tooling.',
  },
] as const

export const productPreviewThumbs = [
  { src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-consent-banner.png`, alt: 'DPDP Consultancy consent banner configuration' },
  { src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dashboard.png`, alt: 'DPDP Consultancy consent management dashboard' },
  { src: `${AGIGX_UI_SCREENSHOT_DIR}/cmp-dsar-requests.png`, alt: 'DPDP Consultancy DSAR and grievance analytics dashboard' },
] as const
