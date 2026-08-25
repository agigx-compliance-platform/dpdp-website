# Consent Cockpit (DPDP website)

DPDP compliance intelligence platform website built with Next.js 14, Tailwind CSS, and Framer Motion. Aligned with the agigx-ui design system (HSL token-based dark/light themes, glass morphism, gradient accents).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4 with HSL CSS variable design tokens
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **UI Primitives**: Radix UI (Accordion, Dialog, Select, Tabs, Toast, Progress)
- **Icons**: Lucide React
- **HTTP**: Axios (placeholder API endpoints)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:8000](http://localhost:8000).

## Static assets

### Hero images (`public/images/`)

- `hero-light.png`: full-bleed hero background for **light theme**
- `hero-dark.png`: full-bleed hero background for **dark theme** (default)

The homepage switches images when the user toggles theme. Optional **`NEXT_PUBLIC_HERO_SUBLINE`** in `.env.local` adds a line under the headline.

### CMP screenshots (products & services)

Real UI captures from **Consent Cockpit / CMP** (`consent-management`). Mapped in [`src/lib/agigx-ui-screenshots.ts`](src/lib/agigx-ui-screenshots.ts).

**Unauthenticated (public shell only):**

1. Start the CMP UI dev app: `cd ../agigx-ui && npm run dev` (default [http://127.0.0.1:3000](http://127.0.0.1:3000))
2. One-time Chromium: `cd ../agigx-ui && npx playwright install chromium`
3. From this folder: `npm run capture:agigx-ui`

**Authenticated (full CMP after login)**. Set `AGIGX_UI_LOGIN_EMAIL` and `AGIGX_UI_LOGIN_PASSWORD` in `.env.local` (gitignored), or export them in your shell, or use a local-only `.env.capture.local`. The script loads `/login`, submits the form, then captures routes with your session cookies.

Never commit passwords. Rotate any credential that was pasted into git history or chat.

Output: `public/images/products/agigx-ui/*.png`.

Optional: **`NEXT_PUBLIC_SITE_URL`** (`https://dpdpconsultancy.in`) for sitemap, canonical URLs, Open Graph, and JSON-LD. Also set this in Netlify environment variables for production builds.

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    page.tsx            # Homepage (16 scroll sections)
    services/           # 8 service categories with sub-offerings
    products/           # 6 product showcases
    solutions/          # 7 industry-specific solutions
    questionnaire/      # 10-step assessment wizard
      results/          # Personalized recommendations
    contact/            # Contact form + FAQ
    partnership/        # Partnership models
    about/              # Company info
  components/
    layout/             # Navbar, Footer
    home/               # 16 homepage section components
    questionnaire/      # Wizard, steps, results
    ui/                 # Shared UI components
    providers/          # ThemeProvider
  lib/
    api.ts              # API client (placeholder endpoints)
    constants.ts        # All content data (services, products, solutions)
    types.ts            # TypeScript interfaces
    recommendation-logic.ts  # Questionnaire + scan recommendation engine
    questionnaire-schema.ts  # Zod validation schemas
  hooks/                # useTheme, useInView
```

## Theme

Dark mode (default) and light mode via `data-theme` attribute toggle. Design tokens are HSL CSS variables shared with agigx-ui.

## API Integration

All API calls target the Consent Management Service, configured via environment variables.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONSENT_API_URL` | Inlined at **build time** (required for Netlify builds) |
| `CONSENT_API_URL` | Read at **runtime** via `/api/config` fallback |

### Netlify deployment

1. In **Project configuration → Environment variables**, add:
   - `NEXT_PUBLIC_CONSENT_API_URL` = your API URL (scope: **Builds**)
   - `CONSENT_API_URL` = same URL (scope: **Builds** and **Functions**)
   - `NEXT_PUBLIC_CONSENT_DOMAIN` = `dpdpconsultancy.in` (scope: **Builds**)
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-S52KHLM8Q0` (scope: **Builds**)
2. **Trigger a new deploy** after saving — changing env vars does not update existing bundles.
3. Ensure the site **base directory** is `dpdp-website` if deploying from the monorepo root.

## Consent Cockpit SDK + Google Analytics

The marketing site embeds **Consent Cockpit** (`agigx.js`) and loads **GA4 only after analytics consent** (`data-cookie-category="analytics"`).

### Platform setup (agigx-ui, before first deploy)

1. Register domain **`dpdpconsultancy.in`** in Consent Management.
2. Deploy an **active opt-in banner** with an **analytics** category.
3. Confirm SDK is reachable: `{CONSENT_API_URL}/api/v1/sdk/agigx.js`

### Verify after Netlify deploy

1. Open the site in **incognito** — consent banner should appear.
2. **Before** accepting analytics — Network tab should show **no** `googletagmanager.com` requests.
3. **Accept analytics** — GA requests should fire.
4. Check **GA4 → Reports → Realtime** for your visit.

Endpoints (base URL + path):

- `POST /api/enquiry`: Contact form submission
- `POST /api/questionnaire`: Questionnaire response submission
- `POST /api/scan/initiate`: Trigger website privacy scan
- `GET /api/scan/status/:id`: Poll scan progress
- `GET /api/scan/report/:id`: Get scan results
- `POST /api/contact`: Contact form submission
