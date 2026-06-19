import { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, Code2, MailCheck, Menu, MousePointerClick, SearchCheck, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const services = [
  {
    title: 'Website Design & Development',
    Icon: Code2,
    description:
      'Conversion-led websites and Shopify storefronts engineered for ambitious brands. Fast, scalable sites structured around your customer journey and your margin profile.',
    href: '/services/shopify-design-development',
  },
  {
    title: 'SEO, AEO & Organic Growth',
    Icon: SearchCheck,
    description:
      'Technical and content-led SEO built to capture high-intent demand. We optimise architecture and landing pages so your brand ranks for the keywords your future customers are searching.',
    href: '/services/shopify-seo-aeo',
  },
  {
    title: 'Paid Advertising',
    Icon: MousePointerClick,
    description:
      'Google and Meta campaigns engineered around new customer acquisition. Full-funnel paid media structured around contribution margin, not vanity ROAS, so every pound compounds.',
    href: '#contact',
  },
  {
    title: 'Email, Automation & Retention',
    Icon: MailCheck,
    description:
      'Lifecycle email and Klaviyo flows engineered to grow customer lifetime value. Welcome, browse, cart and winback systems that turn first-time buyers into repeat customers.',
    href: '#contact',
  },
];

const clientImages = [
  {
    id: 'hair-made-easi',
    src: '/hair-made-easi.jpg',
    alt: 'Hair Made Easi website preview',
    wordmark: 'Hair Made Easi',
  },
  {
    id: 'heatons-furniture',
    src: '/heatons-furniture.jpg',
    alt: 'Heatons Furniture website preview',
    wordmark: 'Heatons Furniture',
  },
  {
    id: 'ya-omri',
    src: '/ya-omri.jpg',
    alt: 'Ya Omri website preview',
    wordmark: 'Ya Omri',
  },
  {
    id: 'topdraw',
    src: '/topdraw.jpg',
    alt: 'Topdraw website preview',
    wordmark: 'Topdraw',
  },
  {
    id: 'hair-made-easi-2',
    src: '/hair-made-easi.jpg',
    alt: 'Hair Made Easi website preview',
    wordmark: 'Hair Made Easi',
  },
  {
    id: 'heatons-furniture-2',
    src: '/heatons-furniture.jpg',
    alt: 'Heatons Furniture website preview',
    wordmark: 'Heatons Furniture',
  },
  {
    id: 'ya-omri-2',
    src: '/ya-omri.jpg',
    alt: 'Ya Omri website preview',
    wordmark: 'Ya Omri',
  },
  {
    id: 'topdraw-2',
    src: '/topdraw.jpg',
    alt: 'Topdraw website preview',
    wordmark: 'Topdraw',
  },
];

const caseStudyImages = clientImages.slice(0, 6);
const showClientCarousel = true;
const servicesParagraphLines = [
  [
    'Strategy,',
    'design,',
    'development,',
    'SEO,',
    'paid',
    'media,',
    'email',
    'and',
    'retention,',
    'built',
    'and',
    'managed',
    'under',
    'one',
    'roof.',
    'Every',
    'part',
    'connected',
    'into',
    'a',
    'single',
    'system',
    'instead',
    'of',
    'scattered',
    'across',
    'separate',
    'agencies',
    'pulling',
    'in',
    'different',
    'directions.',
    "Whether",
    "you're",
    'launching',
    'something',
    'new,',
    'scaling',
    "what's",
    'working',
    'or',
    'fixing',
    "what's",
    'broken,',
    'we',
    'cover',
    'the',
    'full',
    'journey',
    'from',
    'first',
    'click',
    'to',
    'repeat',
    'customer.',
    'One',
    'team',
    'accountable',
    'for',
    'the',
    'whole',
    'thing,',
    'working',
    'towards',
    'the',
    'same',
    'number.',
  ],
];
const whyCnvrtParagraphWords = [
  'CNVRT',
  'was',
  'built',
  'because',
  'founders',
  'kept',
  'running',
  'into',
  'the',
  'same',
  'problem:',
  'agencies',
  'that',
  'could',
  'talk',
  'about',
  'growth',
  'but',
  'could',
  'not',
  'build',
  'the',
  'infrastructure',
  'to',
  'support',
  'it.',
  'We',
  'fix',
  'that.',
  'We',
  'work',
  'across',
  'design,',
  'development,',
  'search,',
  'paid',
  'media,',
  'and',
  'email',
  '-',
  'and',
  'we',
  'build',
  'the',
  'internal',
  'tools',
  'and',
  'systems',
  'that',
  'sit',
  'underneath',
  'your',
  'marketing',
  'and',
  'make',
  'it',
  'work',
  'as',
  'a',
  'whole.',
  'Manchester-based.',
  'Working',
  'with',
  'startups',
  'and',
  'growing',
  'businesses',
  'across',
  'the',
  'UK',
  'and',
  'internationally.',
];
const editorialSplitGridClass =
  'grid items-start gap-8 sm:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)] sm:gap-8 md:grid-cols-[minmax(14rem,0.38fr)_minmax(0,1fr)] lg:grid-cols-[minmax(18rem,0.42fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(20rem,0.44fr)_minmax(0,1fr)] xl:gap-16';
const editorialImageFrameClass =
  'relative overflow-hidden rounded-[10px] border border-white/10 bg-[#110d18] shadow-[0_24px_80px_rgba(0,0,0,0.32)]';
const editorialImageClass =
  'aspect-[6/5] max-h-[22rem] w-full object-cover sm:aspect-[4/5] sm:max-h-[24rem] md:max-h-[28rem] lg:aspect-[5/6] lg:max-h-[34rem]';

export default function CnvrtHero() {
  const sectionGutter = 'px-4 sm:px-6 lg:px-6 xl:px-0';
  const sectionContainer = `mx-auto max-w-[82rem] ${sectionGutter}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [servicesProgress, setServicesProgress] = useState(0);
  const [whyCnvrtProgress, setWhyCnvrtProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const [caseStudiesEmblaRef, caseStudiesEmblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: false,
    duration: 28,
  });
  const delayedServicesParagraphProgress = Math.min(Math.max((servicesProgress - 0.22) / 0.78, 0), 1);
  const delayedWhyCnvrtParagraphProgress = Math.min(Math.max((whyCnvrtProgress - 0.22) / 1.08, 0), 1);
  const auditFormLift = reducedMotion ? 0 : 56 - auditProgress * 92;
  const auditFormScale = reducedMotion ? 1 : 0.972 + auditProgress * 0.028;
  const auditFormOpacity = reducedMotion ? 1 : 0.72 + auditProgress * 0.28;
  const auditTextureY = reducedMotion ? 0 : 22 - auditProgress * 44;
  const auditTextureOpacity = reducedMotion ? 1 : 0.82 + auditProgress * 0.18;
  const auditLeftImageY = reducedMotion ? 0 : 26 * (1 - auditProgress);
  const auditRightImageY = reducedMotion ? 0 : 22 * (1 - auditProgress);
  const auditLeftImageX = reducedMotion ? 0 : -18 * (1 - auditProgress);
  const auditRightImageX = reducedMotion ? 0 : 16 * (1 - auditProgress);
  const auditImageOpacity = reducedMotion ? 1 : 0.68 + auditProgress * 0.32;
  const auditSectionRef = useRef<HTMLElement | null>(null);
  const servicesIntroRef = useRef<HTMLDivElement | null>(null);
  const whyCnvrtSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY > 110);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      setServicesProgress(1);
      return;
    }

    let frameId = 0;
    let lastProgress = Number.NaN;

    const updateServicesProgress = () => {
      frameId = 0;
      const section = servicesIntroRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.84;
      const end = viewportHeight * 0.22;
      const rawProgress = (start - rect.top) / Math.max(start - end, 1);
      const nextProgress = Math.min(Math.max(rawProgress, 0), 1);

      if (Math.abs(nextProgress - lastProgress) > 0.01 || Number.isNaN(lastProgress)) {
        lastProgress = nextProgress;
        setServicesProgress(nextProgress);
      }
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateServicesProgress);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      setAuditProgress(1);
      return;
    }

    let frameId = 0;
    let lastProgress = Number.NaN;

    const updateAuditProgress = () => {
      frameId = 0;
      const section = auditSectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 1.02;
      const end = viewportHeight * -0.22;
      const rawProgress = (start - rect.top) / Math.max(start - end, 1);
      const nextProgress = Math.min(Math.max(rawProgress, 0), 1);

      if (Math.abs(nextProgress - lastProgress) > 0.01 || Number.isNaN(lastProgress)) {
        lastProgress = nextProgress;
        setAuditProgress(nextProgress);
      }
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateAuditProgress);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [reducedMotion]);

  const scrollCaseStudies = (direction: 'prev' | 'next') => {
    if (!caseStudiesEmblaApi) return;
    if (direction === 'next') {
      caseStudiesEmblaApi.scrollNext();
      return;
    }

    caseStudiesEmblaApi.scrollPrev();
  };

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      setWhyCnvrtProgress(1);
      return;
    }

    let frameId = 0;
    let lastProgress = Number.NaN;

    const updateWhyCnvrtProgress = () => {
      frameId = 0;
      const section = whyCnvrtSectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.84;
      const end = viewportHeight * 0.22;
      const rawProgress = (start - rect.top) / Math.max(start - end, 1);
      const nextProgress = Math.min(Math.max(rawProgress, 0), 1);

      if (Math.abs(nextProgress - lastProgress) > 0.01 || Number.isNaN(lastProgress)) {
        lastProgress = nextProgress;
        setWhyCnvrtProgress(nextProgress);
      }
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateWhyCnvrtProgress);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [reducedMotion]);

  return (
    <div className="bg-white">
      <motion.header
        initial={{ opacity: 0, y: -8, filter: 'blur(7px)' }}
        animate={{ opacity: 1, y: hidden ? -116 : 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 260, damping: 34, opacity: { duration: 0.5 }, filter: { duration: 0.5 } }}
        className="fixed left-0 right-0 top-5 z-50 px-4 sm:px-6 lg:px-8"
      >
        <nav className="mx-auto grid h-[4.75rem] max-w-[92rem] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[7px] bg-[linear-gradient(180deg,rgba(255,255,255,0.078),rgba(255,255,255,0.026)_48%,rgba(255,255,255,0.018)),rgba(5,7,11,0.72)] px-4 shadow-[0_30px_100px_rgba(0,0,0,0.46),0_0_0_1px_rgba(255,255,255,0.105),inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(255,255,255,0.045)] backdrop-blur-[28px] sm:px-5 lg:px-6">
          <a
            href="/"
            aria-label="CNVRT home"
            className="block w-[7.1rem] rounded-[4px] outline-none transition opacity-95 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6] sm:w-[8.25rem]"
          >
            <img src="/cnvrt-logo.png" alt="CNVRT" className="block h-auto w-full" />
          </a>

          <div className="hidden justify-center lg:flex">
            <a
              href="#services"
              className="relative inline-flex h-11 items-center justify-center px-8 text-white/46 outline-none transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
              style={{
                fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Services
            </a>
          </div>

          <div className="hidden items-center justify-end lg:flex">
            <a
              href="mailto:hello@cnvrt.co.uk"
              className="cta-sheen relative overflow-hidden rounded-[4px] border px-6 py-3 outline-none transition duration-200 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
              style={{
                backgroundColor: '#c3b4d6',
                borderColor: '#c3b4d6',
                boxShadow: '0 18px 60px rgba(195,180,214,0.18)',
                color: '#06040a',
                fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Book a call
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/15 text-white outline-none transition hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6] lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="mx-auto mt-2 max-w-[92rem] rounded-[7px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.024)),rgba(5,7,11,0.86)] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.105),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[28px] lg:hidden">
            {['Services', 'Book a call', 'Get an audit'].map((item) => (
              <a
                key={item}
                href="#"
                className="flex items-center justify-between border-b border-white/[0.075] px-2 py-4 text-white outline-none last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
                style={{
                  fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </motion.header>

      <section className="relative overflow-hidden bg-[#06040a] text-white sm:min-h-[100svh]" aria-label="CNVRT hero">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(86,62,112,0.24),transparent_28rem),radial-gradient(circle_at_78%_12%,rgba(195,180,214,0.1),transparent_24rem),linear-gradient(180deg,rgba(255,255,255,0.012),transparent_40%,rgba(255,255,255,0.014))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[length:66px_66px] opacity-22 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#030205] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#06040a] via-[#07050c] to-transparent" />

        <div className={`${sectionContainer} flex items-start pb-16 pt-28 sm:min-h-[100svh] sm:items-center sm:py-28 lg:py-32`}>
          <div className="grid w-full items-center gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(11rem,30%)] sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(13rem,30%)] lg:grid-cols-[minmax(0,1fr)_minmax(16rem,28%)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,30%)] xl:gap-14">
            <div className="text-left sm:order-1">
              <div className="max-w-[56rem] text-left">
                <div className="relative pb-12 sm:hidden">
                  <div className="relative w-full max-w-[22rem] sm:max-w-[26rem]">
                    <motion.figure
                      initial={reducedMotion ? false : { opacity: 0, y: 18, rotate: -1.5 }}
                      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: -1.5 }}
                      transition={{ duration: 0.7, delay: 0.18, ease: [0, 0, 0.2, 1] }}
                      className="relative aspect-[6/5] overflow-hidden rounded-[10px] border border-white/10 bg-[#110d18] shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:aspect-[5/4]"
                    >
                      <img src="/ya-omri.jpg" alt="CNVRT editorial placeholder project preview" className="h-full w-full object-cover" loading="lazy" />
                    </motion.figure>

                    <motion.figure
                      initial={reducedMotion ? false : { opacity: 0, y: 22, x: 10, rotate: -3 }}
                      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, x: 0, rotate: -3 }}
                      transition={{ duration: 0.7, delay: 0.28, ease: [0, 0, 0.2, 1] }}
                      className="absolute -bottom-10 right-3 w-[46%] overflow-hidden rounded-[10px] border border-white/12 bg-[#110d18] shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:-bottom-12 sm:right-4"
                    >
                      <img src="/hair-made-easi.jpg" alt="CNVRT overlapping editorial placeholder detail preview" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
                    </motion.figure>
                  </div>
                </div>

                <h1
                  className="w-full max-w-[22rem] text-[26px] leading-[1.08] text-white min-[390px]:max-w-[24rem] min-[390px]:text-[28px] sm:max-w-[28rem] sm:text-[31px] md:max-w-[36rem] md:text-[37px] lg:max-w-[46rem] lg:text-[50px] xl:max-w-[54rem] xl:text-[56px]"
                  style={{
                    fontFamily: '"ITC Blair", "Blair ITC", "BlairMdITC TT", "Eurostile Extended", "Bank Gothic", "Arial Black", sans-serif',
                    fontWeight: 300,
                    letterSpacing: '0.025em',
                    textTransform: 'uppercase',
                  }}
                >
                  The manchester digital growth agency{' '}
                  <span className="italic text-white/72" style={{ fontWeight: 300 }}>
                    building brands properly
                  </span>
                </h1>

                <p
                  className="mt-6 max-w-[21rem] text-[0.9rem] leading-[1.75rem] text-white sm:max-w-[25rem] sm:text-[0.95rem] md:max-w-[30rem] lg:max-w-[36rem] xl:max-w-[43rem]"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  Manchester-based growth and digital marketing for brands that need their websites, media and retention to work as one system.
                </p>

                <div className="mt-8 flex flex-row flex-wrap items-start gap-3 sm:gap-4">
                  <a
                    href="mailto:hello@cnvrt.co.uk"
                    className="cta-sheen relative inline-flex min-h-[3.45rem] items-center justify-center overflow-hidden rounded-[4px] border px-6 outline-none transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
                    style={{
                      backgroundColor: '#c3b4d6',
                      borderColor: '#c3b4d6',
                      color: '#06040a',
                      fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Book a call
                  </a>
                  <a
                    href="mailto:hello@cnvrt.co.uk"
                    className="inline-flex min-h-[3.45rem] items-center justify-center rounded-[4px] border border-white/16 px-6 text-white outline-none transition hover:border-white/34 hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
                    style={{
                      fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Get an audit
                  </a>
                </div>
              </div>
            </div>

            <div className="relative hidden sm:order-2 sm:flex sm:justify-end">
              <div className="relative w-full max-w-[12rem] md:max-w-[15rem] lg:max-w-[20rem] xl:max-w-[24rem]">
                <motion.figure
                  initial={reducedMotion ? false : { opacity: 0, y: 18, rotate: -1.5 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: -1.5 }}
                  transition={{ duration: 0.7, delay: 0.18, ease: [0, 0, 0.2, 1] }}
                  className="relative aspect-[4/5] overflow-hidden rounded-[10px] border border-white/10 bg-[#110d18] shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
                >
                  <img src="/ya-omri.jpg" alt="CNVRT editorial placeholder project preview" className="h-full w-full object-cover" loading="lazy" />
                </motion.figure>

                <motion.figure
                  initial={reducedMotion ? false : { opacity: 0, y: 26, x: -14, rotate: 4 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, x: 0, rotate: 4 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: [0, 0, 0.2, 1] }}
                  className="absolute -bottom-7 -left-8 w-[54%] overflow-hidden rounded-[10px] border border-white/12 bg-[#110d18] shadow-[0_24px_70px_rgba(0,0,0,0.34)] md:-bottom-8 md:-left-10 lg:-bottom-10 lg:-left-14 lg:w-[58%]"
                >
                  <img src="/hair-made-easi.jpg" alt="CNVRT overlapping editorial placeholder detail preview" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
                </motion.figure>
              </div>
            </div>

          </div>
        </div>
      </section>

      {showClientCarousel && (
        <section className="relative overflow-hidden bg-[#06040a] pb-10 pt-0 text-white sm:pb-12 lg:pb-16" aria-label="Case studies">
          <div className={`${sectionContainer} flex items-center justify-between gap-4 pb-4 pt-0`}>
            <p
              className="text-white"
              style={{
                fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
              }}
            >
              Brands we've worked with
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous case studies"
                onClick={() => scrollCaseStudies('prev')}
                className="inline-flex h-10 items-center justify-center px-1 text-white/72 outline-none transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next case studies"
                onClick={() => scrollCaseStudies('next')}
                className="inline-flex h-10 items-center justify-center px-1 text-white/72 outline-none transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="w-full">
            <div ref={caseStudiesEmblaRef} className="overflow-hidden">
              <div className="flex gap-1">
            {caseStudyImages.map((clientImage) => (
              <article
                key={`${clientImage.id}-case-study-grid`}
                className="group relative min-w-0 flex-[0_0_88%] aspect-[16/10] overflow-hidden bg-[#08050d] shadow-none md:flex-[0_0_48%] lg:flex-[0_0_32.3%] lg:shadow-[0_18px_50px_rgba(23,18,31,0.08)]"
              >
                <img src={clientImage.src} alt={clientImage.alt} className="h-full w-full object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06040a]/88 via-[#06040a]/32 to-transparent" />
                <div className="absolute bottom-5 left-5 max-w-[14rem] drop-shadow-[0_10px_24px_rgba(0,0,0,0.42)] sm:bottom-6 sm:left-6">
                  <span
                    className="block whitespace-nowrap text-[0.9rem] text-white sm:text-[0.98rem]"
                    style={{
                      fontFamily: '"ITC Blair", "Blair ITC", "BlairMdITC TT", "Eurostile Extended", "Bank Gothic", "Arial Black", sans-serif',
                      fontWeight: 300,
                      letterSpacing: '0.12em',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {clientImage.wordmark}
                  </span>
                  <span
                    className="mt-2 inline-flex items-center gap-2 text-white/78"
                    style={{
                      fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.62rem',
                      fontWeight: 500,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                    }}
                  >
                    View case study
                    <ArrowRight size={13} />
                  </span>
                </div>
              </article>
            ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="services"
        className="relative bg-[#06040a] pb-20 pt-0 text-white sm:pb-24 lg:pb-28"
        aria-label="Services"
      >
        <div className={`relative ${sectionContainer}`}>
          <div className="pt-10 sm:pt-14 lg:pt-16">
            <div ref={servicesIntroRef} className={editorialSplitGridClass}>
              <div className={editorialImageFrameClass}>
                <img src="/topdraw.jpg" alt="CNVRT services editorial placeholder" className={editorialImageClass} loading="lazy" />
              </div>

              <div>
                <p
                  className="mb-5 text-white"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                  }}
                >
                  What we do
                </p>
                <h2
                  className="-ml-[0.04em] w-full max-w-[22rem] text-[23px] leading-[1.08] min-[390px]:max-w-[24rem] min-[390px]:text-[23px] sm:max-w-[32rem] sm:text-[32px] md:max-w-[38rem] md:text-[38px] lg:max-w-[50rem] lg:text-[44px] xl:text-[52px]"
                  style={{
                    fontFamily: '"ITC Blair", "Blair ITC", "BlairMdITC TT", "Eurostile Extended", "Bank Gothic", "Arial Black", sans-serif',
                    fontWeight: 300,
                    letterSpacing: '0.025em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  Everything your business needs to grow <span style={{ fontStyle: 'italic' }}>- one team</span>
                </h2>
                <p
                  className="mt-6 max-w-[42rem] text-[0.9rem] leading-[1.75rem] sm:max-w-[42rem] sm:text-[0.95rem] md:max-w-[42rem] lg:max-w-[56rem]"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  {servicesParagraphLines.map((line, lineIndex) => {
                    const previousWordsCount = servicesParagraphLines
                      .slice(0, lineIndex)
                      .reduce((count, currentLine) => count + currentLine.length, 0);

                    return (
                      <span key={`services-line-${lineIndex}`}>
                        {line.map((word, wordIndex) => {
                          const flatIndex = previousWordsCount + wordIndex;
                          const threshold = flatIndex / Math.max(servicesParagraphLines.flat().length, 1);
                          const isFilled = delayedServicesParagraphProgress >= threshold;

                          return (
                            <span
                              key={`${word}-${flatIndex}`}
                              className="transition-colors duration-500"
                              style={{ color: isFilled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.3)' }}
                            >
                              {word}
                              {wordIndex < line.length - 1 ? ' ' : ''}
                            </span>
                          );
                        })}
                        {lineIndex < servicesParagraphLines.length - 1 ? ' ' : null}
                      </span>
                    );
                  })}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:hello@cnvrt.co.uk"
                    className="cta-sheen relative inline-flex min-h-[3.25rem] items-center justify-center overflow-hidden rounded-[4px] border px-6 outline-none transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
                    style={{
                      backgroundColor: '#c3b4d6',
                      borderColor: '#c3b4d6',
                      color: '#06040a',
                      fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Book a call
                  </a>
                  <a
                    href="mailto:hello@cnvrt.co.uk"
                    className="inline-flex min-h-[3.25rem] items-center justify-center rounded-[4px] border border-white/16 px-6 text-white outline-none transition hover:border-white/34 hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
                    style={{
                      fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Get an audit
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/5 sm:mt-12">
              {services.map((service) => {
                return (
                  <article key={service.title} className="group relative border-b border-white/5">
                    <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
                    <a
                      href={service.href}
                    className="grid gap-6 py-10 outline-none transition sm:grid-cols-[4.75rem_minmax(0,1fr)] sm:items-start sm:gap-x-7 sm:gap-y-5 sm:py-12 xl:grid-cols-[5.5rem_minmax(0,1fr)_auto] xl:items-center xl:gap-y-7 lg:py-14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
                    >
                      <div className="flex items-center self-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/58 transition-colors duration-500 group-hover:border-[#c3b4d6]/40 group-hover:bg-[#c3b4d6]/18 group-hover:text-white">
                          <service.Icon size={22} strokeWidth={1.7} />
                        </span>
                      </div>

                      <div className="max-w-[48rem] self-center">
                        <span
                          className="block text-white/72 transition-colors duration-500 group-hover:text-white"
                          style={{
                            fontFamily: '"ITC Blair", "Blair ITC", "BlairMdITC TT", "Eurostile Extended", "Bank Gothic", "Arial Black", sans-serif',
                            fontSize: '0.88rem',
                            fontWeight: 400,
                            letterSpacing: '0.025em',
                            lineHeight: 1.12,
                            textTransform: 'uppercase',
                          }}
                        >
                          {service.title}
                        </span>
                        <span
                          className="mt-3 block max-w-[42rem] text-white/62 transition-colors duration-500 group-hover:text-white/92"
                          style={{
                            fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 300,
                            lineHeight: '1.75rem',
                          }}
                        >
                          {service.description}
                        </span>
                      </div>

                      <span
                        className="inline-flex min-h-[3.25rem] items-center gap-2 self-start rounded-[4px] border px-6 text-[#06040a] transition duration-300 group-hover:translate-x-1 group-hover:brightness-105 sm:col-start-2 xl:col-start-auto xl:self-center xl:justify-self-end"
                        style={{
                          backgroundColor: '#c3b4d6',
                          borderColor: '#c3b4d6',
                          fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: 500,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Learn more
                        <ArrowRight size={15} />
                      </span>
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section ref={auditSectionRef} className="relative w-full overflow-hidden bg-[#c3b4d6] py-16 text-[#06040a] sm:py-20 lg:py-24" aria-label="CNVRT audit form">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.34),transparent_26rem),radial-gradient(circle_at_82%_72%,rgba(109,87,132,0.22),transparent_30rem)] transition-transform duration-300"
          style={{ opacity: auditTextureOpacity, transform: `translate3d(0, ${auditTextureY}px, 0)` }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,4,10,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,4,10,0.04)_1px,transparent_1px)] bg-[length:44px_44px] opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] transition-transform duration-300"
          style={{ opacity: auditTextureOpacity * 0.45, transform: `translate3d(0, ${auditTextureY * 0.7}px, 0)` }}
        />
        <div className={`${sectionContainer} flex flex-col items-center`}>
          <div className="max-w-[56rem] text-center">
            <p
              className="mb-5"
              style={{
                fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
              }}
            >
              Built for ambitious brands
            </p>
            <h2
              className="mx-auto max-w-[22rem] text-[23px] leading-[1.08] min-[390px]:max-w-[24rem] min-[390px]:text-[23px] sm:max-w-[32rem] sm:text-[32px] md:max-w-[40rem] md:text-[38px] lg:max-w-[48rem] lg:text-[44px] xl:max-w-[56rem] xl:text-[54px]"
              style={{
                fontFamily: '"ITC Blair", "Blair ITC", "BlairMdITC TT", "Eurostile Extended", "Bank Gothic", "Arial Black", sans-serif',
                fontWeight: 300,
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
              }}
            >
              One team building the system behind your growth.
            </h2>
            <p
              className="mx-auto mt-6 max-w-[21rem] text-[0.9rem] leading-[1.75rem] sm:max-w-[31rem] sm:text-[0.95rem] lg:max-w-[38rem] xl:max-w-[44rem]"
              style={{
                fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 400,
              }}
            >
              Tell us where growth is getting stuck and we will send back a focused audit covering website conversion, acquisition efficiency and retention opportunities.
            </p>
          </div>

          <div className="relative mt-18 w-full max-w-[42rem] pb-14 pt-10 lg:mt-20 lg:max-w-[39rem] lg:pb-16">
            <div
              className="pointer-events-none absolute -left-16 -top-8 hidden w-[17rem] overflow-hidden rounded-[10px] bg-white shadow-[0_34px_90px_rgba(33,24,44,0.28)] transition-[transform,opacity] duration-500 ease-out will-change-transform lg:block lg:-left-36 lg:w-[22rem]"
              style={{ opacity: auditImageOpacity, transform: `translate3d(${auditLeftImageX}px, ${auditLeftImageY}px, 0) rotate(-8deg)` }}
            >
              <img src="/ya-omri.jpg" alt="" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
            </div>
            <div
              className="pointer-events-none absolute -right-14 -bottom-8 hidden w-[15rem] overflow-hidden rounded-[10px] bg-white shadow-[0_34px_90px_rgba(33,24,44,0.28)] transition-[transform,opacity] duration-500 ease-out will-change-transform lg:block lg:-right-30 lg:w-[19rem]"
              style={{ opacity: auditImageOpacity, transform: `translate3d(${auditRightImageX}px, ${auditRightImageY}px, 0) rotate(9deg)` }}
            >
              <img src="/hair-made-easi.jpg" alt="" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="pointer-events-none absolute inset-x-12 -bottom-4 top-20 rounded-[10px] bg-[#7e6b93]/38 blur-2xl" />
            <div className="pointer-events-none absolute inset-x-2 bottom-0 top-12 rounded-[10px] border border-[#6b587f]/18 bg-[#a491ba]/18" />
            <form
              className="relative z-10 grid gap-4 rounded-[10px] border border-[#06040a]/10 bg-[#fbfaf8] p-4 text-[#06040a] shadow-[0_28px_90px_rgba(33,24,44,0.18),0_0_0_1px_rgba(255,255,255,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] sm:grid-cols-2 sm:p-5 lg:p-6"
              action="mailto:hello@cnvrt.co.uk"
              method="post"
              encType="text/plain"
              style={{ opacity: auditFormOpacity, transform: `translate3d(0, ${auditFormLift}px, 0) scale(${auditFormScale})` }}
            >
              <div className="flex items-center justify-between rounded-[6px] border border-[#06040a]/8 bg-[#f3eef8] px-4 py-3 sm:col-span-2">
                <span
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(6,4,10,0.78)',
                  }}
                >
                  Free growth audit
                </span>
                <span
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(6,4,10,0.46)',
                  }}
                >
                  48h response
                </span>
              </div>

              <label className="flex flex-col gap-2 sm:col-span-1">
                <span
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(6,4,10,0.74)',
                  }}
                >
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  className="h-12 rounded-[4px] border border-[#06040a]/12 bg-white px-4 text-[#06040a] outline-none transition placeholder:text-[#06040a]/32 focus:border-[#8d78a6] focus:ring-2 focus:ring-[#c3b4d6]/55"
                  placeholder="Your name"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.92rem',
                    fontWeight: 400,
                  }}
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-1">
                <span
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(6,4,10,0.74)',
                  }}
                >
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  className="h-12 rounded-[4px] border border-[#06040a]/12 bg-white px-4 text-[#06040a] outline-none transition placeholder:text-[#06040a]/32 focus:border-[#8d78a6] focus:ring-2 focus:ring-[#c3b4d6]/55"
                  placeholder="you@brand.com"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.92rem',
                    fontWeight: 400,
                  }}
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(6,4,10,0.74)',
                  }}
                >
                  Website
                </span>
                <input
                  type="url"
                  name="website"
                  className="h-12 rounded-[4px] border border-[#06040a]/12 bg-white px-4 text-[#06040a] outline-none transition placeholder:text-[#06040a]/32 focus:border-[#8d78a6] focus:ring-2 focus:ring-[#c3b4d6]/55"
                  placeholder="https://yourbrand.com"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.92rem',
                    fontWeight: 400,
                  }}
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(6,4,10,0.74)',
                  }}
                >
                  What needs fixing?
                </span>
                <textarea
                  name="brief"
                  rows={4}
                  className="min-h-[8rem] rounded-[4px] border border-[#06040a]/12 bg-white px-4 py-3 text-[#06040a] outline-none transition placeholder:text-[#06040a]/32 focus:border-[#8d78a6] focus:ring-2 focus:ring-[#c3b4d6]/55"
                  placeholder="Traffic quality, conversion issues, retention gaps, paid inefficiency, launch support..."
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.92rem',
                    fontWeight: 400,
                    lineHeight: '1.55',
                  }}
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-[4px] border border-[#06040a] bg-[#06040a] px-6 text-white outline-none transition hover:bg-[#181022] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06040a] sm:col-span-2"
                style={{
                  fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Get my audit
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        ref={whyCnvrtSectionRef}
        className="relative bg-[#06040a] py-24 text-white sm:py-28 lg:py-32"
        aria-label="Why CNVRT"
      >
        <div className={sectionContainer}>
          <div className={editorialSplitGridClass}>
            <div className={editorialImageFrameClass}>
              <img src="/mobile-first-websites.png" alt="Mobile-first website design preview" className={editorialImageClass} loading="lazy" />
            </div>

            <div className="flex flex-col items-start text-left">
              <p
                className="mb-5 text-white/48"
                style={{
                  fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                }}
              >
                Why CNVRT
              </p>
              <h2
                className="w-full max-w-[22rem] text-[23px] leading-[1.08] text-white/92 min-[390px]:max-w-[24rem] min-[390px]:text-[23px] sm:max-w-[32rem] sm:text-[32px] md:max-w-[38rem] md:text-[38px] lg:max-w-[54rem] lg:text-[46px] xl:text-[56px]"
                style={{
                  fontFamily: '"ITC Blair", "Blair ITC", "BlairMdITC TT", "Eurostile Extended", "Bank Gothic", "Arial Black", sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.025em',
                  textTransform: 'uppercase',
                }}
              >
                What's strategy without execution?
              </h2>
              <p
                className="mt-6 max-w-[21rem] text-[0.9rem] leading-[1.75rem] sm:max-w-[30rem] sm:text-[0.95rem] md:max-w-[38rem] lg:max-w-[56rem]"
                style={{
                  fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 300,
                }}
              >
                {whyCnvrtParagraphWords.map((word, index) => {
                  const threshold = index / Math.max(whyCnvrtParagraphWords.length, 1);
                  const isFilled = delayedWhyCnvrtParagraphProgress >= threshold;

                  return (
                    <span
                      key={`${word}-${index}`}
                      className="transition-colors duration-500"
                      style={{ color: isFilled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.3)' }}
                    >
                      {word}
                      {index < whyCnvrtParagraphWords.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
