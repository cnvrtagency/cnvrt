# CNVRT project handoff

Updated: 21 July 2026

## Canonical project

The complete, active project is:

`/Users/danlyons/Work/cnvrt`

The previous working copy under `wireframe-whisperer-89/CNVRT FINAL/site` is retained only as a temporary fallback. Do not make new changes there.

## Stack and deployment

- Astro 7 static build
- TypeScript
- Supabase for Auth, CRM, forms, client onboarding, finance and documents
- Netlify for production hosting and the preview password gate
- Production origin: `https://cnvrtdigital.co.uk`
- Local origin: `http://127.0.0.1:4321`

Commands:

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run audit:site
```

Deploy only when Daniel explicitly asks:

```bash
npx netlify deploy --prod --dir=dist
```

## Current product areas

- Public marketing site with homepage, service pages, work, case studies, blog, About, Contact and legal routes
- `/admin/` for enquiries and commercial workflow
- `/admin/clients/` for clients, questionnaires and onboarding
- `/admin/finance/` for invoices, payments and reporting
- `/admin/documents/` for templates and assigned client documents
- `/web-design-discovery/` for token-protected discovery forms
- `/client/` for token-protected access checklists
- `/invoice/` for private invoice views and PDF downloads

The production preview gate must allow the three private client routes above, the thank-you route and required static assets without exposing the remaining site.

## Important implementation locations

- `src/pages/`: routes
- `src/components/`: shared UI
- `src/styles/`: page and system styles
- `src/scripts/`: browser-side form, admin, client, invoice and finance behaviour
- `src/data/`: service and work content
- `src/assets/`: source imagery
- `public/brand/`: CNVRT brand assets
- `supabase/migrations/`: database history
- `supabase/functions/`: production Edge Functions
- `netlify/edge-functions/site-gate.ts`: password gate
- `templates/`: reusable document templates
- `docs/`: research, audits and decision records

## Current client workflow

1. Enquiry is created or received in the admin workspace.
2. Proposal and invoice are prepared.
3. A private discovery questionnaire link is generated.
4. Questionnaire answers save locally and to a secure server draft.
5. Submission appears against the client in `/admin/clients/`.
6. The client receives a separate access checklist and shared Drive folder.
7. Admin, finance and documents remain separate from the public site.

## Safety and data rules

- `.env.local` is required locally and ignored by Git.
- Never place service-role keys, personal access tokens or client tokens in Markdown or source files.
- Private client routes are `noindex` and token protected.
- Do not submit or complete a real client's form during testing unless explicitly authorised.
- When authorised testing uses real records, label test values and reset them before sending the final links.

## Documentation status

Use this file and `AGENTS.md` for current operational truth. Documents in `docs/` include valuable research and prior decisions, but several are dated audits or prelaunch records and should not override the live code without verification. See `docs/README.md`.
