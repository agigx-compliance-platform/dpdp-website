# AGENTS.md: dpdp-website

Public marketing site for DPDP Consultancy / Consent Cockpit. Next.js 16 App Router, Tailwind with HSL tokens synced from agigx-ui, Framer Motion, React Hook Form + Zod. Deployed on Netlify (`netlify.toml`). Port 8000.

## Commands

```bash
npm ci
npm run lint
npm test              # vitest run
npm run build
```

`npm run sync:tokens` and the `sync:agigx-ui-*` scripts pull design tokens and mockups from `../agigx-ui`; rerun them instead of hand-editing generated files.

## Things to watch

- This is marketing copy: no em or en dashes, ever.
- The contact form posts consent through the platform; check it with `make check-contact-form` in `../dev-orchestration`.

## Conventions shared by all AGIGX repos

- Repos are checked out side by side under one parent folder. Local wiring (Postgres, ports, seed data) lives in `../dev-orchestration` (`make start`); cloud deploys live in `../gcp-deploy` and `../dpdp-infra`.
- Commit messages are one plain sentence that says what changed and why (for example "Return a coded 403 so the dashboard does not treat it as an expired session."). No conventional-commit prefixes.
- Work on a branch and open a PR against `main`. Run the tests listed above and keep them green before pushing.
- Never commit secrets: `.env*`, `credentials.txt`, `token.txt`, service-account keys, real customer data. Stage files by name rather than `git add -A`.
- Customer-facing text (UI, emails, website, PDFs) never uses em dashes or en dashes. Use a period, comma or colon; ranges use a plain hyphen.
- Product names: **Privacy Auto Pilot** (overall), **Consent Cockpit**, **Privacy Runway**, **Cloud Guardrail**, powered by DPDP Consultancy. Backend product codes (`CONSENT_MANAGEMENT`, `INFRA_POSTURE`) and URLs are unchanged on purpose.
