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
- Hero section is in normal document flow with a relative container; no sticky scene behavior.
- The following white section sits above the hero with `position: relative` and `z-index: 20`, so it scrolls up over the held hero.
- Hero inner content max width: `82rem`, matching the services section measure.
- Hero content structure: single centered content column with no secondary panel.
- Hero copy wrapper max width: `56rem`.
- Broad reusable font helper classes removed. Typography is set per element to avoid style collisions.

### Motion

- Header entrance: starts `8px` higher with opacity `0` and `blur(7px)`, settles over `500ms` while retaining scroll-hide spring behavior.
- Header scroll hide: Motion spring, stiffness `260`, damping `34`, translates to `-116px` after `window.scrollY > 110`.
- Hero reveal: H1, paragraph and CTA row animate with opacity `0 -> 1` and vertical movement `10-12px -> 0`.
- Hero reveal timing: base duration `620ms`, ease `[0, 0, 0.2, 1]`, delays `120ms`, `200ms`, `280ms`, `360ms`.
- Hero background gradient is static.
- CTA sheen: primary CTA elements use a `520ms` diagonal sheen on hover only.
- Scroll handoff: no JavaScript scroll progress, no Lenis instance, no transform/opacity mapping, and no section overlay handoff. The page uses normal native document flow.

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

- Element: hero section.
- Section position: relative.
- Section minimum height: `106svh` on mobile/tablet, `100svh` from large screens.
- Section overflow: hidden.
- Vertical padding: `7rem` mobile, `8rem` from large screens.
- Horizontal padding: `16px` mobile, `24px` from small screens, `0` from large screens, matching the other section wrappers.
- Layout: editorial two-column split from large screens, with a left copy column and a right image column.
- Hero copy alignment: left.
- Desktop hero grid: `minmax(0,1fr) minmax(18rem,30%)`, with `40px` gap at large screens and `56px` gap at extra-large screens.
- Mobile/tablet hero layout: single left-aligned copy column; image composition hidden below desktop.

### H1

- Element: main hero heading.
- Font: ITC Blair.
- Weight: `300`.
- Letter spacing: `0.035em`.
- Text transform: uppercase.
- Desktop size: `56px`.
- Mobile/base size under `390px`: `26px`.
- `390px+` size: `28px`.
- `640px+` size: `32px`.
- `768px+` size: `38px`.
- `1024px+` size: `56px`.
- Line height: `1.18`.
- Max width: `22rem` base, `24rem` at `390px+`, `32rem` at `640px+`, `38rem` at `768px+`, `54rem` at `1024px+`, matching the other section heading measures.
- Colour: `rgba(255,255,255,0.9)`.
- Alignment: left.
- H1 copy: `The manchester digital growth agency building brands properly`.

### Hero Paragraph

- Element: paragraph below hero heading.
- Font: Montserrat.
- Weight: `300`.
- Font size: `0.9rem` mobile/base, `0.95rem` from small screens.
- Line height: `1.75rem`.
- Top margin: `28px`.
- Max width: `21rem` base, `30rem` from small screens, `43rem` from large screens.
- Colour: white.
- Rule: avoid muted grey paragraph copy on dark backgrounds.

### Hero Images

- Hero media: editorial image composition visible across breakpoints; on desktop it occupies roughly `30%` of the hero width in the right column, while on mobile/tablet it lives inside the left/text column and appears before the eyebrow and copy in a simplified stacked composition.
- Hero media composition: two overlapping portrait images, using `/ya-omri.jpg` as the primary large frame and `/hair-made-easi.jpg` as the smaller overlapping detail frame.
- Primary image frame: `4 / 5` aspect ratio, `10px` radius, subtle white border `rgba(255,255,255,0.10)`, shadow `0 24px 80px rgba(0,0,0,0.38)`.
- Secondary image frame: `58%` width of the desktop media column, `4 / 5` aspect ratio, `10px` radius, offset to the lower-left with slight rotation for an editorial overlap.
- Mobile hero media layout: primary frame expands to a wider `6 / 5` aspect ratio on smaller screens and `5 / 4` from small screens upward within a `22rem`-`26rem` max-width block, while the secondary frame becomes a smaller bottom-right inset at `46%` width with extra bottom padding on the container to fully contain the overlap.
- Mobile hero media spacing: image composition gets additional top inset (`24px` mobile, `32px` from small screens) and larger bottom spacing before the H1 (`96px` mobile, `112px` from small screens).
- Mobile hero media alignment: right-aligned within the text column so the overlapped stack clears the copy below.
- Hero media motion: two staged fade-and-lift entrances with soft rotation, guarded by reduced-motion preferences.

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
- Background: black `#06040a`.
- Background pattern: none. The section is a flat black fill with no gradient, grid, or texture overlay.
- Stack level: `z-index: 20`, so it scrolls over the sticky hero and then continues in normal document flow.
- Padding: `0 4px 80px` across breakpoints for the services section outer gutter, with bottom padding staying `80px` mobile, `96px` small screens, `112px` large screens.
- Section-wide media max width: none; the client media strip now runs full width inside the section gutter.
- Client case-study grid position: first element, flush to top of white services section and separated from the narrower services intro wrapper.
- Client case-study presentation: split by breakpoint. Mobile uses a simple single-column image stack; tablet/desktop use the scroll-linked horizontal rail.
- Client case-study carousel status: preserved in component code behind a local feature flag and removed from the live page for now, so it can be restored later without rebuilding it.
- Client case-study carousel top padding: `4px`.
- Client case-study grid items: `8` cards total, currently repeating the four loaded project images to fill the layout.
- Client case-study mobile stack: visible below `768px`, one card per row with `4px` vertical gap and no scroll-linked or swipe carousel behavior.
- Client case-study mobile card sizing: full available width inside the `4px` section gutter, `16 / 10` aspect ratio.
- Client case-study mobile reveal: each stacked card animates in one by one on scroll, starting at opacity `0`, `28px` lower, and `0.985` scale, then easing to full opacity/position over `950ms` with `120ms` stagger and viewport trigger amount `0.55`.
- Client case-study scroll-linked carousel wrapper: visible from `768px+`, dedicated scroll scene with dynamic height of `measured rail height + horizontal travel distance`, so the section reserves only the space needed for horizontal travel after the rail reaches the top.
- Client case-study scroll-linked carousel viewport: `position: sticky`, `top: 0`, `overflow: hidden`, `padding-top: 4px`, with live inline height matching the measured scene height.
- Client case-study scroll-linked carousel track: horizontal flex row with `4px` gap and transform-only `translate3d(...)` movement tied to section scroll progress.
- Client case-study scroll-linked carousel motion: a requestAnimationFrame loop measures the section's vertical progress and maps it directly into horizontal movement from `0` to the measured negative overflow distance, so the rail starts flush to the top of the white section and scrolls horizontally until the scene ends.
- Client case-study tablet travel tuning: from `768px` to `1023px`, horizontal travel is scaled to `62%` of full overflow distance.
- Client case-study desktop travel tuning: from `1024px+`, horizontal travel is scaled to `72%` of full overflow distance so the services content arrives sooner after the rail.
- Client case-study scroll-linked track height: `48svh` from `768px+`, `54svh` from `1024px+`, `58svh` from `1280px+`.
- Client case-study scroll-linked card sizing: `30rem` from `768px+`, `34rem` from `1024px+`, `38rem` from `1280px+`, all at `16 / 10` aspect ratio.
- Client case-study reduced-motion behavior: horizontal travel distance resolves to `0`, disabling the animated translation path.
- Client case-study image treatment: full tile image, `width: 100%`, `height: 100%`, `object-fit: cover`.
- Client case-study card style: no border, no radius, dark base `#08050d`, shadow `0 18px 50px rgba(23,18,31,0.08)`.
- Client case-study card image hover: scale to `1.035` over `500ms`.
- Client case-study card bottom treatment: dark gradient overlay from `rgba(6,4,10,0.85)` to transparent over `96px`.
- Client case-study wordmark placement: absolute bottom-left over the image gradient, `20px` inset base and `24px` from small screens.
- Client case-study wordmark typography: all brands use the same ITC Blair styling, weight `300`, `0.98rem` base, `1.18rem` from small screens, `0.12em` letter spacing, uppercase, line height `1`, white, drop shadow `0 10px 24px rgba(0,0,0,0.42)`.
- Client case-study wordmarks: forced to a single line with `white-space: nowrap`; mobile base size trimmed to `0.9rem` before returning to `0.98rem`, and desktop base size trimmed to `1.02rem` / `1.08rem` before `1.18rem` on larger screens so longer names such as `Heatons Furniture` stay on one line.
- Client case-study CTA: `View case study` under each wordmark, Montserrat, `0.62rem`, weight `500`, `0.16em` letter spacing, uppercase, white at `0.78` opacity, `8px` top margin, arrow `13px`, translates right `4px` on card hover.
- Client case-study spacing before services intro wrapper: `40px` base, `48px` from small screens, `32px` from large screens.
- Services intro top padding after carousel or section start: `40px` base, `56px` from small screens, `64px` from large screens.
- Layout below carousel: one-column section at all breakpoints, with the intro text first and the service boxes below it.
- Services section wrapper max width: `82rem`, matching the hero section wrapper exactly.
- Services content wrapper side padding: `16px` on mobile, `24px` from small screens, `0` from large screens upward; this applies only to the services copy/card section, not the image carousel above it.
- Content max width: `82rem`.
- Intro alignment: left.
- Services eyebrow: `What we do`, Montserrat, `0.72rem`, weight `500`, `0.24em` letter spacing, uppercase, white.
- H2: ITC Blair, weight `300`, uppercase, `0.025em` letter spacing.
- H2 sizing and measure now match the `Why CNVRT` H2 exactly: `23px` base, `23px` at `390px+`, `32px` at `640px+`, `38px` at `768px+`, `56px` at `1024px+`, line height `1.08`, max width `22rem` base, `24rem` at `390px+`, `32rem` at `640px+`, `38rem` at `768px+`, `54rem` at `1024px+`.
- H2 text: `Everything your business needs to grow - one team`; `- one team` remains italic. The heading is a single semantic `h2` with no fill animation and solid white styling.
- Services H2 optical alignment: nudged left by `0.04em` to counter the font's built-in left sidebearing and align visually with the eyebrow and paragraph.
- Intro paragraph sizing and measure now match the `Why CNVRT` paragraph exactly: Montserrat, weight `300`, `0.9rem` base, `0.95rem` from small screens, line height `1.75rem`, max width `21rem` base, `30rem` from small screens, `38rem` from medium screens, `56rem` from large screens, rendered in white tones.
- Intro paragraph copy: one continuous paragraph covering strategy, design, development, SEO, paid media, email, retention and the full journey from first click to repeat customer.
- Services paragraph fill: word-by-word white fill on scroll, shifting from muted white `rgba(255,255,255,0.3)` to bright white `rgba(255,255,255,0.92)` with the same delayed progress map used in `Why CNVRT`, so the paragraph starts later and completes more gradually than the heading.
- Services text progress driver: requestAnimationFrame-backed section observer using the intro block's `getBoundingClientRect()`, beginning near `84%` of viewport height and completing near `22%`.
- CTAs: left-aligned row from small screens, Montserrat, `0.72rem`, weight `500`, `0.2em` letter spacing, uppercase, `3.25rem` minimum height.
- Primary services CTA: background and border `#c3b4d6`, text `#06040a`.
- Secondary services CTA: border `rgba(255,255,255,0.16)`, hover border `rgba(255,255,255,0.34)`, hover background `rgba(255,255,255,0.045)`, white text.
- Services list area: clean editorial numbered list with no enclosing panel or cards.
- Services list spacing: `40px` top margin base and `48px` from small screens.
- Services list structure: top border on the full list and bottom borders on each item in low-opacity white, with a lilac active line drawing across the top edge of each item as it enters view.
- Services list motion: each row fades up from lower opacity and `26px` lower on scroll, then settles into place with an active highlight treatment.
- Service entries: no visible numbers.
- Service icons: Lucide icons in a circular badge with no adjacent numbering, `48px` square, low-opacity white border/background by default, shifting to lilac-accent treatment on hover.
- Service icon mapping: `Code2` for Website Design & Development, `SearchCheck` for SEO/AEO, `MousePointerClick` for Paid Advertising, `MailCheck` for Email/Automation.
- Service item layout: responsive three-part grid from small screens (`icon`, `content`, `CTA`), with `28px` vertical padding base, `32px` from small screens, `36px` from large screens; all three cells align vertically to the same horizontal row center.
- Service title: ITC Blair, weight `400`, uppercase, `0.025em` letter spacing, `0.98rem`, white at `0.72` opacity by default and bright white on hover.
- Service description: Montserrat, weight `300`, `0.9rem`, line height `1.75rem`, white at `0.62` opacity by default and brighter on hover.
- Service link label: matches the lilac `Book a call` CTA treatment with Montserrat, `0.72rem`, weight `500`, `0.2em` letter spacing, uppercase, `#c3b4d6` fill, `#06040a` text, `4px` radius, and lavender shadow.
- Services listed: Website Design & Development; SEO, AEO & Organic Growth; Paid Advertising; Email, Automation & Retention.

### Why CNVRT Section

- Element: `<section aria-label="Why CNVRT">`.
- Position: directly after the white services section in normal document flow.
- Background: black `#06040a`.
- Text alignment: left, matching the services intro text block.
- Horizontal padding: inherited from the inner content wrapper with `16px` mobile, `24px` from small screens, `0` from large screens, matching the services text block exactly.
- Vertical padding: `96px` mobile, `112px` from small screens, `128px` from large screens.
- Content wrapper max width: `82rem`, matching hero and services sections.
- Eyebrow styling matches the hero eyebrow exactly.
- Eyebrow font: Montserrat.
- Eyebrow font size: `0.72rem`.
- Eyebrow font weight: `500`.
- Eyebrow letter spacing: `0.24em`.
- Eyebrow text transform: uppercase.
- Eyebrow colour: `rgba(255,255,255,0.48)`.
- Eyebrow content: `Why CNVRT`.
- H2 styling matches the hero H1 type system.
- H2 font: ITC Blair.
- H2 font weight: `300`.
- H2 letter spacing: `0.025em`.
- H2 text transform: uppercase.
- H2 alignment: left.
- H2 sizes: `23px` base, `23px` at `390px+`, `32px` at `640px+`, `38px` at `768px+`, `56px` at `1024px+`.
- H2 line height: `1.08`.
- H2 max width: `22rem` base, `24rem` at `390px+`, `32rem` at `640px+`, `38rem` at `768px+`, `54rem` at `1024px+`, giving the heading a wider centered desktop measure.
- H2 copy: `What's strategy without execution?`
- H2 colour: `rgba(255,255,255,0.92)`.
- Paragraph styling matches the hero paragraph type system.
- Paragraph font: Montserrat.
- Paragraph font weight: `300`.
- Paragraph font size: `0.9rem` mobile/base, `0.95rem` from small screens.
- Paragraph line height: `1.75rem`.
- Paragraph top margin: `24px`.
- Paragraph max width: `21rem` base, `30rem` from small screens, `38rem` from medium screens, `56rem` from large screens for a slightly broader desktop measure.
- Paragraph alignment: left.
- Paragraph base state colour: muted white `rgba(255,255,255,0.3)`.
- Paragraph scroll-fill state colour: `rgba(255,255,255,0.92)`.
- Paragraph scroll-fill behavior: word-by-word reveal with a delayed, stretched progress map, starting roughly `22%` later than the H2 and taking longer to complete so the fill reads more gradually.
- Scroll progress driver: requestAnimationFrame-backed section observer using `getBoundingClientRect()`, beginning near `84%` of viewport height and completing near `22%`, updating only when progress changes meaningfully.
- Reduced-motion behavior: full section text resolves immediately to the filled state.
