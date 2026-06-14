# CNVRT Design Rules

This document is the source of truth for visual decisions as the site evolves.

## Typography

- Hero headings use ITC Blair at a restrained size. Avoid oversized hero text.
- Current hero H1 sizes are explicit by breakpoint: `23px` under `390px`, `23px` at `390px+`, `34px` at `640px+`, `42px` at `768px+`, `56px` at `1024px+`.
- Current hero H1 max width is `58rem`.
- Hero copy is centre-aligned and sits in a single-column stack.
- The hero heading must remain a real semantic `h1`; animated inline words can sit inside it, but should not break its readability for crawlers.
- The hero section should feel tall, open, and simply structured, without a secondary form or split-panel competing with the main message.
- Avoid fluid `clamp()` sizing on key hero typography unless exact viewport behavior has been agreed.
- Header navigation and CTA labels use Montserrat, uppercase, 0.2em letter spacing, regular weight.
- Body copy uses Montserrat light, stays readable and calm, with generous line height.

## Colour

- Do not use muted grey paragraph text on dark backgrounds.
- Paragraphs on dark sections should be white or near-white with opacity only when it still reads clearly.
- Current hero paragraph colour: white.
- Accent colour is currently muted lavender `#c3b4d6`, used sparingly for primary CTAs and fine hero details.

## Background

- Use a clean dark background with a subtle grid.
- Do not use fuzzy noise, grain, blur speckle, or dirty texture overlays.
- Background effects should support the layout, not become visible decoration.

## Header

- Header should feel premium and important because it appears across the site.
- Use a floating glass panel with a fine border.
- Header scrolls away after a small scroll.
- Keep nav minimal until full site IA is decided.

## Motion

- Motion should be subtle: entrance fades and small CTA hover movement.
- Scroll handoffs should stay simple: hold the hero with CSS sticky positioning and let the next section scroll over it.
- Do not add JavaScript scroll-progress animation to the hero unless there is a clear design reason.
- Avoid decorative dashboard widgets or excessive tech graphics in the hero.
- Keep active-state accents restrained to a single purple tone on progress indicators or tags.
