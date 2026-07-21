import homepageStructureArtwork from '@/assets/blog-homepage-structure-landscape.png';
import uberKinky from '@/assets/uberkinky.jpg';
import hearBetter from '@/assets/hear-better-home-test-landscape.png';

export interface ArticleMeta {
  slug: string;
  cardTitle: string;
  title: string;
  description: string;
  category: string;
  eyebrow: string;
  published: string;
  modified: string;
  publishedLabel: string;
  modifiedLabel: string;
  readTime: string;
  author: string;
  authorRole: string;
  image: ImageMetadata;
  video?: string;
  videoWebm?: string;
  imageAlt: string;
  imageCaption: string;
  quickAnswer: string;
  audience: string;
  toc: readonly { id: string; label: string }[];
  primaryService: { href: string; label: string; description: string };
  caseStudy: { href: string; label: string; description: string };
}

export const articles: readonly ArticleMeta[] = [
  {
    slug: 'homepage-structure-that-converts',
    cardTitle: 'The homepage structure that actually converts',
    title: 'What should a business homepage include?',
    description: 'A practical guide to the homepage sections, messages, proof and calls to action that help a business website turn more of the right visitors into enquiries.',
    category: 'Web design + conversion',
    eyebrow: 'Homepage conversion guide',
    published: '2026-07-17T09:00:00+01:00',
    modified: '2026-07-17T09:00:00+01:00',
    publishedLabel: '17 July 2026',
    modifiedLabel: '17 July 2026',
    readTime: '15 minute read',
    author: 'Daniel Lyons',
    authorRole: 'Owner of CNVRT',
    image: homepageStructureArtwork,
    video: '/media/articles/homepage-structure-neon-loop.mp4',
    videoWebm: '/media/articles/homepage-structure-neon-loop.webm',
    imageAlt: 'Representative abstract digital architecture with a violet signal moving through connected structures',
    imageCaption: 'A homepage works as a connected system: proposition, proof, routes and actions should guide the visitor through one coherent commercial journey.',
    quickAnswer: 'A strong business homepage should explain who the company helps, what it helps them achieve and why it is credible before asking the visitor to act. It then needs clear routes into the offer, relevant proof, enough detail to answer the first objections and a focused next step. The right order depends on the visitor and the sale, but clarity, evidence and direction matter more than adding every possible section.',
    audience: 'For owners and marketing teams planning a new website, assessing an underperforming homepage or preparing a clearer brief for a designer.',
    toc: [
      { id: 'job', label: 'What job should the homepage do?' },
      { id: 'above-fold', label: 'What belongs above the fold?' },
      { id: 'structure', label: 'A practical homepage structure' },
      { id: 'business-models', label: 'How the structure changes by business model' },
      { id: 'proof', label: 'Where proof should appear' },
      { id: 'mistakes', label: 'Common homepage mistakes' },
      { id: 'mobile-accessibility', label: 'Mobile, speed and accessibility' },
      { id: 'measure', label: 'How to measure the homepage' },
      { id: 'checklist', label: 'Homepage audit checklist' },
      { id: 'questions', label: 'Frequently asked questions' },
      { id: 'sources', label: 'Sources and review notes' },
    ],
    primaryService: {
      href: '/services/web-design/',
      label: 'Web design services',
      description: 'Plan and build a clearer, faster website around the customer journey and the commercial action it needs to support.',
    },
    caseStudy: {
      href: '/work/hear-better/',
      label: 'Hear Better case study',
      description: 'See how brand, website structure, local relevance and paid acquisition were built together for a new private audiology business.',
    },
  },
  {
    slug: 'shopify-migration-checklist',
    cardTitle: 'What a safe Shopify migration needs to protect',
    title: 'Shopify migration checklist for a safer move',
    description: 'A detailed Shopify migration checklist covering ecommerce data, redirects, SEO, products, integrations, tracking, testing and launch continuity.',
    category: 'Shopify + ecommerce',
    eyebrow: 'Shopify migration checklist',
    published: '2026-07-17T09:00:00+01:00',
    modified: '2026-07-17T09:00:00+01:00',
    publishedLabel: '17 July 2026',
    modifiedLabel: '17 July 2026',
    readTime: '18 minute read',
    author: 'Daniel Lyons',
    authorRole: 'Owner of CNVRT',
    image: uberKinky,
    imageAlt: 'Large ecommerce catalogue presented in a custom Shopify Plus storefront',
    imageCaption: 'A migration is a commercial continuity project involving data, search, trading systems and customer journeys, not simply a theme launch.',
    quickAnswer: 'A safe Shopify migration protects more than products and design. It preserves the data needed to trade, the URLs and content supporting organic visibility, working payments and fulfilment, customer and order continuity, marketing integrations, consent, analytics and advertising signals. The work should be mapped before anything moves, tested against agreed acceptance criteria and monitored after launch. No responsible migration can promise zero ranking movement, but disciplined planning reduces avoidable risk.',
    audience: 'For established retailers, ecommerce managers and project owners moving an active store to Shopify or Shopify Plus from another platform.',
    toc: [
      { id: 'scope', label: 'What does a Shopify migration include?' },
      { id: 'protect', label: 'What must the migration protect?' },
      { id: 'discovery', label: 'Audit the existing store first' },
      { id: 'data', label: 'Map and clean ecommerce data' },
      { id: 'seo', label: 'Protect URLs and search signals' },
      { id: 'systems', label: 'Rebuild the trading system' },
      { id: 'testing', label: 'Test before launch' },
      { id: 'launch', label: 'Plan cutover and launch day' },
      { id: 'monitoring', label: 'Monitor the first 30 days' },
      { id: 'checklist', label: 'Complete migration checklist' },
      { id: 'questions', label: 'Frequently asked questions' },
      { id: 'sources', label: 'Sources and review notes' },
    ],
    primaryService: {
      href: '/services/shopify-migrations/',
      label: 'Shopify migration services',
      description: 'Plan a controlled move to Shopify around catalogue quality, search continuity, integrations, measurement and trading readiness.',
    },
    caseStudy: {
      href: '/work/uberkinky/',
      label: 'UberKinky migration case study',
      description: 'See how CNVRT moved around 10,000 products from Shopline to Shopify Plus and created 200 targeted collections.',
    },
  },
  {
    slug: 'seo-and-aeo-foundation',
    cardTitle: 'SEO and AEO need one strong foundation',
    title: 'SEO and AEO: building strong search foundations',
    description: 'Understand how SEO and answer engine optimisation work together, what AI search changes, what remains the same and where businesses should invest first.',
    category: 'SEO + AI search',
    eyebrow: 'SEO and AEO guide',
    published: '2026-07-17T09:00:00+01:00',
    modified: '2026-07-17T09:00:00+01:00',
    publishedLabel: '17 July 2026',
    modifiedLabel: '17 July 2026',
    readTime: '16 minute read',
    author: 'Daniel Lyons',
    authorRole: 'Owner of CNVRT',
    image: hearBetter,
    imageAlt: 'Search-led website for an independent audiology business',
    imageCaption: 'Search visibility starts with a technically accessible site, clear services, useful evidence and content that answers the questions customers actually ask.',
    quickAnswer: 'SEO and answer engine optimisation are not competing choices. AI search still depends on content that can be discovered, indexed, understood and trusted. AEO adds emphasis to clear answers, well-defined entities, sourceable evidence and visibility inside generated responses, but it does not remove the need for technical SEO, useful pages, internal links and wider authority. Build one reliable search foundation first, then measure how it performs across both search results and AI answers.',
    audience: 'For business owners and marketing teams deciding whether AEO needs a separate strategy, a separate budget or a stronger version of the search work they already do.',
    toc: [
      { id: 'definitions', label: 'What are SEO and AEO?' },
      { id: 'official-position', label: 'What search platforms actually say' },
      { id: 'shared-foundation', label: 'The foundation both disciplines share' },
      { id: 'differences', label: 'What genuinely changes for AI answers' },
      { id: 'content', label: 'How to create sourceable content' },
      { id: 'technical', label: 'Technical SEO, schema and AI crawlers' },
      { id: 'authority', label: 'Entities, evidence and off-site authority' },
      { id: 'measurement', label: 'How to measure SEO and AI visibility' },
      { id: 'plan', label: 'A practical 90-day plan' },
      { id: 'questions', label: 'Frequently asked questions' },
      { id: 'sources', label: 'Sources and review notes' },
    ],
    primaryService: {
      href: '/services/aeo/',
      label: 'AEO and AI search services',
      description: 'Assess how search foundations, content, entities and evidence support visibility in answer-led discovery.',
    },
    caseStudy: {
      href: '/work/hear-better/',
      label: 'Hear Better search case study',
      description: 'See how local SEO, answer-focused content and paid search support one connected acquisition system.',
    },
  },
] as const;

export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
