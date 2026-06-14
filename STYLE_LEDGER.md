# CNVRT Style Ledger

Working record of CSS and visual styling applied to elements. Update this after each push or meaningful visual change.

## 2026-06-12 Hero/Header Revision

### Global

- Loaded ITC Blair font family from `/public/fonts`.
- Loaded Montserrat from Google Fonts for nav, CTA labels and paragraph copy.
- Montserrat loaded weights: `300`, `400`, `500`.
- Global body background is white `#ffffff`.
- Hero is its own `<section aria-label="CNVRT hero">` element.
- Hero background is `#06040a` after previous purple bases proved too light in browser.
- Removed fuzzy noise texture overlay from active hero use.
- Kept subtle grid treatment for the hero background, tuned over `#06040a`.
- Hero section is a simple sticky scene: `position: sticky`, `top: 0`, `height: 100vh`.
- The following white section sits above the hero with `position: relative` and `z-index: 20`, so it scrolls up over the held hero.
- Hero inner content max width: `82rem`, matching the services section measure.
- Hero content structure: single centered content column with no secondary panel.
- Hero copy wrapper max width: `56rem`.
- Broad reusable font helper classes removed. Typography is set per element to avoid style collisions.

### Motion

- Header entrance: starts `8px` higher with opacity `0` and `blur(7px)`, settles over `500ms` while retaining scroll-hide spring behavior.
- Header scroll hide: Motion spring, stiffness `260`, damping `34`, translates to `-116px` after `window.scrollY > 110`.
- Hero reveal: eyebrow, H1, paragraph and CTA row animate with opacity `0 -> 1` and vertical movement `10-12px -> 0`.
- Hero reveal timing: base duration `620ms`, ease `[0, 0, 0.2, 1]`, delays `120ms`, `200ms`, `280ms`, `360ms`.
- Hero background gradient is static to keep the pinned hero calm while the next section scrolls over it.
- CTA sheen: primary CTA elements use a `520ms` diagonal sheen on hover only.
- Scroll handoff: no JavaScript scroll progress, no Lenis instance, no transform/opacity mapping, and no white wipe layer. The page uses native scroll plus CSS stacking only.

### Header

- Element: `motion.header`
- Position: fixed, floating, top offset.
- Top offset: `20px`.
- Horizontal padding: `16px` mobile, `24px` small screens, `32px` large screens.
- Behavior: hides after a small scroll.
- Hide threshold: `window.scrollY > 110`.
- Animation: Motion spring, stiffness `260`, damping `34`, translates to `-116px`.
- Visual: premium glass panel with layered translucent gradients, no hard visible outline, soft depth, and subtle inner highlights.
- Header panel height: `4.75rem`.
- Header max width: `92rem`.
- Header radius: `7px`.
- Header border: no CSS border; hairline created with `0 0 0 1px rgba(255,255,255,0.105)` shadow.
- Header background: `linear-gradient(180deg, rgba(255,255,255,0.078), rgba(255,255,255,0.026) 48%, rgba(255,255,255,0.018)), rgba(5,7,11,0.72)`.
- Header shadow: `0 30px 100px rgba(0,0,0,0.46)`, hairline shadow, and subtle top/bottom inset highlights.
- Header blur: `backdrop-blur-[28px]`.
- Header grid: `auto 1fr auto`.
- Header gap: `16px`.
- Header padding: `16px` mobile, `20px` small screens, `24px` large screens.

### Logo

- Element: header logo image.
- Asset: `/cnvrt-logo.png`.
- Width: `7.1rem` mobile, `8.25rem` from small screens.
- Opacity: `0.95`, `1` on hover.
- Focus: `2px` outline in `#c3b4d6`, `4px` offset.

### Header Nav

- Element: `SERVICES` link.
- Font: Montserrat.
- Font size: `0.72rem`.
- Text transform: uppercase.
- Letter spacing: `0.2em`.
- Weight: `400`.
- Colour: low-contrast white, brightens on hover.
- Colour: `rgba(255,255,255,0.42)`.
- Hover colour: white.
- Container height: `44px`.
- Padding: `0 32px`.
- Border: none.
- Background: transparent.
- Detail: no icon, dot, underline, or secondary decoration.

### Header CTA

- Element: `BOOK A CALL`.
- Font: Montserrat.
- Font size: `0.72rem`.
- Text transform: uppercase.
- Letter spacing: `0.2em`.
- Weight: `500`.
- Visual: matches hero primary CTA.
- Padding: `12px 24px`.
- Radius: `4px`.
- Border: `#c3b4d6`.
- Background: `#c3b4d6`.
- Text: `#06040a`.
- Shadow: `0 18px 60px rgba(195,180,214,0.18)`.
- Hover: `brightness(1.1)`.
- Desktop header contains only `SERVICES` and `BOOK A CALL`; `GET AN AUDIT` remains in the mobile menu and hero CTA area.

### Hero Layout

- Element: sticky hero scene.
- Section position: sticky.
- Section height: `100vh`.
- Section overflow: hidden.
- Section stack level: `z-index: 0`.
- Next section stack level: `z-index: 20`.
- Next section minimum height: `100vh`, allowing the white section to fully cover the held hero during scroll.
- Desktop top padding: `9.5rem`.
- Horizontal padding: `20px` mobile, `32px` small screens, `40px` large screens.
- Layout: single centered copy stack.
- Hero copy alignment: center.

### H1

- Element: main hero heading.
- Font: ITC Blair.
- Weight: `300`.
- Letter spacing: `0.035em`.
- Text transform: uppercase.
- Desktop size: `56px`.
- Mobile/base size under `390px`: `23px`.
- `390px+` size: `23px`.
- `640px+` size: `34px`.
- `768px+` size: `42px`.
- `1024px+` size: `56px`.
- Line height: `1.18`.
- Max width: `58rem`.
- Colour: `rgba(255,255,255,0.9)`.
- Alignment: centered.
- H1 emphasis phrase: `designing`, `scaling`, and `building` cycle inside an inline italic span with weight `300` and colour `rgba(255,255,255,0.72)`.
- H1 closing text: `brands properly.` so the sentence finishes cleanly after the animated verb.
- H1 emphasis motion: the highlighted word swaps every `1350ms` with a `200ms` soft fade-and-lift transition, using its natural text width so no artificial gap appears around shorter words, while the full sentence remains in the DOM as one semantic `h1`.

### Hero Paragraph

- Element: paragraph below hero heading.
- Font: Montserrat.
- Weight: `300`.
- Font size: `0.9rem` mobile/base, `0.95rem` from small screens.
- Line height: `1.75rem`.
- Top margin: `28px`.
- Max width: `43rem`.
- Colour: white.
- Rule: avoid muted grey paragraph copy on dark backgrounds.

### Hero CTAs

- Elements: `BOOK A CALL`, `GET AN AUDIT`.
- Font: Montserrat.
- Font size: `0.72rem`.
- Text transform: uppercase.
- Letter spacing: `0.2em`.
- Weight: `500`.
- Primary visual: muted lavender fill.
- Secondary visual: quiet bordered dark button.
- Height: minimum `3.45rem`.
- Horizontal padding: `24px`.
- Radius: `4px`.
- Desktop width: minimum `17.5rem`.
- Primary border: `#c3b4d6`.
- Primary background: `#c3b4d6`.
- Primary text: `#06040a`.
- Primary hover background: `#d2c6df`.
- Primary shadow: `0 18px 60px rgba(195,180,214,0.18)`.
- Secondary border: `rgba(255,255,255,0.16)`.
- Secondary background: `rgba(255,255,255,0.018)`.
- Secondary hover border: `rgba(255,255,255,0.34)`.
- Secondary hover background: `rgba(255,255,255,0.045)`.

### Services Section

- Element: `<section id="services" aria-label="Services">`.
- Position: relative.
- Sticky/scroll-over animation removed from this section.
- Background: white `#ffffff`.
- Background pattern: section-local absolute overlay with lavender radial wash `rgba(195,180,214,0.18)` and subtle 64px grid lines `rgba(23,18,31,0.034)`/`rgba(23,18,31,0.026)`, masked out toward the lower section.
- Stack level: `z-index: 20`, so it scrolls over the sticky hero and then continues in normal document flow.
- Padding: `0 4px 80px` across breakpoints for the services section outer gutter, with bottom padding staying `80px` mobile, `96px` small screens, `112px` large screens.
- Section-wide media max width: none; the client media strip now runs full width inside the section gutter.
- Client case-study grid position: first element, flush to top of white services section and separated from the narrower services intro wrapper.
- Client case-study presentation: one scroll-linked horizontal carousel across all breakpoints; mobile shows one card at a time while larger screens show a wider editorial rail.
- Client case-study carousel top padding: `4px`.
- Client case-study grid items: `8` cards total, currently repeating the four loaded project images to fill the layout.
- Client case-study carousel wrapper: dedicated scroll scene with dynamic height of `measured rail height + horizontal travel distance`, so the section only reserves the space the shorter rail actually needs.
- Client case-study carousel viewport: `position: sticky`, `top: 0`, `overflow: hidden`, `padding-top: 4px`, with live inline height matching the measured rail height instead of a full viewport.
- Client case-study carousel track: horizontal flex row with `4px` gap and transform-only `translate3d(...)` movement tied to section scroll progress.
- Client case-study carousel motion: a requestAnimationFrame scroll loop measures the section's vertical progress and maps it from `0 -> 1` into horizontal movement from `0` to the measured negative overflow distance, so downward scroll pushes the cards left until the rail completes.
- Client case-study mobile travel tuning: under `768px`, the rail uses only the first `4` client cards and the measured horizontal travel is scaled to `42%` of the full overflow distance so the following content arrives sooner.
- Client case-study tablet travel tuning: from `768px` to `1023px`, horizontal travel is scaled to `62%` of full overflow distance.
- Client case-study carousel track height: `40svh` base, `44svh` from small screens, `48svh` from medium screens, `54svh` from `1024px+`, `58svh` from `1280px+`.
- Client case-study carousel card sizing: `calc(100vw - 8px)` basis on mobile so one card sits in view at a time, `30rem` from medium screens, `34rem` from `1024px+`, `38rem` from `1280px+`, all at `16 / 10` aspect ratio.
- Client case-study reduced-motion behavior: horizontal travel distance resolves to `0`, disabling the animated translation path.
- Client case-study image treatment: full tile image, `width: 100%`, `height: 100%`, `object-fit: cover`.
- Client case-study card style: no border, no radius, dark base `#08050d`, shadow `0 18px 50px rgba(23,18,31,0.08)`.
- Client case-study card image hover: scale to `1.035` over `500ms`.
- Client case-study card bottom treatment: dark gradient overlay from `rgba(6,4,10,0.85)` to transparent over `96px`.
- Client case-study wordmark placement: absolute bottom-left over the image gradient, `20px` inset base and `24px` from small screens.
- Client case-study wordmark typography: all brands use the same ITC Blair styling, weight `300`, `0.98rem` base, `1.18rem` from small screens, `0.12em` letter spacing, uppercase, line height `1`, white, drop shadow `0 10px 24px rgba(0,0,0,0.42)`.
- Client case-study CTA: `View case study` under each wordmark, Montserrat, `0.62rem`, weight `500`, `0.16em` letter spacing, uppercase, white at `0.78` opacity, `8px` top margin, arrow `13px`, translates right `4px` on card hover.
- Client case-study spacing before services intro wrapper: `40px` base, `48px` from small screens, `56px` from large screens.
- Services intro top padding after carousel: `16px` base, `32px` from small screens, `48px` from large screens.
- Layout below carousel: two-column section from large screens, intro left and service boxes right.
- Services section wrapper max width: `82rem`, matching the hero section wrapper exactly.
- Two-column content max width: `82rem`.
- Desktop grid: `0.6fr 0.4fr` (60% left, 40% right).
- Desktop gap: `32px`.
- Left column: sticky only on large screens with `top: 7rem`, so the intro content holds while the service cards scroll beside it.
- Intro alignment: left.
- Services eyebrow: `What we do`, Montserrat, `0.72rem`, weight `500`, `0.24em` letter spacing, uppercase, colour `#5c516a`.
- H2: ITC Blair, weight `300`, uppercase, `0.025em` letter spacing.
- H2 sizes match hero H1: `23px` base, `23px` at `390px+`, `32px` at `640px+`, `38px` at `768px+`, `45px` at `1024px+`.
- H2 line height: `1.1`.
- H2 max width: `35rem` below desktop, `44rem` from `1024px+`.
- H2 text: `Everything your business needs to grow - one team`; `- one team` is an italic inline span at weight `300` and `rgba(23,18,31,0.7)`.
- Intro paragraph: Montserrat, weight `300`, `0.95rem`, line height `1.75rem`, max width `36rem` below desktop and `43rem` from `1024px+`, colour `#17121f`.
- Intro paragraph copy: two paragraphs covering strategy, design, development, SEO, paid media, email, retention and the full journey from first click to repeat customer.
- Services H2 scroll reveal: starts opacity `0`, y `12px`, blur `10px`; animates to opacity `1`, y `0`, blur `0`.
- Services paragraph scroll reveal: starts opacity `0`, y `10px`, blur `8px`; animates to opacity `1`, y `0`, blur `0`.
- Services text reveal trigger: Motion `whileInView`, once, amount `0.75`.
- Services text reveal timing: `1250ms`, ease `[0,0,0.2,1]`; paragraph delay `220ms`.
- CTAs: left-aligned row from small screens, Montserrat, `0.72rem`, weight `500`, `0.2em` letter spacing, uppercase, `3.25rem` minimum height.
- Next section: black background `#06040a` with a centered ITC Blair H2 reading `We create websites built to convert`, matching the hero H1 type system at `23px` / `32px` / `38px` / `45px` with weight `300` and `0.025em` letter spacing. The heading stays as one semantic `h2` and uses a single overlay reveal so the text can wrap naturally for SEO, while the base text remains visible immediately.
- Primary services CTA: background and border `#c3b4d6`, text `#06040a`.
- Secondary services CTA: border `rgba(23,18,31,0.15)`, hover border `rgba(23,18,31,0.35)`, hover background `rgba(23,18,31,0.035)`.
- Service card area: floating cards only; no enclosing panel or panel header.
- Service card grid: stacked rows in the right column at all sizes, `16px` gap, `align-items: start` to prevent row stretching.
- Service card scroll reveal: each card is a `motion.article`, initial opacity `0`, y `28px`, scale `0.98`; animates to opacity `1`, y `0`, scale `1`.
- Service card reveal trigger: `whileInView`, once, viewport amount `0.32`.
- Service card reveal timing: `1250ms`, ease `[0,0,0.2,1]`, staggered by `120ms` per card and capped at `360ms`.
- Service entries: no visible numbers.
- Service icons: Lucide icons above each title, `40px` square, `5px` radius, `16px` bottom margin, border `rgba(195,180,214,0.25)`, background `rgba(195,180,214,0.1)`, colour `#c3b4d6`.
- Service icon mapping: `Code2` for Website Design & Development, `SearchCheck` for SEO/AEO, `MousePointerClick` for Paid Advertising, `MailCheck` for Email/Automation.
- Service entries: dark glass boxes with radius `7px`, equal padding `24px`, content-led height, border `rgba(195,180,214,0.16)`, deep purple/black gradient, lavender radial highlight, and shadow `0 24px 70px rgba(23,18,31,0.16)`.
- Service entries hover: translate up `2px`, border `rgba(195,180,214,0.45)`, shadow `0 30px 80px rgba(23,18,31,0.22)`.
- Service card link layout: flex column, left-aligned content.
- Service title: ITC Blair, weight `300`, uppercase, `0.025em` letter spacing, `0.86rem` base, `0.94rem` from small screens, white.
- Service description: Montserrat, weight `300`, `0.84rem`, line height `1.5rem`, white.
- Service link label: Montserrat, `0.7rem`, weight `500`, `0.18em` letter spacing, uppercase, colour `#c3b4d6`, top margin `16px`, hover translate `4px`.
- Services listed: Website Design & Development; SEO, AEO & Organic Growth; Paid Advertising; Email, Automation & Retention.

### Lilac Section Placeholder

- Element: `<section aria-label="Next lilac section">`.
- Position: after services section, normal flow with higher stacking.
- Stack level: `z-index: 30`, above the white services section.
- Minimum height: `100vh`.
- Background: CTA lilac `#c3b4d6`.
- Purpose: placeholder for the next section.
