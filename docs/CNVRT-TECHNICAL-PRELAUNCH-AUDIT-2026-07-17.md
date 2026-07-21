# CNVRT technical pre-launch audit

Date: 17 July 2026  
Scope: Local static build at `http://127.0.0.1:4321/`  
Production origin checked in metadata: `https://cnvrtdigital.co.uk`

## Outcome

The current local site passes the technical pre-launch checks that can be completed safely without changing production services or sending test enquiries.

- 44 HTML pages generated successfully.
- Astro check reports zero errors, zero warnings and zero hints.
- The generated-site audit reports zero structural errors.
- 60 representative responsive checks passed across 12 routes and five viewport widths.
- All three public forms have associated labels, a privacy link, a submit control and a live status region.
- The browser console remained clear of warnings and errors during the interaction pass.
- The custom 404 page returns HTTP 404 and provides useful recovery routes.

## Automated generated-site checks

Run the complete local audit with:

```bash
npm run audit:site
```

The command performs an Astro type and build check before auditing the generated output for:

- one non-empty title and meta description per page;
- robots directives and indexability;
- canonical URLs on indexable pages;
- one H1 and one main landmark on public routes;
- language and viewport metadata;
- duplicate titles, descriptions and element IDs;
- image alternative text, dimensions and output files;
- valid JSON-LD;
- working internal routes and fragments;
- accessible link names;
- robots.txt directives;
- sitemap index generation and exact sitemap membership.

Current result: 44 pages, zero errors and four review-only description-length notes. The four notes belong to noindexed utility routes: Admin, Project Checklist, Terms and Thank You. They do not need search-snippet expansion.

## Responsive and interaction coverage

Representative routes checked:

- Homepage
- Services hub
- Web Design
- Shopify Migrations
- Conversion Rate Optimisation
- Work hub
- Hear Better case study
- Blog hub
- Shopify Migration Checklist article
- Contact
- Submit a Project
- Custom 404

Widths checked: 320, 390, 768, 1024 and 1440 pixels.

Each route and width combination was checked for one H1, one main landmark, visible H1 geometry, document-level horizontal overflow, failed images and a skip link. All 60 combinations passed.

The mobile navigation was opened and closed at 390 pixels. The navigation, grouped service links and utility routes were available when expanded and removed from the active interface when closed.

The Shopify Migration Checklist table of contents was also checked with a direct `#seo` fragment. The target exists and arrives within the viewport.

## Public form accessibility

The Contact, Request an Audit and Submit a Project forms were inspected without submitting data.

| Route | Controls | Required | Missing labels | Duplicate IDs | Privacy link | Live region | Submit control |
| --- | ---: | ---: | ---: | ---: | --- | --- | ---: |
| `/contact/` | 7 | 4 | 0 | 0 | Yes | Yes | 1 |
| `/request-an-audit/` | 8 | 6 | 0 | 0 | Yes | Yes | 1 |
| `/submit-a-project/` | 9 | 5 | 0 | 0 | Yes | Yes | 1 |

Production enquiry submission was intentionally not tested because the live Supabase project and protected secrets remain a separate launch task.

## Corrections completed during this audit

- Added a branded, noindexed custom 404 page with genuine 404 response behaviour.
- Tightened overlong indexable titles and descriptions across selected articles, service pages, projects and the Services hub.
- Added intrinsic dimensions to migration platform logos and the Hear Better logo.
- Added a reusable generated-site audit command.
- Added robots, sitemap index and exact sitemap membership validation to the audit.

## Remaining production-only checks

These items are not local implementation failures. They require production configuration, credentials, real traffic conditions or launch approval.

- Apply and test the production Supabase migration, Edge Function, secrets and delivered enquiry flow.
- Configure analytics, consent behaviour and qualified-enquiry event mapping.
- Complete the historic URL export and redirect map.
- Remove the private preview gate and production noindex only when public launch is approved.
- Verify production response headers, sitemap availability and canonical behaviour after the final deploy.
- Run live performance and Core Web Vitals testing after CDN delivery is public.
- Complete final assistive-technology and cross-browser checks on production.
- Configure Search Console and Bing Webmaster Tools after public launch.

## Files changed by the audit

- `scripts/audit-built-site.mjs`
- `src/pages/404.astro`
- `src/styles/foundation-pages.css`
- `src/data/articles.ts`
- `src/data/projects.ts`
- `src/data/services.ts`
- `src/pages/services/index.astro`
- `src/pages/services/[slug].astro`
- `src/pages/work/[slug].astro`
- `src/pages/project-checklist.astro`
- `package.json`

No deployment was performed as part of this audit.
