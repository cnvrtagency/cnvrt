# CNVRT homepage line-by-line review

Prepared: 16 July 2026  
Status: Controlled copy pass implemented and verified  
Implementation: Approved copy installed on 16 July 2026 without changing the homepage structure

## Recommended review outcome

The approved H1, selected-client heading, customer-journey heading, project cards and article-card section were preserved. The first controlled pass now covers metadata, hero support, services, engagement routes, customer-journey support, process, audit and factual FAQ wording. Ecommerce Web Design was added after its service route was completed. Article replacements, project-claim changes and new commercial notes remain held until their dependencies are complete or separately approved.

## Decisions needed before implementation

Tick or annotate each decision:

- [ ] Keep the current hero rail: `CNVRT / 2026`, `Manchester, UK`, `Design + marketing`.
- [x] Replace the two hero-support paragraphs with the proposed connected-services copy.
- [ ] Keep `Book a call` as the primary hero action, even though the current destination is the homepage enquiry form rather than a booking flow.
- [ ] Add `Explore services` as a second hero action and retain `Submit a project` as a text link.
- [ ] Keep Heatons Furniture in the three featured projects until its evidence is complete, or replace it with TopDraw after TopDraw scope and imagery are approved.
- [x] Add Ecommerce Web Design to the homepage only after `/services/ecommerce-web-design/` exists.
- [ ] Show `Projects from £1,000` on the Focused Project route.
- [ ] Show `Three-month minimum` on the Ongoing Growth route.
- [ ] Approve the Services hub grouping separately: Build and Commerce, Acquisition and Visibility, Retention and Customer Value.
- [ ] Choose whether Manchester wording should say `in Manchester`, `based in Manchester`, or use the safer `Manchester digital marketing agency` without implying a public office.

## Line-by-line recommendations

### Metadata

| Element | Current | Proposed | Recommendation |
|---|---|---|---|
| Title | Digital Marketing Agency Manchester \| CNVRT | Same | Keep. |
| Description | Manchester digital marketing agency for web design, Shopify, paid media, email marketing, SEO and AEO. Strategy, creative and technical delivery from CNVRT. | CNVRT is a Manchester digital marketing agency connecting web design, ecommerce, SEO, paid media, email and technology around business growth. | Approve proposed. It better expresses the connected-growth position and includes ecommerce. |

### Hero

| Element | Current | Proposed | Recommendation |
|---|---|---|---|
| H1 | Manchester digital / marketing agency. / Built for growth. | Same | Keep. This is already approved. |
| Paragraph 1 | CNVRT is a growth-focused digital agency in Manchester, combining strategy, creative, technology and marketing for service businesses and ambitious brands. | CNVRT connects websites, ecommerce, search, paid media, email and custom technology around the commercial problem limiting growth. | Approve proposed. It is more specific and avoids narrowing the audience to two loosely defined groups. |
| Paragraph 2 | Websites and ecommerce provide the foundation. Paid media, email, search and custom tools turn that foundation into measurable progress. | Start with one focused project or bring the right channels together through an ongoing programme shaped around your business. | Approve proposed. It avoids making every engagement sound website-led. |
| Actions | Book a call; Submit a project | Book a call; Explore services; Submit a project | Decision needed. Do not add a third action until its layout and hierarchy are reviewed. |

### Selected clients

Keep `Different sectors. / Shared ambition.` with no supporting paragraph.

### Selected work

The proposed section copy is strategically stronger, but changing the three cards is not ready:

- Heatons currently lacks final scope, evidence, quote and imagery approval.
- TopDraw also lacks final scope, evidence, quote and imagery approval.
- UberKinky is confirmed as a Shopline to Shopify Plus migration. The previous `Shopify + CRO` category and conversion-improvement description exceeded the confirmed evidence.
- Hear Better's current `Custom web + PPC` label understates the confirmed brand, website, SEO, AEO, PPC and growth scope.

Recommended safe corrections for approval:

- Hear Better category: `Brand, website + growth`.
- Hear Better description: `A new identity, lead-generation website and connected search and paid acquisition foundation for an independent mobile audiology business.`
- UberKinky category: `Shopline to Shopify Plus`.
- UberKinky description: `A Shopline to Shopify Plus migration for a specialist ecommerce retailer.`
- Hold the Heatons wording until its scope is confirmed.

### Services

Approve the proposed introduction and row refinements as one controlled pass, with these exceptions:

- The Ecommerce Web Design route now exists. Add its homepage row during this controlled homepage review, then check all eleven service rows together for density and responsive height.
- Keep the existing order until the new route is ready, then review all eleven rows together for density and responsive height.
- Change Google Ads only after confirming whether Shopping and Performance Max are offered. The current wording states both as services while the implementation checklist still marks them unconfirmed.
- Prefer the proposed AEO wording because it says `improve how brands are understood` rather than implying a discoverability outcome.

### Engagement routes

The proposed wording is clearer and removes first-person plural phrasing. Approve the editorial refinements independently from the visible commercial notes. `Projects from £1,000` and `Three-month minimum` are confirmed facts, but their placement is a commercial presentation decision.

Keep `Free, subject to fit` for Audit and Direction.

### Customer journeys

Keep the current heading. The proposed supporting copy is shorter and clearer. The imagery placeholders remain a separate pre-launch asset task and should not be disguised through copy changes.

### Process and audit

Approve the proposed process rail, heading and supporting paragraph. The proposed heading has a cleaner authored shape:

> Clear direction.  
> Focused delivery.  
> Useful measurement.

Approve the proposed audit copy. It is more precise and avoids the current phrase `before spending more`, which may sound accusatory.

### Client proof

No copy change recommended until the exact 10x ROAS period and attribution source are logged. The testimonial is approved, but evidence registration remains a publication dependency. Retain the visible `Final crop to be approved` marker locally.

### Articles

Keep the section and three cards. Do not replace titles or destinations until the complete articles and final editorial images exist. The current placeholder labels are acceptable only in the local working build.

### FAQs

Approve the proposed FAQ set with one wording correction:

- Avoid `CNVRT is based in Manchester` until Daniel confirms the intended business-location wording.
- Suggested answer: `Yes. CNVRT is a Manchester digital marketing agency working with businesses across the UK and beyond through a clear remote process.`

The proposed engagement-cost answer is stronger because it includes the confirmed three-month minimum. Add it only if Daniel approves making that term visible on the homepage.

### Contact

Keep the current contact heading and body for now. Do not promise a response within one working day until the response-time wording receives final approval. `Book a call` currently scrolls to or routes toward enquiry rather than a real booking flow, so either retain it as approved marketing language or rename it consistently across the site in a later CTA review.

## Implemented scope

1. Updated approved metadata and copy only in `src/pages/index.astro`.
2. Preserved markup, section order, imagery, motion, project cards and article cards.
3. Added Ecommerce Web Design after the route was completed.
4. Left unverified project claims unchanged.
5. Balanced all eleven service rows at 320, 390, 768, 1024 and 1440 pixels with no horizontal overflow.
6. Completed Astro check and the 33-route production build with no errors, warnings or hints.
7. Updated checklist defaults and project documentation only for completed work.

## Decisions still open

- Hero rail wording.
- Whether `Book a call` should remain before a real booking flow exists.
- Whether a third hero action should be introduced.
- Public placement of project minimums and the ongoing three-month minimum.
- Final Manchester location phrasing.
- Project-card claims and evidence updates.
- Finished article destinations and production form delivery.
