# DPDP Consultancy (DPDP website)

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

### Hero video & poster (`public/`)

- `images/hero-poster.png`: full-bleed hero background (shown on all breakpoints; dominant on mobile)
- `videos/hero.mp4`: muted loop from `md` breakpoint up

In **light theme**, the hero uses a **dark scrim** over the video so it stays readable. **`NEXT_PUBLIC_HERO_VIDEO_DISCLAIMER`** in `.env.local` can correct on-page copy if the clip still shows draft text.

### CMP screenshots (products & services)

Real UI captures from **DPDP Consultancy / CMP** (`consent-management`). Mapped in [`src/lib/agigx-ui-screenshots.ts`](src/lib/agigx-ui-screenshots.ts).

**Unauthenticated (public shell only):**

1. Start the CMP UI dev app: `cd ../agigx-ui && npm run dev` (default [http://127.0.0.1:3000](http://127.0.0.1:3000))
2. One-time Chromium: `cd ../agigx-ui && npx playwright install chromium`
3. From this folder: `npm run capture:agigx-ui`

**Authenticated (full CMP after login)**. Set `AGIGX_UI_LOGIN_EMAIL` and `AGIGX_UI_LOGIN_PASSWORD` in `.env.local` (gitignored), or export them in your shell, or use a local-only `.env.capture.local`. The script loads `/login`, submits the form, then captures routes with your session cookies.

Never commit passwords. Rotate any credential that was pasted into git history or chat.

Output: `public/images/products/agigx-ui/*.png`.

Optional: **`NEXT_PUBLIC_SITE_URL`** for Open Graph image URLs in production.

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

All API calls use placeholder URLs configured via `NEXT_PUBLIC_CONSENT_API_URL`. Endpoints:

- `POST /api/enquiry`: Contact form submission
- `POST /api/questionnaire`: Questionnaire response submission
- `POST /api/scan/initiate`: Trigger website privacy scan
- `GET /api/scan/status/:id`: Poll scan progress
- `GET /api/scan/report/:id`: Get scan results
- `POST /api/contact`: Contact form submission
