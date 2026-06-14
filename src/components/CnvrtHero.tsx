import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Code2, MailCheck, Menu, MousePointerClick, SearchCheck, X } from 'lucide-react';
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

const mobileClientImages = clientImages.slice(0, 4);
const showClientCarousel = false;
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

export default function CnvrtHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [clientScrollDistance, setClientScrollDistance] = useState(0);
  const [clientCarouselOffset, setClientCarouselOffset] = useState(0);
  const [clientCarouselSceneHeight, setClientCarouselSceneHeight] = useState(0);
  const [servicesProgress, setServicesProgress] = useState(0);
  const [whyCnvrtProgress, setWhyCnvrtProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const delayedServicesParagraphProgress = Math.min(Math.max((servicesProgress - 0.22) / 0.78, 0), 1);
  const delayedWhyCnvrtParagraphProgress = Math.min(Math.max((whyCnvrtProgress - 0.22) / 1.08, 0), 1);
  const clientCarouselSectionRef = useRef<HTMLElement | null>(null);
  const clientCarouselViewportRef = useRef<HTMLDivElement | null>(null);
  const clientCarouselTrackRef = useRef<HTMLDivElement | null>(null);
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
    const measureClientCarousel = () => {
      if (typeof window === 'undefined') return;

      const viewport = clientCarouselViewportRef.current;
      const track = clientCarouselTrackRef.current;

      if (!viewport || !track || reducedMotion) {
        setClientScrollDistance(0);
        setClientCarouselSceneHeight(0);
        return;
      }

      const distanceMultiplier = window.innerWidth < 1024 ? 0.62 : 0.72;
      const nextDistance = Math.max(0, (track.scrollWidth - viewport.clientWidth) * distanceMultiplier);
      const nextSceneHeight = track.clientHeight + 4;
      setClientScrollDistance(nextDistance);
      setClientCarouselSceneHeight(nextSceneHeight);
    };

    measureClientCarousel();
    const animationFrame = window.requestAnimationFrame(measureClientCarousel);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            measureClientCarousel();
          })
        : null;

    if (clientCarouselViewportRef.current) resizeObserver?.observe(clientCarouselViewportRef.current);
    if (clientCarouselTrackRef.current) resizeObserver?.observe(clientCarouselTrackRef.current);

    const trackImages = clientCarouselTrackRef.current?.querySelectorAll('img') ?? [];
    trackImages.forEach((image) => {
      image.addEventListener('load', measureClientCarousel);
    });

    window.addEventListener('resize', measureClientCarousel);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      trackImages.forEach((image) => {
        image.removeEventListener('load', measureClientCarousel);
      });
      window.removeEventListener('resize', measureClientCarousel);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameId = 0;
    let lastOffset = Number.NaN;

    const updateClientCarouselPosition = () => {
      const section = clientCarouselSectionRef.current;

      if (!section || window.innerWidth < 768 || reducedMotion || clientScrollDistance <= 0) {
        if (lastOffset !== 0) {
          lastOffset = 0;
          setClientCarouselOffset(0);
        }
        frameId = window.requestAnimationFrame(updateClientCarouselPosition);
        return;
      }

      const availableTravel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / availableTravel, 0), 1);
      const translateX = -(progress * clientScrollDistance);

      if (Math.abs(translateX - lastOffset) > 0.5 || Number.isNaN(lastOffset)) {
        lastOffset = translateX;
        setClientCarouselOffset(translateX);
      }

      frameId = window.requestAnimationFrame(updateClientCarouselPosition);
    };

    frameId = window.requestAnimationFrame(updateClientCarouselPosition);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [clientScrollDistance, reducedMotion]);

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

      <section className="relative min-h-[106svh] overflow-hidden bg-[#06040a] text-white lg:min-h-[100svh]" aria-label="CNVRT hero">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(86,62,112,0.24),transparent_28rem),radial-gradient(circle_at_78%_12%,rgba(195,180,214,0.1),transparent_24rem),linear-gradient(180deg,rgba(255,255,255,0.012),transparent_40%,rgba(255,255,255,0.014))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[length:66px_66px] opacity-22 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#030205] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0a0610] to-transparent" />

        <div className="mx-auto flex min-h-[106svh] max-w-[82rem] items-center px-4 py-28 sm:px-6 lg:min-h-[100svh] lg:px-0 lg:py-32">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,30%)] lg:gap-10 xl:gap-14">
            <div className="text-left lg:order-1">
              <div className="max-w-[56rem] text-left">
                <div className="relative pt-6 pb-24 sm:pt-8 sm:pb-28 lg:hidden">
                  <div className="relative w-full max-w-[24rem] sm:max-w-[28rem]">
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
                  className="w-full max-w-[22rem] text-[26px] leading-[1.08] text-white min-[390px]:max-w-[24rem] min-[390px]:text-[28px] sm:max-w-[32rem] sm:text-[32px] md:max-w-[38rem] md:text-[38px] lg:max-w-[54rem] lg:text-[56px]"
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
                  className="mt-6 max-w-[21rem] text-[0.9rem] leading-[1.75rem] text-white sm:max-w-[30rem] sm:text-[0.95rem] lg:max-w-[43rem]"
                  style={{
                    fontFamily: 'Montserrat, "Avenir Next", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  Manchester-based growth and digital marketing for brands that need their websites, media and retention to work as one system.
                </p>

                <div className="mt-8 flex flex-row flex-wrap items-start gap-3">
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

            <div className="relative hidden lg:flex lg:order-2 lg:justify-end">
              <div className="relative w-full max-w-[22rem] xl:max-w-[24rem]">
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
                  className="absolute -bottom-10 -left-14 w-[58%] overflow-hidden rounded-[10px] border border-white/12 bg-[#110d18] shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
                >
                  <img src="/hair-made-easi.jpg" alt="CNVRT overlapping editorial placeholder detail preview" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
                </motion.figure>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section
        id="services"
        className="relative bg-[#06040a] px-1 pb-20 pt-0 text-white sm:px-1 sm:pb-24 lg:px-1 lg:pb-28"
        aria-label="Services"
      >
        {showClientCarousel && (
          <>
            <div className="relative pt-1 md:hidden">
              <div className="grid grid-cols-1 gap-1">
                {mobileClientImages.map((clientImage, index) => (
                  <motion.article
                    key={`${clientImage.id}-mobile`}
                    initial={{ opacity: 0, y: 28, scale: 0.985 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 0.95, delay: index * 0.12, ease: [0, 0, 0.2, 1] }}
                    className="group relative aspect-[16/10] overflow-hidden bg-[#08050d] shadow-[0_18px_50px_rgba(23,18,31,0.08)]"
                  >
                    <img src={clientImage.src} alt={clientImage.alt} className="h-full w-full object-cover" loading="lazy" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06040a]/88 via-[#06040a]/32 to-transparent" />
                    <div className="absolute bottom-5 left-5 max-w-[14rem] drop-shadow-[0_10px_24px_rgba(0,0,0,0.42)]">
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
                  </motion.article>
                ))}
              </div>
            </div>
            <section
              ref={clientCarouselSectionRef}
              className="relative hidden md:block"
              style={{ height: clientScrollDistance > 0 ? `${clientCarouselSceneHeight + clientScrollDistance}px` : `${clientCarouselSceneHeight || 320}px` }}
              aria-label="Client case study carousel"
            >
              <div
                ref={clientCarouselViewportRef}
                className="sticky top-0 z-10 h-[100svh] overflow-hidden pt-1"
                style={{ height: clientCarouselSceneHeight ? `${clientCarouselSceneHeight}px` : undefined }}
              >
                <div
                  ref={clientCarouselTrackRef}
                  className="flex h-[48svh] items-stretch gap-1 will-change-transform lg:h-[54svh] xl:h-[58svh]"
                  style={{ transform: `translate3d(${clientCarouselOffset}px, 0px, 0px)` }}
                >
                  {clientImages.map((clientImage) => (
                    <article
                      key={`${clientImage.id}-desktop`}
                      className="group relative aspect-[16/10] h-full min-w-0 flex-[0_0_30rem] overflow-hidden bg-[#08050d] shadow-[0_18px_50px_rgba(23,18,31,0.08)] lg:flex-[0_0_34rem] xl:flex-[0_0_38rem]"
                    >
                      <img src={clientImage.src} alt={clientImage.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" loading="lazy" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06040a]/88 via-[#06040a]/32 to-transparent" />
                      <div className="absolute bottom-7 left-7 max-w-[18rem] drop-shadow-[0_10px_24px_rgba(0,0,0,0.42)]">
                        <span
                          className="block whitespace-nowrap text-[1.02rem] text-white lg:text-[1.08rem] xl:text-[1.18rem]"
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
                          className="mt-2 inline-flex items-center gap-2 text-white/78 transition group-hover:translate-x-1 group-hover:text-white"
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
            </section>
          </>
        )}

        <div className={`relative mx-auto max-w-[82rem] px-4 sm:px-6 lg:px-0 ${showClientCarousel ? 'mt-10 sm:mt-12 lg:mt-8' : 'mt-0'}`}>
          <div className="pt-10 sm:pt-14 lg:pt-16">
            <div ref={servicesIntroRef}>
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
                className="-ml-[0.04em] w-full max-w-[22rem] text-[23px] leading-[1.08] min-[390px]:max-w-[24rem] min-[390px]:text-[23px] sm:max-w-[32rem] sm:text-[32px] md:max-w-[38rem] md:text-[38px] lg:max-w-[54rem] lg:text-[56px]"
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
                className="mt-6 max-w-[21rem] text-[0.9rem] leading-[1.75rem] sm:max-w-[30rem] sm:text-[0.95rem] md:max-w-[38rem] lg:max-w-[56rem]"
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

            <div className="mt-10 border-t border-white/7 sm:mt-12">
              {services.map((service) => {
                return (
                  <article key={service.title} className="group relative border-b border-white/7">
                    <div className="absolute inset-x-0 top-0 h-px bg-[#c3b4d6]/55" />
                    <a
                      href={service.href}
                      className="grid gap-6 py-11 outline-none transition sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:items-center sm:gap-7 sm:py-12 lg:grid-cols-[5.5rem_minmax(0,1fr)_auto] lg:py-14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c3b4d6]"
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
                            fontSize: '0.98rem',
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
                        className="inline-flex min-h-[3.25rem] items-center gap-2 self-center rounded-[4px] border px-6 text-[#06040a] transition duration-300 group-hover:translate-x-1 group-hover:brightness-105"
                        style={{
                          backgroundColor: '#c3b4d6',
                          borderColor: '#c3b4d6',
                          boxShadow: '0 18px 60px rgba(195,180,214,0.18)',
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

      <section
        ref={whyCnvrtSectionRef}
        className="relative bg-[#06040a] py-24 text-white sm:py-28 lg:py-32"
        aria-label="Why CNVRT"
      >
        <div className="mx-auto flex max-w-[82rem] flex-col items-start px-4 text-left sm:px-6 lg:px-0">
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
            className="w-full max-w-[22rem] text-[23px] leading-[1.08] text-white/92 min-[390px]:max-w-[24rem] min-[390px]:text-[23px] sm:max-w-[32rem] sm:text-[32px] md:max-w-[38rem] md:text-[38px] lg:max-w-[54rem] lg:text-[56px]"
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
      </section>
    </div>
  );
}
