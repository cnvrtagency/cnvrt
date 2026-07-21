# CNVRT Astro site

The current source of truth is [`HANDOFF.md`](HANDOFF.md). Codex and other coding agents must also read [`AGENTS.md`](AGENTS.md) before editing.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Local homepage: `http://127.0.0.1:4321/`  
Visual checklist: `http://127.0.0.1:4321/project-checklist/`
Production preview: `https://cnvrtdigital.co.uk/`

## Current state

- The marketing site and private utility routes build as static Astro pages.
- Homepage, Services hub, fourteen service pages, About, Blog, Contact, project, audit, legal, thank-you, Work hub and six case-study pages exist.
- Three article detail routes are currently implemented under `src/pages/blog/`.
- Homepage design and structure should be preserved.
- Article cards stay and must be replaced with finished guides before launch.
- Forms, the invite-only admin workspace, client onboarding, discovery questionnaires, invoices, finance reporting and document management are connected to the production Supabase project. Never expose server credentials or private client tokens.
- The project checklist is private, noindexed and excluded from the sitemap.
- The production domain is protected by `netlify/edge-functions/site-gate.ts`. Its password is stored in Netlify as the secret `SITE_PREVIEW_PASSWORD`, never in the repository.

## Code map

- `src/pages/index.astro`: homepage.
- `src/pages/project-checklist.astro`: visual project tracker.
- `src/pages/admin/index.astro`: private Supabase enquiry admin.
- `src/pages/admin/clients.astro`: client directory, questionnaires and onboarding links.
- `src/pages/admin/finance.astro`: invoices, payments and finance reporting.
- `src/pages/admin/documents.astro`: reusable templates and client documents.
- `src/pages/web-design-discovery.astro`: private client discovery questionnaire.
- `src/pages/client/index.astro`: private client access checklist.
- `src/pages/invoice/index.astro`: private client invoice view and PDF generation.
- `src/pages/services/`: services routes.
- `src/pages/work/`: work hub and case studies.
- `src/layouts/BaseLayout.astro`: metadata, schema and document shell.
- `src/components/SiteHeader.astro`: global navigation.
- `src/components/SiteFooter.astro`: global footer.
- `src/components/EditorialHeading.astro`: authored editorial headings.
- `src/styles/global.css`: main visual system and homepage styles.
- `src/styles/project-checklist.css`: private checklist styles.
- `src/data/services.ts`: service-page content foundation.
- `src/data/work.ts`: work-page content foundation.
- `netlify/edge-functions/site-gate.ts`: server-side production preview gate.
- `netlify.toml`: build output and Edge Function routing.
- `public/media/hero/`: responsive hero video and poster assets.
- `docs/`: current strategy, content and implementation records.
- `supabase/`: enquiry schema, row-level security and submission Edge Function.

Supabase setup and acceptance steps are recorded in `docs/CNVRT-SUPABASE-ADMIN-SETUP.md`.

## Before finishing code work

```bash
npm run build
```

Do not deploy unless Daniel explicitly requests it.
