# CNVRT Google Ads service architecture audit

Research date: 16 July 2026  
Status: Recommended commercial-page architecture, subject to CNVRT confirming ecommerce PPC delivery experience and proof  
Question: Should Google Ads be split into specialist ecommerce, local, Shopping or campaign-type service pages?

## 1. Executive decision

CNVRT should eventually add one specialist paid-search commercial page:

`/services/ecommerce-ppc/`

It should target ecommerce PPC agency, ecommerce Google Ads, Google Shopping management and Performance Max for ecommerce within one coherent retail proposition.

CNVRT should not currently add separate pages for local PPC, Google Shopping, Performance Max, Search Ads, remarketing or Local Services Ads.

| Proposed topic | Decision | Confidence | Reason |
|---|---|---:|---|
| Ecommerce PPC | Approve as one future commercial page | High | The UK result set, buyer need and technical delivery model are materially different from lead-generation Search management. |
| Google Shopping | Keep inside Ecommerce PPC for now | High | The intent is distinct, but a second page would divide limited retail proof and overlap heavily with feeds, Merchant Center and Performance Max content. |
| Local PPC | Do not create a commercial page now | High | The query is ambiguous and the delivery remains part of the main Google Ads service. Existing proof is not broad enough to justify another service URL. |
| Local Services Ads | Do not create a service page | High | This is a category-limited Google product with Business Profile, eligibility and verification dependencies, not a synonym for local PPC. |
| Performance Max | Publish a guide, not a service page | High | It is a campaign type used across retail, lead generation and store goals rather than a standalone customer problem. |
| Google Search Ads | Keep within Google Ads | High | A separate page would duplicate the core service and compete with `/services/google-ads/`. |
| PPC audit | Publish the planned audit guide | High | The intent is investigative and supports the audit conversion route without needing another retained-service page. |
| Microsoft Ads | Keep separately scoped | Medium | It deserves a page only when CNVRT has a repeatable offer, demand and approved evidence. |

## 2. Why Ecommerce PPC is genuinely different

The current Google Ads page is strongest for Search-led acquisition and lead generation. Ecommerce PPC introduces a different operating system:

1. Product data rather than keywords alone determines eligibility and relevance.
2. Google Merchant Center must be configured, linked and policy compliant.
3. Shopping ads use product attributes, including titles, images, price and availability.
4. Standard Shopping and retail Performance Max need catalogue segmentation and product-level reporting.
5. Margin, stock, returns, average order value and lifetime value affect what should be scaled.
6. Product feeds, promotions, disapprovals and landing-page accuracy need continuing management.
7. Purchase tracking needs reliable transaction values and, ideally, useful item-level data.
8. Shopify and other ecommerce-platform data become part of advertising delivery.

Google states that Shopping ads use Merchant Center product data rather than ordinary keyword targeting, and that a Merchant Center account must be linked to Google Ads for Shopping or feed-based Performance Max campaigns. These are material service boundaries rather than extra paragraphs on a generic PPC page.

Official sources:

- [Google Ads: About Shopping ads](https://support.google.com/google-ads/answer/2454022)
- [Google Ads: Requirements for Shopping ads](https://support.google.com/google-ads/answer/6275312)
- [Google Merchant Center: Editorial and professional requirements](https://support.google.com/merchants/answer/6150244)
- [Google Ads: About Performance Max campaigns](https://support.google.com/google-ads/answer/10724817)

## 3. Why “local PPC” is not one clean service intent

The phrase can refer to four different systems:

1. Ordinary Search campaigns with city, postcode or radius targeting.
2. Google Local Services Ads for eligible service categories.
3. Local inventory ads for retailers with physical stock locations.
4. Performance Max campaigns using store visits, store sales or local actions as goals.

Google permits country, area, radius and location-group targeting inside ordinary Google Ads campaigns. That is a campaign setting and strategy layer, not automatically a separate service.

Local Services Ads are different. In the UK they are available only for eligible categories and require onboarding, a public verified Google Business Profile and other checks that vary by business type. Leads can arrive through calls or messages inside the Local Services product.

Local inventory ads are different again. They rely on Merchant Center inventory data and are mainly an omnichannel retail capability. They belong inside an ecommerce PPC proposition unless CNVRT later develops a substantial multi-location retail specialism.

Official sources:

- [Google Ads: Location targeting](https://support.google.com/google-ads/answer/10835274)
- [Google Local Services: Getting started in the United Kingdom](https://support.google.com/localservices/answer/6224841?co=GENIE.CountryCode%3DGB&hl=en-gb)
- [Google Local Services: UK screening and verification requirements](https://support.google.com/localservices/answer/12174778?co=GENIE.CountryCode%3DGB&hl=en-gb)
- [Google Ads: Local inventory ads and free local listings](https://support.google.com/google-ads/answer/14615117)
- [Google Ads: Performance Max for store goals](https://support.google.com/google-ads/answer/12971048)

This ambiguity makes `/services/local-ppc/` a poor immediate page. It would either repeat the main Google Ads page or imply that CNVRT delivers every local advertising product and verification workflow.

## 4. UK search-result intent review

The review used current public UK-oriented results for Google Ads agency, ecommerce PPC agency, Google Shopping agency, Performance Max agency, local PPC agency and local Google Ads management queries.

This is a qualitative intent and architecture audit. It does not include authenticated Google Keyword Planner volumes or CNVRT Search Console query data. Those sources should refine launch priority and wording, but the visible difference between the retail and local result sets is strong enough to make the page-boundary decision.

| Query family | What ranks | Intent strength | Architecture implication |
|---|---|---:|---|
| Google Ads agency / PPC management | General paid-search agencies and integrated performance agencies | Strong commercial | Owned by `/services/google-ads/`. |
| Ecommerce PPC agency | Ecommerce specialists and purpose-built retail PPC pages | Strong commercial | Supports a separate Ecommerce PPC page. |
| Google Shopping agency | Dedicated Shopping management pages from specialist and larger agencies | Strong commercial | Include as a major section and secondary target on Ecommerce PPC first. |
| Performance Max agency | A mixture of service pages, product explanations and control guides | Mixed commercial and informational | Use a decision guide and Ecommerce PPC section, not a standalone service page. |
| Local PPC agency | A small number of specialists mixed with generic agencies in a local area | Ambiguous | Do not split from Google Ads yet. |
| Local Services Ads | Google help, eligibility information and vertical specialists | Product and eligibility led | Cover only if CNVRT confirms an eligible, repeatable service. |
| Google Ads agency Manchester | Manchester PPC agencies and location-relevant general pages | Strong local supplier intent | The main Google Ads page already owns this intent. |

Examples of the distinct ecommerce result set include:

- [Clean Digital: Ecommerce PPC](https://cleandigital.co.uk/ecommerce-ppc)
- [Dynamically: PPC for ecommerce](https://dynamically.co.uk/services/ppc-for-ecommerce)
- [Impression: Ecommerce PPC](https://www.impressiondigital.com/paid-media/ppc/ecommerce-ppc/)
- [Bind Media: Shopping Ads](https://bind.media/services/paid-media/shopping-ads)
- [Embryo: Google Shopping](https://embryo.com/ppc/google-shopping/)
- [Add People: Ecommerce PPC](https://www.addpeople.co.uk/pay-per-click/ppc-ecommerce/)

The recurring ecommerce language is not just “more sales”. It includes product feeds, Merchant Center, catalogue segmentation, product economics, Shopping, Performance Max, stock and profit-aware reporting.

## 5. Ten-agency architecture audit

The same ten UK competitors used for the main Google Ads audit were reviewed for specialist page architecture.

| Agency | General paid-search proposition | Ecommerce or Shopping breakout | Local PPC breakout | Architectural finding |
|---|---|---|---|---|
| [Bind Media](https://bind.media/services/paid-media/google-ads-agency) | Dedicated Google Ads page | Dedicated [Shopping Ads](https://bind.media/services/paid-media/shopping-ads) page | None identified | Retail Shopping is treated as a distinct commercial capability. |
| [Hallam](https://hallam.agency/) | Integrated paid media proposition | Ecommerce evidence and Shopping case studies, but no clear current standalone Shopping service page identified | None identified | Ecommerce depth is demonstrated mainly through integrated work and proof. |
| [Impression](https://www.impressiondigital.com/paid-media/ppc/google-ads-management/) | Dedicated Google Ads management | Dedicated [Ecommerce PPC](https://www.impressiondigital.com/paid-media/ppc/ecommerce-ppc/) and [Google Shopping](https://www.impressiondigital.com/paid-media/ppc/google-shopping/) pages | None identified | The most extensive separation in the set, supported by enterprise proof. |
| [PPC Geeks](https://ppcgeeks.co.uk/ppc-management/) | Pure-play PPC management | Dedicated [Shopping Ads](https://ppcgeeks.co.uk/shopping-ads/) page plus ecommerce and sector content | Location pages exist, but no distinct local-business PPC service page was identified | Ecommerce and Shopping depth is used heavily; “local” is mostly supplier geography or supporting content. |
| [Novi Digital](https://novi.digital/solutions/google-ads-management/) | Google Ads page with named packages | Shopping and Performance Max have substantial packages inside the parent page | None identified | Specialist intent can be captured without a separate URL when the offer is not yet deep enough. |
| [Push](https://www.pushgroup.co.uk/) | Paid Search within a wider performance offer | Ecommerce thought leadership; no equivalent dedicated Ecommerce PPC page identified | No local-business PPC page identified; international PPC is separated | Pages are split where delivery changes materially, such as international expansion. |
| [Click Consult](https://www.click.co.uk/) | Integrated SEO and PPC | Dedicated [ecommerce sector](https://www.click.co.uk/specialist-sectors/ecommerce/) page with PPC evidence | None identified | Ecommerce is a distinct buyer context even when channels remain integrated. |
| [Loud Mouth Media](https://loudmouthmediagroup.com/google-ads/) | Concise Google Ads page | Ecommerce is presented within the wider offer rather than as a detailed Shopping service | None identified | A smaller architecture avoids weak campaign-type pages. |
| [Hot Click Marketing](https://www.hotclickmarketing.co.uk/) | Generic Manchester PPC specialist | No dedicated Ecommerce PPC or Shopping page identified | No local-business PPC page identified | Local supplier relevance is handled by the main proposition. |
| [DomiSearch](https://www.domisearch.com/) | Manchester Google Ads and AEO proposition | No dedicated Ecommerce PPC or Shopping page identified | No local-business PPC page identified | A focused architecture keeps proof concentrated on the core services. |

Summary:

- Three of the ten have clear standalone Ecommerce PPC or Shopping service URLs.
- A fourth uses an ecommerce sector page with PPC proof.
- A fifth gives Shopping and Performance Max substantial commercial packages inside the Google Ads page.
- None of the ten was found using a strong standalone “local PPC for local businesses” service page.
- Location-led PPC agency pages are not the same as a local-business advertising specialism.

The wider ecommerce SERP contains several additional purpose-built specialists, so the opportunity is broader than the ten-agency set alone.

## 6. Recommended URL ownership

### `/services/google-ads/`

Primary ownership:

- Google Ads agency Manchester.
- Google Ads management UK.
- PPC management.
- Search campaign management.
- Lead generation and qualified-demand management.
- Account audits, measurement, landing pages and reporting.
- Local service-business campaigns as a use case.

It should mention ecommerce and Shopping briefly, then link to the specialist page when that page exists.

### `/services/ecommerce-ppc/`

Recommended primary target:

`Ecommerce PPC agency UK`

Recommended secondary targets:

- Ecommerce Google Ads agency.
- Google Shopping agency.
- Google Shopping management.
- Performance Max agency for ecommerce.
- Shopify PPC agency.
- Ecommerce paid search.

Recommended title:

`Ecommerce PPC Agency UK | Google Shopping & PMax | CNVRT`

Recommended H1 direction:

`Ecommerce PPC built around product economics, not platform revenue alone.`

This page should own:

- Merchant Center setup and diagnostics.
- Product-feed quality and optimisation boundaries.
- Standard Shopping and retail Performance Max.
- Search campaigns for products, categories and brands.
- Catalogue segmentation using margin, stock, seasonality and product priority.
- Purchase and transaction-value measurement.
- Product, collection and landing-page relevance.
- Promotions, disapprovals and ongoing feed health.
- Shopify and ecommerce-platform integration context.
- Profit-aware reporting and controlled scaling.

It should not become a generic list of every paid-media channel. Meta Ads and email remain separate services.

### No `/services/local-ppc/` now

Keep local paid-search content on the main Google Ads page and connect it to Local SEO, landing pages, call or form tracking, CRM lead quality and Hear Better proof.

Publish a supporting guide instead:

`Google Ads for local service businesses: targeting, tracking and lead quality`

That guide can explain:

- Presence-based location targeting and radius limitations.
- City, service and intent structure.
- Calls, forms, bookings and offline lead qualification.
- Location-specific landing pages.
- Search terms and negative keywords.
- Budget allocation across service areas.
- The difference between Search, Local Services Ads and Local SEO.

### No standalone Google Shopping page yet

Google Shopping has distinct intent, but CNVRT should first concentrate it inside Ecommerce PPC. A later `/services/google-shopping/` page becomes justified only when all of the following exist:

1. Feed and Merchant Center management are sold as a repeatable service.
2. At least two approved retail examples show Shopping-specific work.
3. There is enough unique material on feeds, diagnostics, CSS, promotions, product segmentation and local inventory to avoid repeating Ecommerce PPC.
4. Search Console and Keyword Planner data show enough incremental opportunity.

### No standalone Performance Max page

Performance Max can serve retail, lead-generation and store goals. A service page would encourage campaign-type shopping before diagnosis and would overlap both Google Ads and Ecommerce PPC.

Publish these decision-stage guides instead:

- Search campaigns vs Performance Max.
- Google Shopping vs Performance Max.
- When Performance Max is appropriate for lead generation.
- How to assess Performance Max channel and search-term reporting.

## 7. Cannibalisation controls

| Page | Primary job | Must defer to |
|---|---|---|
| Google Ads | General Google Ads management, Search-led acquisition and lead generation | Ecommerce PPC for retail feeds, Shopping and catalogue economics |
| Ecommerce PPC | Retail paid search, Shopping, Merchant Center and product economics | Google Ads for general account management concepts; Meta Ads for paid social |
| Local SEO | Organic map, local pack, Business Profile and local visibility | Google Ads for paid placements and bidding |
| Ecommerce SEO | Organic catalogue discovery and indexation | Ecommerce PPC for paid product distribution |
| Shopify | Store design, development and platform delivery | Ecommerce PPC for paid acquisition management |
| Google Ads audit guide | Investigation, warning signs and buyer education | Google Ads for ongoing management |

The Ecommerce PPC page should not repeat the full Google Ads process, FAQs or account-ownership copy. It should link back to the parent service for those foundations and spend its unique depth on retail data, products and economics.

## 8. Proof and scope gates

The architecture is approved in principle, but the page should not invent retail advertising proof.

Before publication, confirm:

1. Which ecommerce Google Ads accounts CNVRT has genuinely managed.
2. Whether CNVRT has performed Merchant Center setup, diagnostics and feed work directly.
3. Whether Standard Shopping, retail Performance Max and ecommerce Search are all within the repeatable offer.
4. Whether feed remediation is included, capped or separately quoted.
5. Whether creative production for Performance Max is included or separately scoped.
6. Whether any approved case study can evidence revenue, ROAS, CPA, margin, feed improvement or product-level learning.
7. The reporting source, date range and attribution basis for every metric.

Heatons Furniture and UberKinky can support ecommerce-platform understanding, but neither should be presented as Ecommerce PPC performance proof unless the relevant Google Ads work and outcomes are confirmed.

## 9. Recommended implementation order

1. Keep `/services/google-ads/` as the current parent commercial page.
2. Finish the Meta Ads and Email Marketing pages already next in the checklist.
3. Confirm CNVRT's ecommerce PPC delivery boundary and one suitable proof record.
4. Build `/services/ecommerce-ppc/` as the only new paid-search commercial page.
5. Publish the Google Ads audit guide.
6. Publish Google Shopping vs Performance Max and the local service-business guide.
7. Use Search Console and Keyword Planner after launch to review impressions, query overlap and assisted enquiries.
8. Reconsider a Google Shopping page only after the proof and demand gates are satisfied.
9. Reconsider Local PPC only if CNVRT develops repeatable Local Services Ads, multi-location or store-goal delivery with multiple approved examples.

## 10. Final answer

Yes, Google Ads deserves one break-off page for Ecommerce PPC.

No, CNVRT does not currently need separate Local PPC, Google Shopping or Performance Max commercial pages.

The strongest architecture is a broad Google Ads parent, one retail-specific Ecommerce PPC child and focused guides for local campaigns and individual campaign-type decisions. This captures distinct buyer intent without diluting proof or creating several pages that repeat the same management service.
