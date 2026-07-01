/** Admin CMP / platform UI — dark theme. Run `npm run capture:agigx-ui`. */
export const AGIGX_UI_SCREENSHOT_DIR = '/images/products/agigx-ui'

/** Admin CMP / platform UI — light theme (paired captures). */
export const AGIGX_UI_LIGHT_SCREENSHOT_DIR = '/images/products/agigx-ui-light'

/** Privacy Assistant widget screenshots (light UI — use chatShot for theme-aware display). */
export const CONSENT_COCKPIT_CHAT_DIR = '/images/products/consent-cockpit-chat'

export type ProductHighlight = {
  dark: string
  light: string
  label: string
}

export type ThemedScreenshot = {
  dark: string
  light: string
  caption: string
}

export type ThemedFeatureCard = ThemedScreenshot & {
  title: string
  /** Shared image fit/focus for both themes (optional). */
  imageClassName?: string
  darkImageClassName?: string
  lightImageClassName?: string
  /** When true, chat widget screenshots use a white canvas in either site theme. */
  chatSurface?: boolean
}

export type ProductScreenshotSet = ThemedScreenshot & {
  highlights?: readonly ProductHighlight[]
}

export type ThemedSnapshotCard = ThemedScreenshot & {
  title: string
}

/** Same admin screen captured in dark and light agigx-ui themes. */
export function adminShot(file: string): Pick<ThemedScreenshot, 'dark' | 'light'> {
  return {
    dark: `${AGIGX_UI_SCREENSHOT_DIR}/${file}`,
    light: `${AGIGX_UI_LIGHT_SCREENSHOT_DIR}/${file}`,
  }
}

function adminHighlight(file: string, label: string): ProductHighlight {
  return { ...adminShot(file), label }
}

/** Privacy Assistant chat widget — same light UI in both site themes. */
export function chatShot(file: string): Pick<ThemedScreenshot, 'dark' | 'light'> {
  const src = `${CONSENT_COCKPIT_CHAT_DIR}/${file}`
  return { dark: src, light: src }
}


export const productScreenshots = {
  'consent-platform': {
    ...adminShot('cmp-consent-banner.png'),
    caption:
      'Design and preview consent banners, manage cookie categories, and publish preference centers aligned with DPDP consent requirements.',
    highlights: [
      adminHighlight('cmp-consent-banner.png', 'Banner designer'),
      adminHighlight('cmp-manage-cookies.png', 'Cookie inventory'),
      adminHighlight('cmp-cookie-policy.png', 'Policy builder'),
      adminHighlight('cmp-consent-logs.png', 'Consent audit trail'),
    ],
  },
  trustscope: {
    ...adminShot('cmp-domains.png'),
    caption:
      'Register domains, run Playwright-powered compliance scans, and review health scores with category-level findings.',
    highlights: [
      adminHighlight('cmp-domains.png', 'Domain scan'),
      adminHighlight('cmp-dashboard.png', 'Health overview'),
      adminHighlight('cmp-compliance-health.png', 'Gap analysis'),
      adminHighlight('cmp-analytics.png', 'Consent analytics'),
    ],
  },
  'dsar-platform': {
    ...adminShot('cmp-dsar-requests.png'),
    caption:
      'Track DSAR and grievance volume, SLA compliance, and resolution trends with configurable intake workflows.',
    highlights: [
      adminHighlight('cmp-dsar-requests.png', 'Request analytics'),
      adminHighlight('cmp-dsar-workflows.png', 'Workflow builder'),
      adminHighlight('cmp-consent-logs.png', 'Audit trail'),
      adminHighlight('cmp-analytics.png', 'Trend monitoring'),
    ],
  },
  'processor-governance': {
    ...adminShot('cmp-processors.png'),
    caption:
      'Register third-party processors, configure webhook propagation, and monitor downstream delivery health for Section 8(2) oversight.',
    highlights: [
      adminHighlight('cmp-processors.png', 'Processor registry'),
      adminHighlight('cmp-dashboard.png', 'Vendor risk overview'),
      adminHighlight('cmp-domains.png', 'Third-party discovery'),
      adminHighlight('cmp-dsar-workflows.png', 'Downstream tasks'),
    ],
  },
  'infra-scanner': {
    ...adminShot('cmp-infra-scanner.png'),
    caption:
      'Cloud infrastructure and source-code scanning with severity-ranked findings, pass rates, and unified security posture.',
    highlights: [
      adminHighlight('cmp-infra-scanner.png', 'Scanner settings'),
      adminHighlight('cmp-security-posture.png', 'Security posture'),
      adminHighlight('cmp-compliance-health.png', 'Compliance gaps'),
    ],
  },
  'ai-assistant': {
    ...adminShot('cmp-ai-setup.png'),
    caption:
      'AI setup guide for banners, policies, and DSAR configuration — plus a multilingual Privacy Assistant for data principals.',
    highlights: [
      adminHighlight('cmp-ai-setup.png', 'AI setup guide'),
      adminHighlight('cmp-consent-banner.png', 'Banner preview'),
      adminHighlight('cmp-cookie-policy.png', 'Policy drafting'),
    ],
  },
  'adaptive-engine': {
    ...adminShot('cmp-compliance-health.png'),
    caption:
      'DPDP regulatory coverage with gap analysis, continuous scoring, and automated remediation signals across your estate.',
    highlights: [
      adminHighlight('cmp-compliance-health.png', 'Regulatory coverage'),
      adminHighlight('cmp-dashboard.png', 'Org dashboard'),
      adminHighlight('cmp-consent-logs.png', 'Audit trail'),
      adminHighlight('cmp-analytics.png', 'Compliance trends'),
    ],
  },
} as const satisfies Record<string, ProductScreenshotSet>

export type ProductScreenshotKey = keyof typeof productScreenshots

/** Best-of Consent Cockpit features — theme-matched admin console screens. */
export const consentCockpitBestFeatures = [
  {
    ...adminShot('cmp-dashboard.png'),
    title: 'Organization dashboard',
    caption: 'Privacy score, DPDP readiness, and domain health at a glance.',
  },
  {
    ...chatShot('cockpit-chat-welcome.png'),
    title: 'Privacy Assistant',
    caption: 'Multilingual chat for rights, grievances, and consent preferences.',
    darkImageClassName: 'object-cover object-top',
    lightImageClassName: 'object-cover object-top',
    chatSurface: true,
  },
  {
    ...adminShot('cmp-ai-setup.png'),
    title: 'AI configuration',
    caption: 'Guided setup for banners, policies, and DSAR workflows.',
  },
  {
    ...adminShot('cmp-domains.png'),
    title: 'Domain compliance scan',
    caption: 'Register properties and run instant compliance checks.',
  },
  {
    ...chatShot('cockpit-chat-vs-dashboard.png'),
    title: 'Chat & dashboard modes',
    caption: 'Self-service chat or advanced dashboard for data principals.',
    darkImageClassName: 'object-contain object-center p-2',
    lightImageClassName: 'object-contain object-center p-2',
    chatSurface: true,
  },
  {
    ...adminShot('cmp-dsar-requests.png'),
    title: 'Rights analytics',
    caption: 'DSAR and grievance trends with SLA monitoring.',
  },
] as const satisfies readonly ThemedFeatureCard[]

export const servicesPlatformStrip = [
  {
    ...adminShot('cmp-domains.png'),
    title: 'Domains & scanning',
    caption: 'Register domains, run compliance scans, and monitor domain health scores.',
  },
  {
    ...adminShot('cmp-analytics.png'),
    title: 'Analytics & signals',
    caption: 'Monitor consent health, cookie categories, and request volume trends.',
  },
  {
    ...adminShot('cmp-dsar-requests.png'),
    title: 'Rights & grievance',
    caption: 'Track DSAR volume, SLA compliance, and grievance resolution workflows.',
  },
] as const satisfies readonly ThemedSnapshotCard[]

export const platformSnapshots = [
  {
    ...adminShot('cmp-dashboard.png'),
    title: 'Organization dashboard',
    caption: 'Privacy score, readiness metrics, and domain health in one view.',
  },
  {
    ...adminShot('cmp-analytics.png'),
    title: 'Consent analytics',
    caption: 'Trend views for cookie consent, categories, and compliance signals.',
  },
  {
    ...adminShot('cmp-compliance-health.png'),
    title: 'Regulatory coverage',
    caption: 'DPDP gap analysis with checklist items and remediation priorities.',
  },
  {
    ...adminShot('cmp-consent-banner.png'),
    title: 'Consent banner studio',
    caption: 'Design, preview, and publish geo-aware consent experiences.',
  },
] as const satisfies readonly ThemedSnapshotCard[]

export const productPreviewThumbs = [
  {
    ...adminShot('cmp-consent-banner.png'),
    alt: 'Consent banner designer and cookie preference management',
  },
  {
    ...adminShot('cmp-domains.png'),
    alt: 'Domain compliance scanning and health monitoring',
  },
  {
    ...adminShot('cmp-dsar-requests.png'),
    alt: 'DSAR analytics and rights request workflows',
  },
] as const

/** Privacy Assistant gallery — chat flows in both site themes (white canvas on dark). */
export const privacyAssistantGallery = [
  {
    ...chatShot('cockpit-chat-welcome.png'),
    title: 'Multilingual welcome',
    caption:
      'Language selection in English, Hindi, Tamil, Telugu, Bengali, and more before any action.',
    darkImageClassName: 'object-cover object-[center_24%]',
    lightImageClassName: 'object-cover object-[center_24%]',
    chatSurface: true,
  },
  {
    ...chatShot('cockpit-chat-welcome.png'),
    title: 'Quick actions menu',
    caption:
      'Privacy rights, data requests, grievances, and request status — surfaced as one-tap options.',
    darkImageClassName: 'object-cover object-[center_78%]',
    lightImageClassName: 'object-cover object-[center_78%]',
    chatSurface: true,
  },
  {
    ...chatShot('cockpit-chat-vs-dashboard.png'),
    title: 'Chat vs Dashboard',
    caption:
      'Switch between conversational chat and an advanced tabbed dashboard for power users.',
    darkImageClassName: 'object-contain object-center p-2',
    lightImageClassName: 'object-contain object-center p-2',
    chatSurface: true,
  },
  {
    ...chatShot('cockpit-chat-consent.png'),
    title: 'Consent preferences',
    caption:
      'Review cookie categories and data-processing purposes, then withdraw or update permissions in chat.',
    darkImageClassName: 'object-cover object-top',
    lightImageClassName: 'object-cover object-top',
    chatSurface: true,
  },
  {
    ...chatShot('cockpit-chat-dsar-flow.png'),
    title: 'DSAR data request',
    caption:
      'Guided intake for download, delete, correct, or marketing opt-out — with name and email collection.',
    darkImageClassName: 'object-cover object-top',
    lightImageClassName: 'object-cover object-top',
    chatSurface: true,
  },
  {
    ...chatShot('cockpit-chat-success.png'),
    title: 'Request confirmation',
    caption:
      'Reference number, email confirmation, and DPDP 30-day response timeline after submission.',
    darkImageClassName: 'object-cover object-top',
    lightImageClassName: 'object-cover object-top',
    chatSurface: true,
  },
  {
    ...chatShot('cockpit-chat-grievance.png'),
    title: 'Grievance filing',
    caption:
      'Structured Section 13 complaint flow with concern categories, free-text details, and submit summary.',
    darkImageClassName: 'object-cover object-top',
    lightImageClassName: 'object-cover object-top',
    chatSurface: true,
  },
] as const satisfies readonly ThemedFeatureCard[]
