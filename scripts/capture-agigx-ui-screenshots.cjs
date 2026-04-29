/**
 * Captures PNG screenshots from running agigx-ui (default http://127.0.0.1:3000).
 *
 * Prerequisites:
 *   cd agigx-ui && npm run dev
 *   npx playwright install chromium   # from agigx-ui once
 *
 * Authenticated CMP (recommended): set credentials via env — never commit them.
 *   AGIGX_UI_LOGIN_EMAIL   AGIGX_UI_LOGIN_PASSWORD
 * Optional files: loads `.env.local` then `.env.capture.local` (latter overrides for capture-only vars).
 *
 * Usage (from dpdp-website):
 *   npm run capture:agigx-ui
 *   AGIGX_UI_URL=http://localhost:3000 AGIGX_UI_LOGIN_EMAIL=u@x.com AGIGX_UI_LOGIN_PASSWORD=*** npm run capture:agigx-ui
 */

const fs = require('fs')
const path = require('path')

const DPI = `${__dirname}/..`
const OUT = path.join(DPI, 'public/images/products/agigx-ui')

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

/** @type {{ route: string, file: string }[]} */
const SHOTS = [
  { route: '/consent-management', file: 'cmp-dashboard.png' },
  { route: '/consent-management/consent-banner', file: 'cmp-consent-banner.png' },
  { route: '/consent-management/domains', file: 'cmp-domains.png' },
  { route: '/consent-management/analytics', file: 'cmp-analytics.png' },
  { route: '/consent-management/compliance-health', file: 'cmp-compliance-health.png' },
  { route: '/consent-management/consent-logs', file: 'cmp-consent-logs.png' },
  { route: '/consent-management/cookie-policy', file: 'cmp-cookie-policy.png' },
  { route: '/consent-management/dsar/requests', file: 'cmp-dsar-requests.png' },
]

async function waitForAppShell(page) {
  await page
    .waitForFunction(
      () => {
        const hasBg =
          parseInt(
            getComputedStyle(document.body).backgroundColor?.replace(/[^\d,]/g, '').split(',').pop()?.trim() ||
              '255',
            10
          ) < 250
        const words = document.body?.innerText?.length || 0
        const nodes = document.querySelectorAll(
          'nav,aside,canvas,svg,text,.page-title,[class*="rounded-xl"],card'
        ).length
        return (words > 80 && nodes >= 8) || (hasBg && nodes >= 4)
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
  await new Promise((r) => setTimeout(r, 2800))
}

/**
 * @param {import('playwright-core').Page} page
 */
async function loginIfConfigured(page) {
  const email = process.env.AGIGX_UI_LOGIN_EMAIL
  const password = process.env.AGIGX_UI_LOGIN_PASSWORD
  if (!email || !password) {
    console.log(
      'No AGIGX_UI_LOGIN_EMAIL / AGIGX_UI_LOGIN_PASSWORD — public routes only (set env for full CMP UI).'
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
        'Login did not leave /login — check AGIGX_UI_LOGIN_* and that auth-service is reachable from agigx-ui.'
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
  fs.mkdirSync(OUT, { recursive: true })
  console.log(`Output: ${OUT}`)
  console.log(`Base: ${BASE}`)

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage'],
  })

  const context = await browser.newContext({
    viewport: { width: 1480, height: 920 },
    deviceScaleFactor: 1.25,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
  })

  await context.addInitScript(() => {
    try {
      localStorage.setItem('theme', 'dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } catch (_) {}
  })

  const page = await context.newPage()
  await loginIfConfigured(page)

  for (const { route, file } of SHOTS) {
    const url = `${BASE.replace(/\/$/, '')}${route}`
    process.stdout.write(`→ ${route} … `)
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForLoadState('networkidle').catch(() => {})
      await waitForAppShell(page)
      const fp = path.join(OUT, file)
      await page.screenshot({
        path: fp,
        type: 'png',
        animations: 'disabled',
      })
      const st = fs.statSync(fp)
      console.log(`ok (${Math.round(st.size / 1024)} KB)`)
    } catch (e) {
      console.log(`FAIL: ${/** @type {Error} */ (e).message}`)
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
