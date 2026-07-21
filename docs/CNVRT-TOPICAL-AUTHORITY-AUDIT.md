# CNVRT topical authority, SEO and AEO plan

Research date: 15 July 2026  
Status: Research baseline. Route-gap findings in section 3 are superseded by the current build. Use `CNVRT-IMPLEMENTATION-CHECKLIST.md`, `CNVRT-SEO-SPECIALIST-PAGE-COMPETITOR-AUDIT.md`, `CNVRT-AEO-COMPETITOR-RESEARCH.md`, `CNVRT-GOOGLE-ADS-COMPETITOR-RESEARCH.md` and `../HANDOFF.md` for current implementation state.  
Scope: Current Astro build, live holding domain, UK and Manchester search landscape, service architecture, proof, content, internal links, entities, technical launch and measurement

## 1. Executive decision

CNVRT should build authority around one connected commercial idea:

> CNVRT connects the website, acquisition channels, retention journey, measurement and useful business tools, then works on the part currently holding growth back.

This is more credible and more distinctive than calling CNVRT a full-service, data-led or results-driven agency. Those phrases appear throughout the Manchester agency market and say very little.

The authority system should consist of:

1. One homepage that owns the broad Manchester digital marketing agency intent.
2. One substantial page for each genuine core service.
3. A small number of subservice pages only where search intent is genuinely different.
4. Detailed case studies that prove the service, sector and outcome.
5. Decision-stage guides that answer real questions before a buyer contacts an agency.
6. A truthful founder entity, clear authorship and visible evidence.
7. Internal links that connect each guide to one service and one relevant case study.

This is not a plan to publish hundreds of posts. Google explicitly recommends original, people-first content and warns against producing large volumes of loosely related search-first content. See [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## 2. Immediate launch risk

The current live domain is the most urgent SEO issue.

At the time of audit, `https://cnvrtdigital.co.uk/` returns:

- An HTML robots directive of `noindex, nofollow`
- An HTTP `x-robots-tag: noindex, nofollow`
- Holding-page HTML instead of a valid text file at `/robots.txt`
- Holding-page HTML when requesting `/sitemap.xml`
- A `200` response for URLs that should become real pages, redirects or genuine not-found responses

This is acceptable only for a short holding period. Leaving both noindex layers in place risks removing the existing CNVRT result and any remaining legacy URLs from search.

Before the main site replaces the holding page:

1. Export every historic URL from Google Search Console, GA4 landing pages, the previous sitemap, backlink tools and server or Netlify logs.
2. Decide whether each old URL is retained, merged or retired.
3. Create a one-to-one permanent redirect for every page with a relevant replacement.
4. Do not redirect unrelated old pages to the homepage.
5. Remove the HTML and HTTP-header noindex directives from the production domain.
6. Keep preview and branch deployments noindexed.
7. Serve a real `/robots.txt` and the Astro sitemap.
8. Verify the production canonical domain and trailing-slash policy.
9. Test every old URL, redirect, canonical and sitemap entry before DNS or production switching.
10. Submit the new sitemap in Google Search Console and Bing Webmaster Tools.

Google's relevant documentation: [site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [AI search eligibility](https://developers.google.com/search/docs/appearance/ai-features).

## 3. Current build audit

### What is already strong

- Static Astro output gives search engines complete HTML without depending on client-side rendering.
- Every generated route currently has one H1.
- Canonical URLs are generated consistently from the configured production domain.
- A sitemap is generated.
- The main service pages already use `Service`, `WebPage` and `BreadcrumbList` structured data.
- Service pages contain substantial visible copy, FAQs, process and related-service sections.
- The homepage links to all principal services.
- The Hear Better case study contains genuine context, decisions, confirmed metrics and a signed testimonial.
- The visual quality and case-study direction can become a genuine conversion advantage.

### Material gaps found in the build

Seven internal destinations are linked but not generated:

- `/blog/`
- `/blog/homepage-structure-that-converts/`
- `/submit-a-project/`
- `/request-an-audit/`
- `/privacy/`
- `/cookies/`
- `/accessibility/`

Additional gaps:

- There is no `/services/` hub.
- There is no truthful About or Daniel Lyons page.
- The blog cards include placeholder `#` links.
- The homepage contact form's talk link points to `#`.
- Five case studies still display `00%` placeholder outcome figures.
- Most non-Hear Better case studies contain only about 350 visible words and generic placeholder approach copy.
- Work-page titles are mainly brand-name plus “Case Study”, which misses useful service and sector context.
- Organization schema is repeated site-wide but contains only basic name, URL and email information.
- There is no author profile or `Article`/`BlogPosting` system yet.
- FAQs are visible but there is no reusable editorial or fact-review standard.
- The service template uses the same structural rhythm across every discipline. The content must provide more discipline-specific depth so pages do not feel interchangeable.

### Claims that must remain controlled

Do not publish counters such as `£5M+`, `20,000+` or `10+` until each has:

- A clear unit
- A source
- A calculation method
- A time period
- Permission to publish where client data is involved
- A short explanation beside the number

Do not publish Shopify Plus Partner, Google Partner, Klaviyo Partner or similar status unless the exact current status is true and publicly verifiable.

## 4. Search positioning and page ownership

### Homepage

Primary intent:

- Digital marketing agency Manchester

Supporting concepts:

- Growth marketing agency
- Integrated digital marketing
- Web design, ecommerce and customer acquisition
- Manchester-based, working across the UK
- Ecommerce, service businesses, local businesses and funded startups

Recommended role:

- Explain the connected-growth proposition
- Show breadth without trying to rank for every service
- Introduce proof early
- Route visitors to the relevant service, audit or project path

Do not create a near-duplicate `/digital-marketing-agency-manchester/` page while the homepage owns this intent.

### Commercial page ownership

| URL | Primary intent owned | What it must not duplicate |
|---|---|---|
| `/` | Digital marketing agency Manchester | Detailed service-page copy |
| `/services/` | All services and how they connect | Homepage positioning narrative |
| `/services/web-design/` | Web design agency Manchester, website design | Ecommerce platform and Shopify-specific depth |
| `/services/ecommerce-web-design/` | Ecommerce web design and UX | Shopify platform implementation |
| `/services/shopify/` | Shopify agency, design and development | General ecommerce design and migration risk |
| `/services/shopify-migrations/` | Migrate or replatform to Shopify | General new-store design |
| `/services/custom-web-development/` | Bespoke public-facing websites and web platforms | Internal operational software |
| `/services/custom-tools/` | Custom tools and business software | General brochure or lead-generation websites |
| `/services/seo/` | SEO agency Manchester and UK SEO services | Specialist Local, Technical or Ecommerce SEO depth |
| `/services/local-seo/` | Local SEO agency Manchester and local SEO services | Generic SEO, technical audits and generic city copy |
| `/services/technical-seo/` | Technical SEO agency, audits and implementation support | General SEO strategy and ecommerce merchandising depth |
| `/services/ecommerce-seo/` | Ecommerce SEO agency and Shopify SEO services | General Shopify design, migrations and generic SEO copy |
| `/services/aeo/` | AEO and AI search visibility | Claims that SEO is obsolete |
| `/services/google-ads/` | Google Ads and PPC management | A duplicate generic PPC page |
| `/services/ecommerce-ppc/` | Ecommerce PPC, Google Shopping and retail Performance Max | General lead-generation PPC and separate campaign-type pages |
| `/services/meta-ads/` | Facebook and Instagram advertising | Organic social management |
| `/services/email-marketing/` | Email strategy, campaigns and automation | Klaviyo-only platform depth |
| `/services/klaviyo/` | Klaviyo for Shopify and ecommerce | Generic email marketing |

### Pages to add now

1. `/services/`
2. `/about/` or `/daniel-lyons/`
3. `/blog/`
4. Reusable article pages
5. `/contact/`
6. `/submit-a-project/`
7. `/request-an-audit/`
8. Required legal pages
9. `/services/ecommerce-web-design/`
10. `/services/local-seo/`
11. `/services/technical-seo/`
12. `/services/ecommerce-seo/`

### Pages to add once proof and content are ready

1. `/services/ecommerce-ppc/`
2. `/services/klaviyo/`
3. `/industries/ecommerce/`
4. `/industries/service-businesses/`

### Pages to hold until evidence justifies them

- Conversion rate optimisation as an independent service
- Shopify app development as an independent service
- Google Shopping as an independent service before Ecommerce PPC proof and demand justify a further split
- Meta Ads for ecommerce as an independent service
- Mailchimp as an independent service
- Startups, local businesses and additional industry hubs
- Additional Manchester or Greater Manchester location pages

Local SEO, Technical SEO and Ecommerce SEO were approved as the only specialist SEO commercial pages on 16 July 2026 after a ten-agency competitor audit. Their evidence limitations remain explicit until the relevant case-study records are complete.

Ecommerce PPC was approved in principle as the only planned Google Ads specialist commercial page on 16 July 2026 after an official-product, UK result-set and ten-agency architecture audit. It remains gated by confirmation of CNVRT's Merchant Center, feed, Shopping and retail Performance Max delivery scope and at least one suitable evidence record. Local PPC, Google Shopping and Performance Max remain parent-page topics or supporting guides at the current evidence level.

Until CNVRT has repeatable proof, keep CRO and Shopify app development as strong subsections of Shopify, ecommerce or custom-tools pages.

## 5. Authority clusters

### Cluster A: Agency selection and connected growth

Commercial hub: homepage and services hub

Priority guides:

1. How much does a digital marketing agency cost in the UK?
2. Digital agency vs freelancer vs in-house marketing
3. How to choose a digital marketing agency
4. Warning signs your agency is not doing enough
5. What a digital marketing agency should report
6. How long does digital marketing take to work?
7. Should web design, SEO and paid media use the same agency?
8. What to include in a digital marketing brief
9. When is a digital marketing audit worth doing?
10. How to prioritise marketing channels when budget is limited

Distinctive CNVRT angles:

- Why channel performance is rarely isolated
- What should be fixed before spending more on traffic
- What an agency should tell you not to buy
- How to guide a founder with no internal marketing function

### Cluster B: Web design and conversion foundations

Commercial hubs: web design and ecommerce web design

Implementation status: The Ecommerce Web Design commercial page was added on 16 July 2026 after current Baymard, W3C and Google guidance and a ten-agency UK competitor review. It owns catalogue architecture, product discovery, storefront UX and responsive buying journeys without duplicating Shopify platform implementation. The approved boundary and evidence limits are recorded in `docs/CNVRT-ECOMMERCE-WEB-DESIGN-COMPETITOR-RESEARCH.md`.

Priority guides:

1. How much does a website cost in the UK?
2. How long does a website take to design and build?
3. Website redesign or complete rebuild?
4. What to include in a web-design brief
5. Bespoke website vs template website
6. Web design agency vs freelance web designer
7. Who owns the website, domain, content and code?
8. Which CMS should a growing business choose?
9. What should happen after a website launches?
10. What makes a lead-generation website convert?
11. Why a better-looking website can still produce fewer leads
12. How to design a website for a trust-sensitive service
13. What should be fixed before sending paid traffic to a new website?
14. Website SEO launch checklist
15. Mobile-first web design checklist

Proof: Hear Better and RFT Recruitment for broader web design. Heatons, UberKinky and Ya Omri for ecommerce design once their evidence and permissions are complete.

### Cluster C: Shopify, ecommerce and migrations

Commercial hubs: ecommerce web design, Shopify and Shopify migrations

Priority guides:

1. How much does a Shopify website cost in the UK?
2. Shopify theme customisation vs a custom Shopify build
3. Shopify vs WooCommerce for a UK ecommerce business
4. Shopify migration checklist for UK retailers
5. How to migrate to Shopify without losing important SEO signals
6. What data can and cannot be moved to Shopify?
7. WooCommerce to Shopify migration guide
8. Magento to Shopify migration guide
9. BigCommerce to Shopify migration guide
10. Wix or Squarespace to Shopify migration guide
11. Shopify apps vs a custom Shopify app
12. Shopify product-page CRO checklist
13. What should an ecommerce CRO audit cover?
14. Mobile merchandising for ecommerce
15. Product search, filtering and collection navigation
16. When a Shopify app is cheaper than repeated manual work
17. Designing ecommerce for considered purchases such as furniture
18. How acquisition, conversion and retention connect in Shopify

Important official sources: [Shopify migration guidance](https://help.shopify.com/en/manual/migrating-to-shopify), [Shopify app platform](https://shopify.dev/docs/apps/build), [Shopify webhooks](https://shopify.dev/docs/apps/build/webhooks), [Shopify CRO audit](https://www.shopify.com/uk/blog/ecommerce-cro-audit/).

Proof: Heatons Furniture and UberKinky. Use a migration claim only when a genuinely migrated client is confirmed.

### Cluster D: SEO and local search

Commercial hubs: SEO and later Local SEO

Priority guides:

1. How much does SEO cost in the UK?
2. How long does SEO take to work?
3. SEO vs Google Ads for a growing business
4. What is included in a professional SEO audit?
5. Local SEO checklist for service businesses
6. How Google Business Profile rankings work
7. SEO requirements for a new website
8. How to protect SEO during a website migration
9. Shopify SEO checklist
10. What topical authority means in practice
11. Internal linking for service and ecommerce websites
12. How to measure SEO by leads and revenue
13. Why a website ranks for the wrong searches
14. Should one page target several services?
15. Technical problems that stop useful content ranking

Google states that local visibility is driven mainly by relevance, distance and prominence. Business details, reviews, links and genuine local relevance all matter. See [Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en-en).

Proof: Hear Better for local SEO, content architecture and search growth.

### Cluster E: AEO and AI search visibility

Commercial hub: AEO

Priority guides:

1. AEO vs SEO: what is actually different?
2. Can an agency guarantee a ChatGPT or AI Overview mention?
3. How can a business measure AI search visibility?
4. Does schema markup improve AI visibility?
5. How do Google AI Overviews choose supporting links?
6. Why do AI platforms mention competitors but not your brand?
7. What makes content easy for answer engines to understand?
8. Brand mentions, citations and links in AI search
9. How to run an AI visibility audit
10. How local businesses can improve visibility in AI answers
11. Can AI referral traffic be measured accurately?
12. Should companies allow AI crawlers?
13. What company information should be published for AI systems?
14. AEO for ecommerce product and category content
15. How authorship and original evidence support search trust

The AEO page must explicitly state:

- AEO does not replace SEO.
- Google has no special AEO schema or separate technical requirement.
- A page must first be crawlable, indexable and eligible for a search snippet.
- AI answers vary by platform, model, prompt and time.
- Mentions and citations cannot be guaranteed.
- Monitoring requires a documented prompt set and consistent method.

This honest position is a stronger differentiator than pretending AI visibility is fully controllable. See [Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

### Cluster F: Google Ads and PPC

Commercial hubs: Google Ads, followed by Ecommerce PPC when delivery scope and proof are ready

Priority guides:

1. How much should a small business spend on Google Ads?
2. How much does Google Ads management cost in the UK?
3. Google Ads vs SEO for lead generation
4. What does a Google Ads agency do each month?
5. What is included in a Google Ads audit?
6. How tracking errors waste advertising budget
7. Search campaigns vs Performance Max
8. Google Shopping vs Performance Max
9. How negative keywords prevent wasted spend
10. Why Google Ads generate clicks but no enquiries
11. Landing-page requirements for paid search
12. How long should a Google Ads test run?
13. Why lead quality matters more than cost per lead
14. How to connect offline sales back to Google Ads
15. Should service businesses bid on branded keywords?
16. Google Ads account handover checklist
17. Common mistakes in local Google Ads campaigns

The commercial page should cover tracking, search intent, campaign architecture, landing pages, lead or revenue quality, account access and reporting. It should not read as campaign administration.

The future Ecommerce PPC page should own Merchant Center, product feeds, catalogue segmentation, Shopping, retail Performance Max, product economics and transaction-value measurement. It should not repeat the general Google Ads page or be followed immediately by separate Google Shopping and Performance Max service pages.

Local service-business campaigns remain a use case on Google Ads. Publish a guide explaining location targeting, calls, bookings, lead quality and the difference between Search, Local Services Ads and Local SEO rather than creating a thin Local PPC commercial page.

Proof: Hear Better, using the confirmed 10x paid search ROAS with source, date range and scope.

Architecture research: `docs/CNVRT-GOOGLE-ADS-SERVICE-ARCHITECTURE-AUDIT.md`.

### Cluster G: Meta Ads

Commercial hub: Meta Ads

Priority guides:

1. How much should a small business spend on Meta Ads?
2. Meta Ads agency fees in the UK
3. Meta Ads vs Google Ads
4. Boosted posts vs Ads Manager campaigns
5. Why Meta Ads get clicks but no sales
6. How Meta creative testing works
7. What is creative fatigue?
8. Meta Pixel vs Conversions API
9. Meta Ads for local lead generation
10. Meta Ads for Shopify stores
11. Instant forms vs landing-page forms
12. How to improve Meta lead quality
13. Which Meta Ads metrics matter?
14. How to calculate and interpret ROAS
15. Why landing-page message match matters
16. Retargeting after tracking changes
17. What creative assets should a client provide?
18. How often should Meta creative change?

The service should connect offer, creative, campaign structure, tracking, landing pages and commercial outcomes. Meta recommends using Conversions API alongside the Pixel where appropriate and compliant. See [Meta Conversions API](https://www.facebook.com/business/help/AboutConversionsAPI).

Proof: Heatons after data and permission are confirmed.

Research status: The Meta Ads commercial hub was rewritten on 16 July 2026 after a current official-platform review and a ten-agency UK competitor audit. The approved service boundary, creative-production exclusions, account-ownership position and remaining proof requirements are recorded in `docs/CNVRT-META-ADS-COMPETITOR-RESEARCH.md`.

### Cluster H: Email, retention and Klaviyo

Commercial hub: email marketing

Architecture decision: Do not add a standalone Klaviyo page yet. The current Email Marketing hub owns campaigns, lifecycle flows, segmentation, list growth, deliverability and platform selection. Reconsider `/services/klaviyo/` only after verified Heatons evidence, another documented Klaviyo delivery example and enough platform depth or current partner status make it materially distinct.

Research status: The Email Marketing hub was rewritten on 16 July 2026 after current Klaviyo and Mailchimp guidance and a ten-agency UK competitor audit. The approved service boundary, platform position, attribution safeguards and remaining evidence requirements are recorded in `docs/CNVRT-EMAIL-MARKETING-COMPETITOR-RESEARCH.md`.

Priority guides:

1. Klaviyo vs Mailchimp for ecommerce
2. When should a Shopify store move to Klaviyo?
3. Essential Klaviyo flows for Shopify stores
4. Campaigns vs flows in Klaviyo
5. Browse abandonment vs cart abandonment
6. How to build a useful welcome series
7. Post-purchase email strategy for ecommerce
8. Win-back and re-engagement flows
9. How list cleaning protects deliverability
10. What is a sunset flow?
11. SPF, DKIM and DMARC for marketing email
12. How to measure email marketing revenue
13. Why open rate is not enough
14. How behavioural segmentation works
15. Mailchimp to Klaviyo migration checklist
16. How often should ecommerce brands send campaigns?
17. How email supports Meta and Google Ads
18. Mobile-first email design checklist
19. Ecommerce email audit checklist
20. Improving repeat purchase with lifecycle email

The page separates strategy, campaigns, flows, segmentation, list growth, deliverability, migration, creative and commercial reporting. Migration, additional messaging channels, transactional communications and complex custom integration are separately scoped.

Proof: Heatons is used qualitatively until performance records, the reporting period, attribution basis and Tony Keigher's approval are complete.

### Cluster I: Custom development, tools and business software

Commercial hubs: custom web development and custom tools

Priority guides:

1. When does a business need bespoke software?
2. Custom software vs off-the-shelf software
3. When spreadsheets become an operational risk
4. How much does bespoke business software cost?
5. How long does custom software take to build?
6. How to scope a web application
7. What is a useful MVP?
8. Who owns custom software source code?
9. How should customer and staff data be protected?
10. Can custom software integrate with Xero, Stripe or a CRM?
11. What maintenance does a web application need?
12. How to map a manual process before building software
13. How to choose what to automate first
14. Booking system build vs existing platform
15. Bespoke CRM vs configurable CRM
16. Building staff portals and intranets
17. Calculators and configurators as lead-generation tools
18. How competition websites manage entries, payments and winners

Position the service around value rather than a technology list:

- Saving staff time
- Reducing repeated entry and errors
- Connecting disconnected systems
- Improving response times and visibility
- Creating useful customer-facing functionality
- Removing operational bottlenecks

Proof: TopDraw, UberKinky and any real booking, lead-management or product-upload tools.

## 6. Case studies as authority assets

Every case study should contain:

1. Client, sector and date.
2. Starting position.
3. Commercial constraint.
4. Research and strategic direction.
5. Work actually delivered.
6. Why important decisions were made.
7. Outcome with baseline, date range and source.
8. Signed client quote.
9. Contextual links to the exact services delivered.
10. Links to one or two related guides.
11. A next project or qualification-led CTA.

| Case study | Authority contribution | Current state |
|---|---|---|
| Hear Better | Startup launch, healthcare, web design, local SEO, AEO, Google Ads | Strongest and closest to complete |
| Heatons Furniture | Shopify, ecommerce, Meta Ads, email retention | Needs verified metrics and deeper narrative |
| UberKinky | Custom Shopify, catalogue UX, CRO | Needs verified outcomes and implementation detail |
| TopDraw | Competition platform, custom functionality, ecommerce | Needs system and workflow depth |
| RFT Recruitment | Service-business web design and lead generation | Needs outcomes, testimonial and detailed process |
| Ya Omri | Shopify, luxury ecommerce and visual design | Needs commercial context and outcomes |

Remove all `00%` figures before production launch. If a metric is unavailable, use a qualitative verified outcome instead of a fake-looking placeholder.

## 7. Internal linking rules

Every important page must be linked from at least one other crawlable page. Google recommends descriptive internal anchors and a logical structure. See [Google's link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

Rules:

1. Every guide links to one primary service, one adjacent guide and one relevant case study.
2. Every service page links to two to four genuinely useful guides.
3. Every case study links contextually to the services actually delivered.
4. Related services should be limited to the closest next constraints.
5. Use descriptive anchors such as `Shopify migration planning`, not `learn more`.
6. Add contextual links inside body copy rather than relying only on cards at the bottom.
7. Do not link every article to every service.
8. Do not produce two pages for the same intent simply to create more URLs.

Recommended relationship model:

```text
Homepage
├── Services hub
│   ├── Web design
│   │   ├── Ecommerce web design
│   │   │   ├── Shopify
│   │   │   │   ├── Shopify migrations
│   │   │   │   ├── Email marketing
│   │   │   │   └── Custom tools / Shopify apps
│   │   │   └── Ecommerce case studies
│   │   └── Custom web development
│   │       └── Custom tools and business software
│   ├── SEO
│   │   ├── Local SEO
│   │   └── AEO
│   ├── Google Ads
│   ├── Meta Ads
│   └── Email marketing
├── Work hub
├── Blog hub
├── About / Daniel Lyons
├── Submit a project
└── Request an audit
```

## 8. Trust, authorship and entity plan

The site must make Daniel visible without pretending CNVRT is a larger team.

Create a truthful About or founder page containing:

- Daniel Lyons as owner of CNVRT
- What he leads and where specialist support may be used, if applicable
- Relevant years, projects, platforms and sectors, only when verified
- The operating philosophy and why CNVRT exists
- Links to real professional profiles
- Contact information
- Selected projects and signed testimonials

For every guide:

- Show a named author
- Link the byline to the author profile
- Include published and meaningfully reviewed dates
- Cite original and official sources
- Include first-hand observations or project examples
- Explain limitations and who the advice is for
- Use `Article` or `BlogPosting` schema with author, publisher, dates and high-resolution images

Google recommends clear authorship and author profile URLs for article content. See [Google Article schema guidance](https://developers.google.com/search/docs/appearance/structured-data/article).

Organization schema should be richer and primarily attached to the homepage or About page. Add only accurate properties such as logo, legal name, contact details, address if publishable, founder and `sameAs` profiles. See [Google Organization schema guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).

Do not add self-serving review schema around CNVRT testimonials to try to obtain stars.

## 9. Manchester authority

Use the homepage as the principal Manchester digital marketing agency page. The web-design and SEO pages can own their own Manchester service intents without creating duplicate location pages.

Actions:

1. Keep the business name, Manchester description and contact details consistent.
2. Add genuine Manchester and North West work where available.
3. Build local mentions through relevant client, supplier and industry relationships.
4. Assess suitable membership or profile opportunities such as Manchester Digital, Prolific North and the Manchester Publicity Association.
5. Do not create pages for every Greater Manchester town by substituting place names.
6. Only create or modify a Google Business Profile if CNVRT meets Google's real-world eligibility rules.

Potential sources: [Manchester Digital membership](https://www.manchesterdigital.com/membership-benefits), [Prolific North Profiles](https://www.prolificnorth.co.uk/prolific-profiles/), [MPA membership](https://www.mpa.org.uk/join/), [Google Business Profile eligibility](https://support.google.com/business/answer/13763036?hl=en).

## 10. Content production standard

Every commercial page should include:

- A single intent-aligned H1
- A plain-English definition
- Who it is and is not for
- Problems it solves
- Work included
- Client inputs and dependencies
- Process
- Realistic timing and investment guidance
- How performance is measured
- A relevant case study
- Verified proof
- Limitations and non-guarantees
- Buying-objection FAQs
- Related guides and services
- One clear next action

Every guide should include:

- A direct answer near the start
- A clear audience and decision context
- Original CNVRT insight
- Relevant project evidence
- Balanced alternatives and limitations
- Dates for time-sensitive platform guidance
- Links to official sources
- A named author and reviewed date
- An original visual, checklist, table, template or worked example
- A CTA matching the reader's intent

Do not publish:

- Generic “ten benefits of” articles
- Rewritten platform documentation
- Unsupported statistics
- Thin city doorway pages
- Guaranteed rankings, ROAS or AI mentions
- Migration claims such as zero SEO loss
- Long technology lists without business meaning
- Multiple pages targeting the same broad phrase

## 11. 90-day action plan

### Phase 0: data and launch protection, before production switch

- Export historic URLs, Search Console data and top landing pages.
- Build and test the redirect map.
- Remove production noindex at the correct launch moment.
- Restore valid robots and sitemap responses.
- Keep previews noindexed.
- Remove fake metrics and dead links.
- Confirm analytics, consent, call, form and booking tracking.
- Verify title, H1, canonical, status code and indexability for every route.

### Weeks 1 to 2: information architecture and proof

- Lock the query-to-page map.
- Add services, About, blog, contact, audit and project-submission routes.
- Decide the exact wording and boundary of each service.
- Create the case-study evidence register.
- Validate every partnership and numeric claim.
- Establish reusable service, article and case-study content models.
- Create author and Organization entities.

### Weeks 3 to 5: commercial foundation

- Finalise homepage positioning.
- Rewrite all existing service pages from the research and owner answers.
- Review the implemented Ecommerce Web Design page as final project evidence is approved.
- Reposition Custom Tools as Custom tools and business software.
- Strengthen Hear Better and the next two best case studies.
- Add contextual service links from case studies.
- Add service-specific proof, FAQs and limitations.
- Complete all conversion routes and legal pages.

### Weeks 6 to 8: first authority layer

Publish the first eight decision-stage guides:

1. Website cost in the UK
2. Website redesign vs rebuild
3. Shopify website cost
4. Shopify migration checklist
5. SEO cost in the UK
6. AEO vs SEO
7. Google Ads audit guide
8. Klaviyo vs Mailchimp

Also:

- Create a web-design brief template.
- Create a Shopify migration checklist.
- Create a Google Ads tracking checklist.
- Link each asset to a service and a case study.

### Weeks 9 to 12: depth and feedback

- Publish four additional guides selected from actual Search Console and sales questions.
- Complete the remaining case studies.
- Improve the approved Local, Technical and Ecommerce SEO pages as evidence records are completed.
- Add a Klaviyo page only if the content, platform status and proof are ready.
- Build ecommerce and service-business sector hubs only if each has multiple projects and unique insight.
- Review indexing, impressions, click-through rate and assisted enquiries by cluster.
- Improve pages earning impressions but weak engagement.
- Consolidate any pages beginning to compete with each other.
- Start targeted local and industry outreach around verified project results.

### Sustainable cadence after 90 days

- Two strong guides per month
- One case-study or original proof improvement per month
- One meaningful commercial-page refresh per month
- Quarterly pricing, platform and migration reviews
- Quarterly internal-link and content-decay review

## 12. Measurement

Track performance by cluster and commercial outcome.

SEO and content:

- Indexed canonical pages
- Non-brand impressions and clicks by topic cluster
- Principal commercial-page visibility
- Internal-link coverage
- Organic landing-page conversions
- Assisted enquiries from guides and case studies
- Branded search growth
- Audit, call and project-form completion

Local:

- Google Business Profile actions if eligible
- Local organic landing-page conversions
- Review growth and response rate
- Genuine Manchester citation consistency

AEO:

- Direct AI referral traffic where identifiable
- Brand mention rate across an agreed prompt set
- Citation rate and cited source URLs
- Accuracy and sentiment of responses
- Prompt coverage by buyer stage
- Downstream enquiries

Do not collapse these into an unexplained “AI visibility score”.

Paid and email proof:

- Define revenue, leads, qualified leads, CPA, ROAS and attribution method
- Record date ranges and data sources
- Separate platform-reported results from verified business outcomes
- Note which parts CNVRT controlled

## 13. Required inputs before final keyword prioritisation

This research deliberately does not invent volume or difficulty. To turn the qualitative plan into a quantified keyword forecast, collect:

- Google Search Console query and page exports for at least 16 months where available
- GA4 organic landing-page and conversion exports
- The complete historic URL list
- Semrush or Ahrefs UK keyword exports for CNVRT and selected competitors
- Google Ads search-term data where permission exists
- Internal sales questions and objections
- Client proof and metric sources
- Exact partnership statuses
- Geographic business and Google Business Profile eligibility details

The final keyword sheet should record query family, intent, target page, current position, impressions, clicks, estimated demand from the chosen tool, business value, evidence required and implementation priority.

## 14. Research references and competitor observations

Representative competitors reviewed:

- [First Internet](https://www.firstinternet.co.uk/)
- [OwnYourSpace](https://ownyourspace.com/)
- [Return](https://return.co/)
- [Splitpixel Manchester](https://www.splitpixel.co.uk/manchester-digital-agency/)
- [Create8](https://www.create8.co.uk/)
- [MadeByShape](https://madebyshape.co.uk/)
- [Influx Digital](https://www.influxdigital.com/)
- [DomiSearch](https://www.domisearch.com/)
- [Tilio](https://www.tilio.co.uk/)
- [Found AEO](https://www.found.co.uk/services/seo/ai-seo/aeo/)
- [The SEO Works Manchester](https://www.seoworks.co.uk/locations/manchester-seo/)
- [Pivot Growth](https://www.pivotgrowth.co.uk/)
- [Aware Digital Klaviyo](https://www.awaredigital.co.uk/klaviyo-email-marketing-agency)
- [OLXR](https://olxr.co.uk/)

Official guidance used:

- [Google people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google internal links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google Organization schema](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Article schema](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google local rankings](https://support.google.com/business/answer/7091?hl=en-en)
- [Bing sitemaps and AI search](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)
- [Bing AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [Shopify migration guidance](https://help.shopify.com/en/manual/migrating-to-shopify)
- [Shopify app development](https://shopify.dev/docs/apps/build)

## 15. Decisions made

- The homepage owns Manchester digital marketing agency intent.
- Web design remains the most important specialist service but does not dominate homepage search intent.
- Shopify and ecommerce authority will be preserved and expanded.
- SEO and AEO remain separate commercial pages because their buyer language differs, while the content truthfully explains their shared foundation.
- Google Ads is the PPC page. A duplicate generic PPC service page is not planned.
- Custom web development and internal business software are separate intents.
- Ecommerce Web Design is implemented as a distinct customer-experience page, separated from Shopify platform delivery.
- Local SEO, Technical SEO and Ecommerce SEO were approved and implemented as the only current specialist SEO commercial pages after a ten-agency audit.
- Klaviyo remains the first candidate platform-specific retention page.
- CRO and Shopify app development remain sections until proof warrants independent pages.
- Case studies are core authority assets, not decorative portfolio pages.
- No large-scale blog production begins until commercial pages, proof, entities and internal links are ready.
