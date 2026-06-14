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
- Hero background gradient is static, with an extended bottom fade (`18rem` tall) from the purple-black hero into the flat black next section.
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
- H1 copy: `The manchester digital growth agency building brands properly`, with `building brands properly` styled italic at lighter contrast (`rgba(255,255,255,0.72)`).

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
- Mobile hero media layout: primary frame expands to a wider `6 / 5` aspect ratio on smaller screens and `5 / 4` from small screens upward within a `24rem`-`28rem` max-width block, while the secondary frame becomes a smaller bottom-right inset at `46%` width with extra bottom padding on the container to fully contain the overlap.
- Mobile hero media spacing: image composition gets additional top inset (`24px` mobile, `32px` from small screens) and larger bottom spacing before the H1 (`96px` mobile, `112px` from small screens).
- Mobile hero media alignment: right-aligned within the text column so the overlapped stack clears the copy below.
- Hero media motion: two staged fade-and-lift entrances with soft rotation, guarded by reduced-motion preferences.

### Case Studies Section

- Element: standalone section between the hero and services sections.
- Background: black `#06040a` across breakpoints, matching the section below so the hero fade lands into a consistent dark field.
- Purpose: dedicated case-study carousel section separating the purple hero from the black `What we do` section.
- Presentation: horizontal case-study carousel with wordmarks and `View case study` CTA overlays.
- Section label: `Brands we've worked with` across breakpoints; rendered in white.
- Carousel layout: horizontally scrollable flex rail with snap points; cards show at roughly `88%` width on mobile, `48%` on medium screens, and `32.3%` on large screens so desktop shows 3 cards at once.
- Carousel controls: right-aligned previous/next circular buttons above the rail.
- Carousel controls: visible across breakpoints as simple arrow controls with no circular outline treatment.
- Carousel loop: infinite loop behavior using a tripled track; the viewport starts on the middle copy and silently resets when reaching either edge.
- Section spacing: additional bottom padding under the carousel (`40px` mobile, `48px` small screens, `64px` large screens).
- Motion: no scroll-linked scene behavior; cards sit in normal flow with native horizontal scrolling, snap behavior, and button-driven smooth scroll only. No hover animation on cards or CTA overlays.

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
- Hero CTA layout: single-row flex layout on mobile and larger screens, wrapping only if space is genuinely exhausted.

### Services Section

- Element: `<section id="services" aria-label="Services">`.
- Position: relative.
- Background: black `#06040a`.
- Background pattern: none. The section is a flat black fill with no gradient, grid, or texture overlay.
- Stack level: `z-index: 20`, so it scrolls over the sticky hero and then continues in normal document flow.
- Padding: `0 4px 80px` across breakpoints for the services section outer gutter, with bottom padding staying `80px` mobile, `96px` small screens, `112px` large screens.
- Section-wide media max width: none; the client media strip now runs full width inside the section gutter.
- Client case-study grid position: moved out of the services section into its own standalone case studies section between the hero and services.
- Client case-study presentation: horizontal snap carousel across breakpoints.
- Client case-study carousel status: active again in the live page as a standalone section.
- Client case-study carousel top padding: `4px`.
- Client case-study grid items: `8` cards total, currently repeating the four loaded project images to fill the layout.
- Client case-study mobile stack: visible below `768px`, one card per row with `4px` vertical gap and no scroll-linked or swipe carousel behavior.
- Client case-study mobile card sizing: full available width inside the `4px` section gutter, `16 / 10` aspect ratio.
- Client case-study mobile reveal: each stacked card animates in one by one on scroll, starting at opacity `0`, `28px` lower, and `0.985` scale, then easing to full opacity/position over `950ms` with `120ms` stagger and viewport trigger amount `0.55`.
- Client case-study card sizing: `16 / 10` aspect ratio across the responsive carousel rail.
- Client case-study image treatment: full tile image, `width: 100%`, `height: 100%`, `object-fit: cover`.
- Client case-study card style: no border, no radius, dark base `#08050d`, no shadow on mobile, and shadow `0 18px 50px rgba(23,18,31,0.08)` from large screens upward.
- Client case-study card image hover: scale to `1.035` over `500ms`.
- Client case-study card bottom treatment: dark gradient overlay from `rgba(6,4,10,0.85)` to transparent over `96px`.
- Client case-study wordmark placement: absolute bottom-left over the image gradient, `20px` inset base and `24px` from small screens.
- Client case-study wordmark typography: all brands use the same ITC Blair styling, weight `300`, `0.98rem` base, `1.18rem` from small screens, `0.12em` letter spacing, uppercase, line height `1`, white, drop shadow `0 10px 24px rgba(0,0,0,0.42)`.
- Client case-study wordmarks: forced to a single line with `white-space: nowrap`; mobile base size trimmed to `0.9rem` before returning to `0.98rem`, and desktop base size trimmed to `1.02rem` / `1.08rem` before `1.18rem` on larger screens so longer names such as `Heatons Furniture` stay on one line.
- Client case-study CTA: `View case study` under each wordmark, Montserrat, `0.62rem`, weight `500`, `0.16em` letter spacing, uppercase, white at `0.78` opacity, `8px` top margin, arrow `13px`, translates right `4px` on card hover.
- Services intro top padding at section start: `40px` base, `56px` from small screens, `64px` from large screens.
- Layout below carousel: two-part section with an editorial intro block first, then the service list below it. The intro block becomes a 2-column layout from large screens with one image on the left and the text content on the right.
- Services section wrapper max width: `82rem`, matching the hero section wrapper exactly.
- Services content wrapper side padding: `16px` on mobile, `24px` from small screens, `0` from large screens upward; this applies only to the services copy/card section, not the image carousel above it.
- Content max width: `82rem`.
- Intro alignment: left.
- Services intro layout: `lg:grid-cols-[minmax(0,0.44fr)_minmax(0,1fr)]` with one editorial image on the left, `48px` gap at large screens and `64px` at extra-large screens.
- Services intro image: single framed placeholder image using `/topdraw.jpg`, `6 / 5` aspect ratio on mobile, `5 / 4` from small screens, and `5 / 6` from large screens upward, with `10px` radius, subtle white border, and dark shadow.
- Services eyebrow: `What we do`, Montserrat, `0.72rem`, weight `500`, `0.24em` letter spacing, uppercase, white.
- H2: ITC Blair, weight `300`, uppercase, `0.025em` letter spacing.
- H2 sizing and measure closely track the `Why CNVRT` H2 system: `23px` base, `23px` at `390px+`, `32px` at `640px+`, `38px` at `768px+`, `52px` at `1024px+`, line height `1.08`, max width `22rem` base, `24rem` at `390px+`, `32rem` at `640px+`, `38rem` at `768px+`, `50rem` at `1024px+`.
- H2 text: `Everything your business needs to grow - one team`; `- one team` remains italic. The heading is a single semantic `h2` with no fill animation and solid white styling.
- Services H2 optical alignment: nudged left by `0.04em` to counter the font's built-in left sidebearing and align visually with the eyebrow and paragraph.
- Intro paragraph sizing and measure now match the service text column width more closely: Montserrat, weight `300`, `0.9rem` base, `0.95rem` from small screens, line height `1.75rem`, max width `42rem` through medium screens and `56rem` from large screens, rendered in white tones.
- Intro paragraph copy: one continuous paragraph covering strategy, design, development, SEO, paid media, email, retention and the full journey from first click to repeat customer.
- Services paragraph fill: word-by-word white fill on scroll, shifting from muted white `rgba(255,255,255,0.3)` to bright white `rgba(255,255,255,0.92)` with the same delayed progress map used in `Why CNVRT`, so the paragraph starts later and completes more gradually than the heading.
- Services text progress driver: requestAnimationFrame-backed section observer using the intro block's `getBoundingClientRect()`, beginning near `84%` of viewport height and completing near `22%`.
- CTAs: left-aligned row from small screens, Montserrat, `0.72rem`, weight `500`, `0.2em` letter spacing, uppercase, `3.25rem` minimum height.
- Primary services CTA: background and border `#c3b4d6`, text `#06040a`.
- Secondary services CTA: border `rgba(255,255,255,0.16)`, hover border `rgba(255,255,255,0.34)`, hover background `rgba(255,255,255,0.045)`, white text.
- Services list area: clean editorial numbered list with no enclosing panel or cards.
- Services list spacing: `40px` top margin base and `48px` from small screens.
- Services list structure: top border on the full list, bottom borders on each item, and top rules on each item all use the same very low-opacity white (`0.05`) for a consistent separation treatment.
- Services list motion: none. Rows render statically with standard hover transitions only.
- Service entries: no visible numbers.
- Service icons: Lucide icons in a circular badge with no adjacent numbering, `48px` square, low-opacity white border/background by default, shifting to lilac-accent treatment on hover.
- Service icon mapping: `Code2` for Website Design & Development, `SearchCheck` for SEO/AEO, `MousePointerClick` for Paid Advertising, `MailCheck` for Email/Automation.
- Service item layout: responsive three-part grid from small screens (`icon`, `content`, `CTA`), with `44px` vertical padding base, `48px` from small screens, `56px` from large screens, plus slightly larger row gaps; all three cells align vertically to the same horizontal row center.
- Service title: ITC Blair, weight `400`, uppercase, `0.025em` letter spacing, `0.88rem` on mobile, white at `0.72` opacity by default and bright white on hover.
- Service description: Montserrat, weight `300`, `0.9rem`, line height `1.75rem`, white at `0.62` opacity by default and brighter on hover.
- Service link label: matches the lilac `Book a call` CTA treatment with Montserrat, `0.72rem`, weight `500`, `0.2em` letter spacing, uppercase, `#c3b4d6` fill, `#06040a` text, and `4px` radius, with no glow shadow.
- Services listed: Website Design & Development; SEO, AEO & Organic Growth; Paid Advertising; Email, Automation & Retention.

### Why CNVRT Section

- Element: `<section aria-label="Why CNVRT">`.
- Position: directly after the white services section in normal document flow.
- Background: black `#06040a`.
- Layout: single-column text section.
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
