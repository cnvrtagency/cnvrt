# CNVRT agent instructions

## Source of truth

- This directory, `/Users/danlyons/Work/cnvrt`, is the only active CNVRT codebase.
- Do not edit or deploy the former copy under `wireframe-whisperer-89/CNVRT FINAL/site`.
- Read `HANDOFF.md` and `README.md` before making changes.
- Treat `docs/` as research and decision history. Check each document's date and status before treating it as current implementation truth.

## Working rules

- Preserve the existing CNVRT visual language and responsive behaviour.
- Use the real brand assets in `public/brand/` and the project imagery in `src/assets/`.
- Do not invent results, awards, accreditations, prices, medical facts or client evidence.
- Do not expose `.env.local`, Supabase secrets, access tokens, private questionnaire links or client portal tokens.
- Do not alter production data merely to test a UI. Use clearly labelled test data and reset it before handing links to a client.
- Do not deploy unless Daniel explicitly requests deployment.
- Preserve unrelated user changes in the Git working tree.

## Verification

- Run `npm run build` after code changes.
- Run `npm run audit:site` for changes affecting routes, metadata, internal links, forms or SEO.
- Test client-facing forms as a real visitor, including refresh and return behaviour.
- Check both desktop and mobile layouts for visual changes.
- Confirm the production password gate still allows `/web-design-discovery/`, `/client/`, `/invoice/` and their required static assets.

## Key systems

- Astro static site deployed through Netlify.
- Supabase provides authentication, CRM data, questionnaires, onboarding, invoices, finance and documents.
- Netlify Edge Function `netlify/edge-functions/site-gate.ts` protects the preview site.
- Production client utility routes use private token links and must remain `noindex`.
