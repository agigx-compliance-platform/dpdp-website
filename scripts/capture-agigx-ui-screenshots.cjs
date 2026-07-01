/**
 * Captures PNG screenshots from running agigx-ui (default http://127.0.0.1:3000).
 *
 * Marketing-safe captures (Redacto-style):
 *  - Authenticated login
 *  - Dismiss onboarding / domain dialogs
 *  - Hide user email, profile chrome, AI FAB
 *  - Clip to main product canvas (not full viewport chrome)
 *  - Mask obvious PII patterns in visible text
 *
 * Usage (from dpdp-website):
 *   AGIGX_UI_LOGIN_EMAIL=u@x.com AGIGX_UI_LOGIN_PASSWORD=*** npm run capture:agigx-ui
 */

const fs = require('fs')
const path = require('path')

const DPI = `${__dirname}/..`
const OUT_DARK = path.join(DPI, 'public/images/products/agigx-ui')
const OUT_LIGHT = path.join(DPI, 'public/images/products/agigx-ui-light')

function loadEnvFile(filePath, overwriteExisting) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const s = line.trim()
    if (!s || s.startsWith('#')) continue
    const eq = s.indexOf('=')
    if (eq <= 0) continue
    const key = s.slice(0, eq).trim()
    let val = s.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (key && (overwriteExisting || process.env[key] === undefined)) process.env[key] = val
  }
}

loadEnvFile(path.join(DPI, '.env.local'), false)
loadEnvFile(path.join(DPI, '.env.capture.local'), true)

let chromium
try {
  ;({ chromium } = require('playwright-core'))
} catch (_) {
  const alt = path.join(__dirname, '..', '..', 'agigx-ui', 'node_modules', 'playwright-core')
  ;({ chromium } = require(alt))
}

const BASE = process.env.AGIGX_UI_URL || 'http://127.0.0.1:3000'

/** @type {{ route: string, file: string, fullPage?: boolean, prep?: (page: import('playwright-core').Page) => Promise<void> }[]} */
const SHOTS = [
  { route: '/consent-management', file: 'cmp-dashboard.png' },
  { route: '/consent-management/consent-banner', file: 'cmp-consent-banner.png' },
  { route: '/consent-management/domains', file: 'cmp-domains.png' },
  {
    route: '/consent-management/analytics',
    file: 'cmp-analytics.png',
    prep: async (page) => {
      const tab = page.getByRole('button', { name: 'Cookie Consent' })
      await tab.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {})
      await tab.click()
      await page.getByText('Consent Health', { exact: false }).waitFor({ state: 'visible', timeout: 25000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 800))
    },
  },
  {
    route: '/consent-management',
    file: 'cmp-compliance-health.png',
    prep: async (page) => {
      const heading = page.locator('h3').filter({ hasText: 'Regulatory Coverage' })
      await heading.waitFor({ state: 'visible', timeout: 25000 }).catch(() => {})
      await heading.scrollIntoViewIfNeeded()
      await new Promise((r) => setTimeout(r, 600))
    },
    clipToHeading: 'Regulatory Coverage',
  },
  {
    route: '/consent-management/consent-banner',
    file: 'cmp-ai-setup.png',
    prep: async (page) => {
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('agigx-open-ai-setup'))
      })
      await page
        .getByText('Setup Guide', { exact: false })
        .waitFor({ state: 'visible', timeout: 20000 })
        .catch(() => {})
      await new Promise((r) => setTimeout(r, 1200))
    },
  },
  {
    route: '/consent-management/consent-banner',
    file: 'cmp-manage-cookies.png',
    prep: async (page) => {
      const tab = page.getByRole('button', { name: 'Manage Cookies' })
      await tab.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {})
      await tab.click()
      await page.getByText('Cookie inventory', { exact: false }).waitFor({ state: 'visible', timeout: 20000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 900))
    },
  },
  { route: '/consent-management/dsar/workflows', file: 'cmp-dsar-workflows.png' },
  {
    route: '/consent-management/third-party-processors',
    file: 'cmp-processors.png',
    marketingMock: 'processors',
    clipToTableHeader: 'Processor key',
  },
  {
    route: '/consent-management/monitoring',
    file: 'cmp-processor-monitoring.png',
    prep: async (page) => {
      await page.evaluate(() => {
        window.location.hash = 'deliveries'
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      })
      await page
        .getByRole('button', { name: 'Webhook Deliveries', exact: true })
        .waitFor({ state: 'visible', timeout: 20000 })
        .catch(() => {})
      await new Promise((r) => setTimeout(r, 1200))
    },
  },
  { route: '/dashboard/scanner-results', file: 'cmp-infra-scanner.png' },
  { route: '/dashboard/security-posture', file: 'cmp-security-posture.png' },
  { route: '/consent-management/consent-logs', file: 'cmp-consent-logs.png' },
  { route: '/consent-management/cookie-policy', file: 'cmp-cookie-policy.png' },
  {
    route: '/consent-management/analytics',
    file: 'cmp-dsar-requests.png',
    prep: async (page) => {
      const tab = page.getByRole('button', { name: 'DSAR & Grievance' })
      await tab.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {})
      await tab.click()
      await page.getByText('Request Trend', { exact: false }).waitFor({ state: 'visible', timeout: 25000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 1200))
    },
  },
]

const SANITIZE_STYLE = `
  /* Marketing capture — hide account / support chrome */
  [data-marketing-hide="true"],
  button[aria-label="Open AI Setup Guide"],
  button[aria-label="Open AI setup"],
  button[aria-label="Open command palette"],
  [class*="AISetupFAB"],
  [class*="SetupCelebration"] {
    visibility: hidden !important;
    pointer-events: none !important;
  }
`

const MARKETING_PROCESSORS = [
  {
    id: 'mp-1',
    domainId: 'marketing-domain',
    processorKey: 'stripe-payments',
    name: 'Stripe Payments',
    contactEmail: 'privacy@stripe.com',
    webhookUrl: 'https://api.yourcompany.com/webhooks/stripe',
    processorCategory: 'PAYMENT',
    status: 'ACTIVE',
    canArchive: true,
    createdAt: new Date(Date.now() - 86400000 * 42).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mp-2',
    domainId: 'marketing-domain',
    processorKey: 'google-analytics',
    name: 'Google Analytics',
    contactEmail: 'privacy@google.com',
    webhookUrl: 'https://api.yourcompany.com/webhooks/analytics',
    processorCategory: 'ANALYTICS',
    status: 'ACTIVE',
    canArchive: true,
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'mp-3',
    domainId: 'marketing-domain',
    processorKey: 'aws-data-store',
    name: 'AWS Data Store',
    contactEmail: 'privacy@aws.amazon.com',
    webhookUrl: 'https://api.yourcompany.com/webhooks/aws',
    processorCategory: 'STORAGE',
    status: 'IN_REVIEW',
    canArchive: true,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'mp-4',
    domainId: 'marketing-domain',
    processorKey: 'sendgrid-email',
    name: 'SendGrid Email',
    contactEmail: 'privacy@sendgrid.com',
    webhookUrl: 'https://api.yourcompany.com/webhooks/email',
    processorCategory: 'COMMUNICATION',
    status: 'ACTIVE',
    canArchive: true,
    createdAt: new Date(Date.now() - 86400000 * 65).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: 'mp-5',
    domainId: 'marketing-domain',
    processorKey: 'mixpanel-product',
    name: 'Mixpanel Product Analytics',
    contactEmail: 'privacy@mixpanel.com',
    webhookUrl: 'https://api.yourcompany.com/webhooks/mixpanel',
    processorCategory: 'ANALYTICS',
    status: 'DRAFT',
    canArchive: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
]

/**
 * @param {import('playwright-core').Page} page
 */
async function installMarketingProcessorMock(page) {
  await page.route(/admin\/processors(\?|$)/, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: MARKETING_PROCESSORS }),
    })
  })
}

/**
 * @param {import('playwright-core').Page} page
 */
async function injectMarketingProcessorTable(page) {
  await page.evaluate((processors) => {
    const countEl = [...document.querySelectorAll('p')].find((p) =>
      /\d+\s+processors?/i.test(p.textContent || '')
    )
    if (countEl) countEl.textContent = `${processors.length} processors`

    const card = [...document.querySelectorAll('.glass-card')].find((el) =>
      el.textContent?.includes('Processor key') || el.querySelector('table') || el.textContent?.includes('No processors yet')
    )
    if (!card) return

    const statusClass = (st) => {
      if (st === 'ACTIVE') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      if (st === 'IN_REVIEW') return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      if (st === 'DRAFT') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      return 'bg-muted text-muted-foreground border-border'
    }

    const rows = processors
      .map((p) => {
        const st = String(p.status || 'ACTIVE')
        return `<tr>
          <td class="px-4 py-2.5 font-mono text-[12px]">${p.processorKey}</td>
          <td class="px-4 py-2.5">${p.name}</td>
          <td class="px-4 py-2.5 text-muted-foreground text-[12px]">${p.contactEmail || '—'}</td>
          <td class="px-4 py-2.5 max-w-[240px] truncate">${p.webhookUrl || 'Not configured'}</td>
          <td class="px-4 py-2.5"><span class="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${statusClass(st)}">${st}</span></td>
          <td class="px-4 py-2.5 text-[12px] text-muted-foreground whitespace-nowrap">30 days ago</td>
          <td class="px-4 py-2.5 text-right text-[11px] text-primary">Edit · Tasks</td>
        </tr>`
      })
      .join('')

    card.innerHTML = `<div class="overflow-x-auto"><table class="w-full text-left text-[13px]">
      <thead><tr class="bg-muted/40 border-b border-border text-[10px] uppercase text-muted-foreground">
        <th class="px-4 py-3 font-bold">Processor key</th>
        <th class="px-4 py-3 font-bold">Name</th>
        <th class="px-4 py-3 font-bold">Contact</th>
        <th class="px-4 py-3 font-bold">Webhook</th>
        <th class="px-4 py-3 font-bold">Status</th>
        <th class="px-4 py-3 font-bold">Created</th>
        <th class="px-4 py-3 font-bold text-right">Actions</th>
      </tr></thead>
      <tbody class="divide-y divide-border/60">${rows}</tbody>
    </table></div>`
  }, MARKETING_PROCESSORS).catch(() => {})
}

/**
 * @param {import('playwright-core').Page} page
 */
async function hideProcessorPageChrome(page) {
  await page.evaluate(() => {
    document.querySelectorAll('h1, h2, p').forEach((el) => {
      const t = (el.textContent || '').trim()
      if (/^Third-party processors$/i.test(t)) {
        el.closest('div')?.setAttribute('data-marketing-hide', 'true')
      }
      if (/^Getting Started$/i.test(t)) {
        el.closest('section, div')?.setAttribute('data-marketing-hide', 'true')
      }
    })
    document.querySelectorAll('a, button, div').forEach((el) => {
      const t = (el.textContent || '').trim()
      if (/Webhook deliveries, issues, and DPO alerts/i.test(t)) {
        el.setAttribute('data-marketing-hide', 'true')
      }
    })
  }).catch(() => {})
}

/**
 * @param {import('playwright-core').Page} page
 */
async function dismissOverlays(page) {
  const skip = page.getByRole('button', { name: /skip for now/i })
  if (await skip.isVisible({ timeout: 1500 }).catch(() => false)) {
    await skip.click()
    await new Promise((r) => setTimeout(r, 600))
  }

  const closeDialog = page.locator('button').filter({ has: page.locator('svg') }).first()
  const welcome = page.getByText('Welcome to Consent Management')
  if (await welcome.isVisible({ timeout: 800 }).catch(() => false)) {
    const xBtn = page.locator('button').filter({ hasText: '' }).locator('visible=true').first()
    await page.keyboard.press('Escape').catch(() => {})
    if (await skip.isVisible({ timeout: 500 }).catch(() => false)) {
      await skip.click()
    }
  }

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('agigx-close-ai-setup'))
    try {
      localStorage.setItem('agigx-ai-setup-panel-open', 'false')
    } catch (_) {}
  }).catch(() => {})
}

/**
 * @param {import('playwright-core').Page} page
 */
async function sanitizeForMarketing(page) {
  await page.addStyleTag({ content: SANITIZE_STYLE }).catch(() => {})

  await page.evaluate(() => {
    const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const phoneRe = /(\+?\d[\d\s-]{8,}\d)/g
    const internalHostRe = /\b(localhost|127\.0\.0\.1|acme[^\s]*)\b/gi

    document.querySelectorAll('button[aria-label="Open AI Setup Guide"]').forEach((el) => {
      el.setAttribute('data-marketing-hide', 'true')
    })

    document.querySelectorAll('button,a').forEach((el) => {
      const label = (el.textContent || '').trim()
      if (/^ask ai$/i.test(label)) {
        el.setAttribute('data-marketing-hide', 'true')
      }
    })

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) nodes.push(/** @type {Text} */ (walker.currentNode))

    for (const node of nodes) {
      const parent = node.parentElement
      if (!parent || parent.closest('script,style,noscript')) continue
      let t = node.textContent || ''
      if (emailRe.test(t)) {
        t = t.replace(emailRe, 'contact@yourcompany.com')
      }
      if (internalHostRe.test(t)) {
        t = t.replace(/\blocalhost\b/gi, 'app.yourcompany.com')
        t = t.replace(/\b127\.0\.0\.1\b/g, 'app.yourcompany.com')
        t = t.replace(/\bacme[^\s]*/gi, 'yourcompany.com')
      }
      if (phoneRe.test(t) && t.replace(/\D/g, '').length >= 10) {
        t = t.replace(phoneRe, '+91 XXXXX XXXXX')
      }
      node.textContent = t
    }

    document.querySelectorAll('input,textarea').forEach((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el.type === 'email' || emailRe.test(el.value)) {
          el.value = 'contact@yourcompany.com'
        }
        if (/\blocalhost\b/i.test(el.value)) {
          el.value = el.value.replace(/\blocalhost\b/gi, 'app.yourcompany.com')
        }
      }
    })
  }).catch(() => {})
}

async function waitForAppShell(page) {
  await dismissOverlays(page)

  await page
    .waitForFunction(
      () => {
        const main = document.querySelector('main')
        const words = main?.innerText?.length || document.body?.innerText?.length || 0
        const widgets = document.querySelectorAll(
          'main canvas, main svg, main table, main [class*="rounded"], main h1, main h2'
        ).length
        return words > 120 && widgets >= 3
      },
      null,
      { timeout: 35000 }
    )
    .catch(() => {})

  await page
    .evaluate(() =>
      Promise.all(
        [...document.images].map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => (img.onload = r))
        )
      )
    )
    .catch(() => {})

  await sanitizeForMarketing(page)
  await new Promise((r) => setTimeout(r, 2200))
}

/**
 * @param {import('playwright-core').Page} page
 * @param {string} fp
 * @param {{ fullPage?: boolean, clipToHeading?: string, clipToTableHeader?: string }} opts
 */
async function captureShot(page, fp, opts = {}) {
  const { fullPage = false, clipToHeading, clipToTableHeader } = opts

  if (fullPage) {
    await page.screenshot({ path: fp, type: 'png', animations: 'disabled', fullPage: true })
    return
  }

  if (clipToTableHeader) {
    const card = page.locator('.glass-card').filter({
      has: page.getByRole('columnheader', { name: clipToTableHeader }),
    })
    if (await card.isVisible({ timeout: 4000 }).catch(() => false)) {
      await card.screenshot({ path: fp, type: 'png', animations: 'disabled' })
      return
    }
  }

  if (clipToHeading) {
    const card = page
      .locator('h3')
      .filter({ hasText: clipToHeading })
      .locator('xpath=ancestor::div[contains(@class,"glass-card")][1]')
    if (await card.isVisible({ timeout: 4000 }).catch(() => false)) {
      await card.screenshot({ path: fp, type: 'png', animations: 'disabled' })
      return
    }
  }

  const main = page.locator('main').first()
  const hasMain = await main.isVisible({ timeout: 3000 }).catch(() => false)

  if (hasMain) {
    await main.screenshot({ path: fp, type: 'png', animations: 'disabled' })
    return
  }

  await page.screenshot({
    path: fp,
    type: 'png',
    animations: 'disabled',
    clip: { x: 240, y: 64, width: 1180, height: 780 },
  })
}

/**
 * @param {import('playwright-core').Page} page
 */
async function loginIfConfigured(page) {
  const email = process.env.AGIGX_UI_LOGIN_EMAIL
  const password = process.env.AGIGX_UI_LOGIN_PASSWORD
  if (!email || !password) {
    console.log(
      'No AGIGX_UI_LOGIN_EMAIL / AGIGX_UI_LOGIN_PASSWORD (public routes only; set env for full CMP UI).'
    )
    return
  }

  console.log('Signing in (authenticated capture)…')
  await page.goto(`${BASE.replace(/\/$/, '')}/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  })
  await page.waitForSelector('#email', { state: 'visible', timeout: 30000 })
  await page.fill('#email', email)
  await page.fill('#password', password)
  await page.click('button[type="submit"]')
  try {
    await page.waitForFunction(() => window.location.pathname !== '/login', null, { timeout: 90000 })
  } catch {
    const err =
      (await page
        .locator('.glass-card [class*="red"]')
        .first()
        .innerText()
        .catch(() => '')) || ''
    throw new Error(
      err.trim() ||
        'Login did not leave /login. Check AGIGX_UI_LOGIN_* and that auth-service is reachable from agigx-ui.'
    )
  }
  await page.waitForLoadState('networkidle').catch(() => {})
  await new Promise((r) => setTimeout(r, 1200))

  const url = page.url()
  if (url.includes('/login')) {
    throw new Error('Still on /login after successful redirect wait.')
  }

  console.log(`→ session: ${url}`)
}

async function main() {
  fs.mkdirSync(OUT_DARK, { recursive: true })
  fs.mkdirSync(OUT_LIGHT, { recursive: true })
  console.log(`Output (dark): ${OUT_DARK}`)
  console.log(`Output (light): ${OUT_LIGHT}`)
  console.log(`Base: ${BASE}`)

  const themes = [
    { name: 'dark', out: OUT_DARK, colorScheme: 'dark', theme: 'dark' },
    { name: 'light', out: OUT_LIGHT, colorScheme: 'light', theme: 'light' },
  ]

  for (const { name, out, colorScheme, theme } of themes) {
    console.log(`\n=== Capturing ${name} theme ===`)
    const browser = await chromium.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'],
    })

    const context = await browser.newContext({
      viewport: { width: 1480, height: 920 },
      deviceScaleFactor: 2,
      colorScheme,
      reducedMotion: 'reduce',
      javaScriptEnabled: true,
      ignoreHTTPSErrors: true,
    })

    await context.addInitScript((t) => {
      try {
        localStorage.setItem('theme', t)
        document.documentElement.setAttribute('data-theme', t)
        localStorage.setItem('agigx-ai-setup-panel-open', 'false')
      } catch (_) {}
    }, theme)

    const page = await context.newPage()
    await loginIfConfigured(page)

    const shotsFilter = process.env.CAPTURE_SHOTS
      ? process.env.CAPTURE_SHOTS.split(',').map((s) => s.trim()).filter(Boolean)
      : null
    const shotsToRun = shotsFilter?.length
      ? SHOTS.filter((s) => shotsFilter.includes(s.file))
      : SHOTS

    for (const shot of shotsToRun) {
      const { route, file, prep, fullPage, clipToHeading, clipToTableHeader, marketingMock } = shot
      const url = `${BASE.replace(/\/$/, '')}${route}`
      process.stdout.write(`→ [${name}] ${route}${clipToHeading ? ` (${clipToHeading})` : ''} … `)
      try {
        if (marketingMock === 'processors') {
          await installMarketingProcessorMock(page)
        }
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await page.waitForLoadState('networkidle').catch(() => {})
        await page.evaluate((t) => {
          try {
            localStorage.setItem('theme', t)
            document.documentElement.setAttribute('data-theme', t)
          } catch (_) {}
        }, theme).catch(() => {})
        await dismissOverlays(page)
        if (typeof prep === 'function') {
          await prep(page)
        }
        await waitForAppShell(page)
        if (marketingMock === 'processors') {
          await injectMarketingProcessorTable(page)
          await page.getByText('stripe-payments').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
          await new Promise((r) => setTimeout(r, 800))
        }
        const fp = path.join(out, file)
        await captureShot(page, fp, {
          fullPage: fullPage === true,
          clipToHeading,
          clipToTableHeader,
        })
        const st = fs.statSync(fp)
        console.log(`ok (${Math.round(st.size / 1024)} KB)`)
      } catch (e) {
        console.log(`FAIL: ${/** @type {Error} */ (e).message}`)
      }
    }

    await browser.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
