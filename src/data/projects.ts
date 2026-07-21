import hearBetter from '@/assets/hear-better-home-test-landscape.png';
import hearBetterPortrait from '@/assets/hear-better-home-test-portrait.png';
import heatons from '@/assets/heatons.jpg';
import heatonsOutcome from '@/assets/heatons-outcome-landscape.png';
import heatonsOutcomePortrait from '@/assets/heatons-outcome-portrait.png';
import uberKinky from '@/assets/uberkinky.jpg';
import rftRecruitment from '@/assets/rft-recruitment.jpg';
import topDraw from '@/assets/topdraw.jpg';
import rftRecruitmentOutcome from '@/assets/rft-recruitment-outcome-landscape.png';
import rftRecruitmentOutcomePortrait from '@/assets/rft-recruitment-outcome-portrait.png';
import topDrawPrizeCar from '@/assets/topdraw-prize-car-landscape.png';
import topDrawPrizeCarPortrait from '@/assets/topdraw-prize-car-portrait.png';
import yaOmri from '@/assets/ya-omri-shopify.jpg';

type ProjectMetric = readonly [value: string, label: string];
type ProjectFact = readonly [label: string, value: string, icon: 'calendar' | 'duration' | 'relationship' | 'location'];
type ProjectApproach = Readonly<{ title: string; description: string }>;

export interface Project {
  number: string;
  slug: string;
  name: string;
  sector: string;
  scope: string;
  image: ImageMetadata;
  alt: string;
  coverImage?: ImageMetadata;
  coverPortraitImage?: ImageMetadata;
  coverAlt?: string;
  summary: string;
  situation?: string;
  challenge: string;
  direction: string;
  overviewHeadings?: Readonly<{ situation?: readonly string[]; challenge: readonly string[]; direction: readonly string[] }>;
  services: readonly string[];
  metrics: readonly ProjectMetric[];
  facts?: readonly ProjectFact[];
  approach?: readonly ProjectApproach[];
  resultsNote?: string;
  metricsConfirmed?: boolean;
  testimonial?: Readonly<{ quote: readonly string[]; name: string; role: string; placeholder?: boolean }>;
}

export const projects: readonly Project[] = [
  {
    number: '01',
    slug: 'hear-better',
    name: 'Hear Better',
    sector: 'Private audiology',
    scope: 'Brand + growth partnership',
    image: hearBetter,
    alt: 'Representative Hear Better home hearing assessment with a mobile audiologist',
    coverPortraitImage: hearBetterPortrait,
    summary: 'Launching an independent mobile audiology brand, then building the website, search visibility and paid acquisition system behind its growth across the North East.',
    situation: 'Hear Better began as a mobile audiology startup with a name, specialist clinical knowledge and a clear ambition. It had no established identity, website, search presence or digital acquisition system.',
    challenge: 'The business needed to earn trust from day one while competing with Boots, Specsavers and other national providers with established recognition, search visibility and much larger advertising budgets.',
    direction: 'CNVRT created the brand, lead-generation website and growth strategy around clinical credibility and local relevance, then connected SEO, AEO and PPC management into one measurable acquisition system.',
    overviewHeadings: {
      situation: ['An audiology startup', 'with a name and', 'specialist expertise.'],
      challenge: ['Launching credibly', 'against established', 'national brands.'],
      direction: ['Building the brand,', 'website and growth', 'system together.'],
    },
    services: ['Brand strategy', 'Visual identity', 'Website strategy', 'UX and UI design', 'Custom development', 'SEO and AEO', 'Google Ads', 'Ongoing growth'],
    metrics: [['10×', 'Paid search return on ad spend'], ['2×', 'Organic keyword footprint month on month'], ['40+', 'Five-star Google reviews supporting trust']],
    metricsConfirmed: true,
    resultsNote: 'Current performance snapshot supplied by Hear Better, showing the early momentum of the ongoing growth programme.',
    facts: [
      ['Launched', 'March 2026', 'calendar'],
      ['Initial delivery', 'Six weeks', 'duration'],
      ['Relationship', 'Ongoing growth partner', 'relationship'],
      ['Coverage', 'North East', 'location'],
    ],
    approach: [
      { title: 'Research and positioning', description: 'Competitor, audience and search research shaped a position built around independent advice, home appointments and a calmer alternative to national clinic chains.' },
      { title: 'Brand identity', description: 'A complete identity was developed from the name alone, using a modern but reassuring palette and typography chosen to remain clear and approachable for an older audience.' },
      { title: 'Lead-generation website', description: 'The website balances clear conversion routes with the depth of information people need before trusting a healthcare provider with their own care or a family member.' },
      { title: 'Local SEO', description: 'Service and location architecture builds relevance across Newcastle, Sunderland, Durham, Darlington, Middlesbrough and the wider North East coverage area.' },
      { title: 'Authority and AEO', description: 'Clinically reviewed service content, practical guides, structured answers and clear trust signals help Hear Better demonstrate expertise in search and AI-led discovery.' },
      { title: 'Paid growth', description: 'Google Ads capture high-intent local demand while ongoing landing-page, tracking and campaign work turns paid traffic into a controlled lead-generation channel.' },
    ],
    testimonial: {
      quote: [
        'When I started Hear Better, I knew audiology but had very little experience with branding, websites or digital marketing. CNVRT took the time to understand what I wanted to build, the people we needed to reach and the companies we would be competing with. They created the brand and website, helped me launch the business and now manage our SEO, AEO, paid advertising and ongoing growth.',
        'We are already appearing alongside much bigger national companies in local searches, bringing in a steady flow of enquiries and achieving a 10× return on ad spend through paid search. Having CNVRT there to explain everything and guide me through each stage has made a huge difference. Hear Better would not be where it is today without their support.',
      ],
      name: 'Liam Hobson',
      role: 'Founder, Hear Better',
    },
  },
  {
    number: '02',
    slug: 'heatons-furniture',
    name: 'Heatons Furniture',
    sector: 'Furniture retail',
    scope: 'Growth partnership · 2023–2025',
    image: heatons,
    alt: 'Heatons Furniture Shopify ecommerce store',
    coverImage: heatonsOutcome,
    coverPortraitImage: heatonsOutcomePortrait,
    coverAlt: 'Representative couple relaxing together on a comfortable corner sofa in a warm living room',
    summary: 'Turning a local Manchester furniture outlet into a national ecommerce brand through a rebrand, custom Shopify store and connected acquisition strategy.',
    situation: 'Heatons Furniture was a locally run Manchester outlet selling high-ticket furniture from a small showroom. Despite offering strong value against high-street retailers, the business depended almost entirely on local footfall and generated only sporadic online sales.',
    challenge: 'The brand and digital presence did not reflect the quality or value of products often priced above £1,000. There was no effective ecommerce system, dependable tracking, email audience or search strategy, while paid activity consisted largely of untracked boosted Facebook posts.',
    direction: 'CNVRT repositioned the business, created its first purpose-built Shopify ecommerce store and connected brand, Meta Ads, SEO, Klaviyo and measurement into one growth system designed to generate national demand and support showroom sales.',
    overviewHeadings: {
      situation: ['A local furniture outlet', 'with national', 'growth ambitions.'],
      challenge: ['High-value products', 'without the digital system', 'to sell them effectively.'],
      direction: ['Rebuild the brand,', 'commerce and marketing', 'around measurable growth.'],
    },
    services: ['Brand strategy', 'Visual identity', 'Custom Shopify store', 'Conversion-focused design', 'Meta Ads', 'SEO and content', 'Klaviyo automation', 'Analytics and reporting'],
    metrics: [['£480K', 'Online revenue generated in the first 12 months'], ['£1.9M', 'Total online and showroom revenue in 12 months'], ['9.6×', 'Meta Ads return on ad spend']],
    metricsConfirmed: true,
    resultsNote: 'First 12-month performance figures supplied by CNVRT for the 2023–2025 growth partnership. Final publication remains subject to source records and client approval.',
    facts: [
      ['Partnership', '2023–2025', 'calendar'],
      ['First-year online revenue', '£480,000', 'relationship'],
      ['Total first-year revenue', '£1.9 million', 'relationship'],
      ['Location', 'Manchester', 'location'],
    ],
    approach: [
      { title: 'Rebrand and positioning', description: 'A new identity, colour system, typography and graphic direction gave the retailer a consistent national-facing brand while keeping its value-led outlet proposition clear.' },
      { title: 'Custom Shopify store', description: 'CNVRT designed and built Heatons’ first purpose-built Shopify ecommerce experience around considered, high-ticket purchases, clearer product presentation and conversion-focused customer journeys.' },
      { title: 'Meta Ads system', description: 'Untracked boosted posts were replaced by structured campaigns with purpose-made creative, audience targeting and pixel tracking. Spend was scaled from around £1,000 to £28,000 per month while reporting a 9.6× return.' },
      { title: 'SEO and content', description: 'Technical optimisation and search-led content grew the number of ranking keywords from 232 to more than 6,000, a reported visibility increase of 2,709%, while monthly website visits reached more than 60,000.' },
      { title: 'Klaviyo retention', description: 'An email audience was built from zero to more than 20,000 subscribers. Automated Klaviyo journeys supported lead nurturing, abandoned-cart recovery and repeat purchasing.' },
      { title: 'Measurement and optimisation', description: 'Analytics and reporting connected ecommerce, advertising and customer behaviour, supporting ongoing creative testing, campaign optimisation and more confident investment decisions.' },
    ],
    testimonial: {
      quote: [
        'Before working with CNVRT, Heatons Furniture was mainly reliant on local showroom footfall and we had no effective way to grow the business online. They completely repositioned the brand, created our Shopify store and built the marketing system around it.',
        'The change has been transformational. We have reached customers across the country, generated significant online and showroom growth and moved into a 20,000 sq. ft. warehouse to support the demand. CNVRT has become a genuine growth partner to the business, bringing the website, advertising, SEO and email marketing together with a clear focus on commercial results.',
      ],
      name: 'Tony Keigher',
      role: 'Director, Heatons Furniture',
      placeholder: true,
    },
  },
  {
    number: '03',
    slug: 'uberkinky',
    name: 'UberKinky',
    sector: 'Specialist ecommerce',
    scope: 'Shopline to Shopify Plus',
    image: uberKinky,
    alt: 'UberKinky Shopify homepage and product catalogue',
    summary: 'Replatforming a specialist retailer from Shopline to Shopify Plus with a custom theme, product builders and catalogue architecture built around customer discovery.',
    situation: 'UberKinky was trading through a legacy Shopline store with around 10,000 products. Catalogue data was inconsistent and important attributes such as colour and fabric were missing or unreliable, making migration and product discovery substantially more complex than a standard platform move.',
    challenge: 'Move the complete catalogue without carrying the legacy structure into the new store. Products needed dependable data, correct collection membership and clear routes through a specialist range, while redirects, analytics, advertising tracking, payments and third-party systems had to be ready for launch.',
    direction: 'CNVRT designed and built a custom Shopify Plus theme, cleaned and imported the catalogue, created 200 targeted collections and configured the required app and integration stack from day one. The migration launched with redirects in place and a more scalable foundation for trading and growth.',
    overviewHeadings: {
      situation: ['A large catalogue', 'held back by', 'legacy product data.'],
      challenge: ['Move the store', 'without importing', 'the old limitations.'],
      direction: ['Rebuild the catalogue', 'and storefront around', 'how customers shop.'],
    },
    services: ['Shopify Plus', 'Custom theme design', 'Theme development', 'Product builders', 'Catalogue migration', 'Collection architecture', 'Payment integration', 'Analytics and tracking'],
    metrics: [['10,000', 'Products imported from Shopline'], ['200', 'Targeted collections created'], ['May 2025', 'Shopify Plus store launched']],
    metricsConfirmed: true,
    resultsNote: 'Confirmed project-delivery facts. Sales increased after launch and ranking disruption was mitigated, but comparative figures and measurement periods still require evidence before publication.',
    facts: [
      ['Launched', 'May 2025', 'calendar'],
      ['Source platform', 'Shopline', 'relationship'],
      ['Destination', 'Shopify Plus', 'relationship'],
      ['Catalogue', 'Around 10,000 products', 'duration'],
    ],
    approach: [
      { title: 'Complete experience design', description: 'The storefront was designed around the brand, specialist catalogue and required customer journeys rather than adapting the legacy Shopline experience to a generic theme.' },
      { title: 'Custom Shopify Plus theme', description: 'CNVRT developed the approved designs as a custom Shopify theme built to specification, including reusable storefront sections and the required supporting graphics.' },
      { title: 'Catalogue recovery and migration', description: 'Around 10,000 products were imported from Shopline. Legacy data was reviewed and restructured where missing or inconsistent attributes such as colour and fabric prevented reliable organisation.' },
      { title: 'Collection architecture', description: 'Two hundred targeted collections were created around relevant search intent and usable browsing paths. Products were sorted to populate the correct collections and help customers reach suitable items faster.' },
      { title: 'Custom product builders', description: 'Custom product-building journeys were implemented for purchases that required more guided choices than a standard Shopify product page could provide.' },
      { title: 'Payments, analytics and advertising', description: 'Payment processing, analytics and Google Ads tracking were integrated and validated as part of the launch setup rather than added after the store went live.' },
      { title: 'Third-party integrations', description: 'The launch-ready app stack included Trustpilot, Salesfire and the other agreed services needed to support trust, merchandising and daily trading from day one.' },
      { title: 'SEO-conscious launch', description: 'Redirects and the new collection structure were installed for launch to reduce avoidable search disruption while giving the store a more scalable organic foundation.' },
    ],
    testimonial: {
      quote: [
        'CNVRT managed a complex move from Shopline to Shopify Plus, rebuilding the storefront around a large and difficult catalogue while keeping the project focused on how customers actually find and buy products.',
        'The custom theme, product builders, collection structure and complete launch setup gave us a much stronger platform for daily trading and future growth. The migration was handled carefully, and the new store has given the business a more scalable ecommerce foundation.',
      ],
      name: 'Richard Tropez',
      role: 'Group General Manager',
      placeholder: true,
    },
  },
  {
    number: '04',
    slug: 'rft-recruitment',
    name: 'RFT Recruitment',
    sector: 'Recruitment',
    scope: 'Brand + custom recruitment platform',
    image: rftRecruitment,
    alt: 'RFT Recruitment lead-generation website and custom CRM',
    coverImage: rftRecruitmentOutcome,
    coverPortraitImage: rftRecruitmentOutcomePortrait,
    coverAlt: 'Representative professional women greeting one another in a modern Manchester office',
    summary: 'Creating RFT Recruitment\'s brand, high-performance dual-audience website and custom CRM for employer leads, candidates, CV uploads and structured data.',
    situation: 'RFT Recruitment was an active agency without a website or established digital brand. Client relationships and candidate activity existed, but there was no owned platform for presenting sector expertise, generating enquiries or organising incoming candidate data.',
    challenge: 'One experience needed to appeal to two audiences with different goals. Employers had to understand the sectors covered and start a hiring conversation quickly, while candidates needed a clear route to upload a CV, share relevant information and enter a structured recruitment database.',
    direction: 'CNVRT created the complete identity, designed a sleek light-and-dark website and built the lead-generation journeys around clear client and candidate actions. A custom CRM connects forms, CV uploads, lead management and categorisation behind the public experience.',
    overviewHeadings: {
      situation: ['An active recruiter', 'without an owned', 'digital platform.'],
      challenge: ['One brand and system', 'for clients and', 'candidates alike.'],
      direction: ['Connect a fast website', 'to custom recruitment', 'and lead management.'],
    },
    services: ['Brand strategy', 'Visual identity', 'Website strategy', 'UX and UI design', 'Custom development', 'Custom CRM', 'CV upload and database', 'SEO foundations'],
    metrics: [['May 2026', 'Brand, website and CRM delivered'], ['2 audiences', 'Dedicated client and candidate journeys'], ['1 system', 'Leads, CVs and categorisation connected']],
    metricsConfirmed: true,
    resultsNote: 'Confirmed delivery facts from May 2026. Lead, application and search-performance results will be added after an approved reporting period.',
    facts: [
      ['Delivered', 'May 2026', 'calendar'],
      ['Starting point', 'Active business, no website', 'relationship'],
      ['Platform', 'Custom website and CRM', 'relationship'],
      ['Focus', 'Clients and candidates', 'duration'],
    ],
    approach: [
      { title: 'Complete brand identity', description: 'CNVRT created the RFT identity and a confident visual system designed to feel contemporary, capable and credible across both employer and candidate communications.' },
      { title: 'Dual-audience UX', description: 'Client and candidate journeys are separated through clear calls to action, tailored forms and relevant content while remaining part of one coherent recruitment brand.' },
      { title: 'Lead-generation website', description: 'Sector pages, enquiry routes, booking forms and repeated decision points turn the public site into an active business-development tool rather than a passive company profile.' },
      { title: 'Custom recruitment CRM', description: 'A purpose-built CRM gives the team a central system for managing employer leads, candidate submissions, follow-up activity and the information created through the website.' },
      { title: 'CV upload and database', description: 'Candidate forms accept CV uploads and structured information, creating searchable records that can be categorised for more practical matching and future contact.' },
      { title: 'Sector categorisation', description: 'Candidate and lead records can be organised around the agency’s principal sectors, keeping the public proposition and internal workflow aligned.' },
      { title: 'Light and dark design system', description: 'The interface moves between light and dark compositions to give the site a sleek editorial rhythm while preserving clarity around forms, content and conversion actions.' },
      { title: 'Performance and SEO foundations', description: 'The site was engineered for speed with a crawlable content structure, clean sector architecture and the technical foundations required for future organic growth.' },
    ],
    testimonial: {
      quote: [
        'RFT was already operating as a recruitment business, but we had no website, established digital brand or central system for managing the enquiries and candidate information coming into the company. CNVRT understood that these pieces needed to be designed together.',
        'They created the full brand, built a fast and professional website for both clients and candidates and developed a custom CRM around the way we work. We now have clear lead-generation journeys, CV uploads and a structured database behind the site, giving us a much stronger foundation for managing relationships and growing the business.',
      ],
      name: 'Martyna Dudek',
      role: 'Director, RFT Recruitment',
      placeholder: true,
    },
  },
  {
    number: '05',
    slug: 'topdraw',
    name: 'TopDraw',
    sector: 'Online competitions',
    scope: 'Custom platform · June 2026',
    image: topDraw,
    alt: 'TopDraw competition platform and winner experience',
    coverImage: topDrawPrizeCar,
    coverPortraitImage: topDrawPrizeCarPortrait,
    coverAlt: 'Representative blue sports car presented as a competition prize with a satin bow',
    summary: 'Creating TopDraw\'s brand and self-hosted competition platform around complex entry, ecommerce, customer account and administration logic.',
    situation: 'TopDraw began as a startup concept rather than an existing digital product. The founders needed the brand, customer proposition and complete technology behind a UK prize-competition business to be designed as one connected system.',
    challenge: 'The platform had to make entering feel fast and exciting while reliably controlling ticket availability, multi-buy baskets, payments, discounts, wallet credit, loyalty points, winner records and customer accounts. The same system also needed responsible-play safeguards, help content and practical administration tools for the team running every competition.',
    direction: 'CNVRT created the identity, customer journeys, interface, database and application logic as a custom self-hosted platform. Customer-facing commerce and member features were connected directly to a purpose-built competition administration system rather than assembled from a generic ecommerce stack.',
    overviewHeadings: {
      situation: ['A startup idea', 'requiring an entire', 'digital business.'],
      challenge: ['Complex competition', 'and commerce logic', 'behind a simple journey.'],
      direction: ['Design and engineer', 'the complete platform', 'from the ground up.'],
    },
    services: ['Brand strategy', 'Visual identity', 'Product and UX design', 'Custom development', 'Competition engine', 'Ecommerce and payments', 'Member accounts', 'Admin platform'],
    metrics: [['June 2026', 'Custom competition platform launched'], ['100%', 'Purpose-built and self-hosted system'], ['1 platform', 'Customer, commerce and admin logic connected']],
    metricsConfirmed: true,
    resultsNote: 'Confirmed product-delivery facts from the June 2026 launch. Commercial performance metrics will be added after a meaningful reporting period and client approval.',
    facts: [
      ['Launched', 'June 2026', 'calendar'],
      ['Business stage', 'Startup', 'relationship'],
      ['Platform', 'Custom and self-hosted', 'relationship'],
      ['Delivery', 'Brand through engineering', 'duration'],
    ],
    approach: [
      { title: 'Brand and product direction', description: 'CNVRT created the TopDraw identity and translated the startup proposition into a clear product experience built around excitement, transparency and responsible participation.' },
      { title: 'Competition engine', description: 'Purpose-built competition logic manages entry caps, ticket allocation, closing states, prize alternatives, competition status and the records required to operate repeatable draws.' },
      { title: 'Multi-competition commerce', description: 'Customers can select multiple ticket quantities, build a basket across live prizes and complete one connected checkout rather than repeating the purchase journey for every competition.' },
      { title: 'Wallet, discounts and loyalty', description: 'Discount logic, wallet credit and loyalty points were engineered into the account and checkout system so incentives remain connected to customer balances, purchases and platform rules.' },
      { title: 'Member account system', description: 'The customer panel brings entries, ticket numbers, order information, wallet activity, loyalty and account controls into one secure member experience.' },
      { title: 'Responsible-play controls', description: 'Age and eligibility messaging, free postal entry information, member self-exclusion and account restrictions were considered as functional requirements rather than peripheral legal copy.' },
      { title: 'Competition administration', description: 'A custom admin system gives the TopDraw team control over competitions, prizes, ticket inventory, discounts, customer records, entries, winners and the operational workflow behind each draw.' },
      { title: 'Database and application logic', description: 'CNVRT designed the underlying data model and application logic needed to keep customer, transaction, ticket, competition and administrative records connected on a self-hosted platform.' },
    ],
    testimonial: {
      quote: [
        'We came to CNVRT with an idea for TopDraw and a long list of complex requirements, but no existing platform or off-the-shelf system capable of bringing everything together. They created the brand, designed the complete customer journey and engineered the technology behind the business from the ground up.',
        'The result is far more than a website. We have our own competition, ecommerce, member and administration platform, with the flexibility to manage tickets, payments, promotions, wallet credit, loyalty, winners and responsible-play requirements in one connected system. CNVRT turned the concept into a product we can operate and build the business around.',
      ],
      name: 'Aaron Smith',
      role: 'Co-Founder, TopDraw',
      placeholder: true,
    },
  },
  {
    number: '06',
    slug: 'ya-omri',
    name: 'Ya Omri',
    sector: 'Luxury swimwear',
    scope: 'Custom Shopify redesign · 2026',
    image: yaOmri,
    alt: 'Ya Omri luxury swimwear custom Shopify storefront',
    summary: 'Redesigning a luxury swimwear brand with a custom Shopify theme, refined product pages, UGC marquees and international ecommerce journeys.',
    situation: 'Ya Omri was an established luxury swimwear brand with an active product range and a distinctive Dubai perspective. Its ecommerce experience needed to catch up with the quality, confidence and price point of the collections.',
    challenge: 'The redesign had to feel modern, expensive and editorial without weakening the practical journey to purchase. Products included separate bikini top and bottom sizing, multiway designs, detailed fit and fabric information, international delivery requirements and a growing library of campaign and customer content.',
    direction: 'CNVRT designed and developed a complete custom Shopify theme around premium imagery, restrained typography and collection-led storytelling. Custom product pages, UGC marquees and additional storefront functionality bring commercial clarity to the luxury visual direction.',
    overviewHeadings: {
      situation: ['An active luxury brand', 'ready for a more', 'considered storefront.'],
      challenge: ['Make the experience', 'feel as premium as', 'the product itself.'],
      direction: ['Combine editorial', 'confidence with custom', 'commerce journeys.'],
    },
    services: ['Ecommerce strategy', 'Complete site redesign', 'Custom Shopify theme', 'Responsive UX and UI', 'Custom product pages', 'UGC marquees', 'Collection merchandising', 'Additional functionality'],
    metrics: [['2026', 'Complete Shopify redesign delivered'], ['Custom', 'Theme and product-page experience'], ['Worldwide', 'Luxury ecommerce and delivery journey']],
    metricsConfirmed: true,
    resultsNote: 'Confirmed delivery facts for the 2026 redesign. Commercial performance results will be added when an approved reporting period is available.',
    facts: [
      ['Delivered', '2026', 'calendar'],
      ['Platform', 'Shopify', 'relationship'],
      ['Build', 'Custom theme', 'duration'],
      ['Brand base', 'Dubai, UAE', 'location'],
    ],
    approach: [
      { title: 'Luxury ecommerce direction', description: 'The visual system uses restraint, scale and campaign imagery to create a modern premium experience aligned with the brand’s Dubai identity and international positioning.' },
      { title: 'Complete custom theme', description: 'CNVRT redesigned and developed the complete Shopify storefront as a custom theme rather than applying surface-level changes to the existing experience.' },
      { title: 'Collection-led discovery', description: 'The Amalfi, Layali Dubai, Multiway and Sunset Mirage collections are given distinct storytelling space while shared navigation keeps swimwear, bikinis, swimsuits and resort wear easy to explore.' },
      { title: 'Custom product experience', description: 'Product pages combine rich imagery, variant selection, fabric and care details, delivery information and supporting content without losing the visual calm expected from a luxury brand.' },
      { title: 'Independent bikini sizing', description: 'Custom product logic allows customers to choose bikini top and bottom sizes separately, supporting better fit while keeping the purchase contained within one coordinated product journey.' },
      { title: 'UGC and social proof', description: 'Custom user-generated-content marquees bring customer and campaign imagery into the storefront as a continuous brand layer rather than a generic review widget.' },
      { title: 'Responsive editorial design', description: 'Layouts, typography and imagery were designed to retain their editorial character on mobile while protecting product information and purchase actions.' },
      { title: 'International commerce', description: 'The storefront communicates Dubai and UAE fulfilment alongside Gulf and worldwide delivery, supporting a brand that sells beyond its home market.' },
    ],
    testimonial: {
      quote: [
        'CNVRT understood that Ya Omri needed more than a functional Shopify store. The website had to feel as considered, modern and luxurious as the collections, while still making every product and purchase decision clear for our customers.',
        'They completely redesigned the experience and developed a custom theme around the way our brand needs to present and sell. From the product pages and separate bikini sizing to the collection storytelling and UGC details, the finished store feels distinctly Ya Omri and gives us a much stronger platform for the next stage of the brand.',
      ],
      name: 'Helen Areguy',
      role: 'Owner, Ya Omri',
      placeholder: true,
    },
  },
];
