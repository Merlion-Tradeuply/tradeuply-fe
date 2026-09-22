# TradeUply Light Hero — Design QA

## Evidence

- Source visual truth: `design-reference/option-1-light.png`
- Desktop implementation: `design-reference/implementation-light-desktop-final.png`
- Mobile implementation: `design-reference/implementation-light-mobile-final.png`
- Full-view comparison: `design-reference/comparison-light-final.png`
- Focused header comparison: `design-reference/comparison-light-header.png`
- Focused hero-copy comparison: `design-reference/comparison-light-copy.png`
- State: light-theme home hero, navigation closed, page at top
- Desktop CSS viewport: 1440 × 1024 at deviceScaleFactor 1
- Mobile CSS viewport: 390 × 844 at deviceScaleFactor 1
- Source pixels: 1487 × 1058, normalized to 1440 × 1024 for comparison
- Desktop screenshot pixels: 1440 × 1024; no density normalization required
- Mobile screenshot pixels: 390 × 844; no density normalization required

## Full-view comparison evidence

The final side-by-side comparison confirms the selected composition: premium floating light navbar, left-aligned SEO hero copy, globe and glass T+U market sculpture on the right, paired CTAs, and the centered benefit strip at the bottom. Major-region proportions, section height, background crop, and vertical hierarchy match the source closely.

## Focused comparison evidence

- Header: the official full TradeUply logo, navigation grouping, active Home treatment, Log In link, Open Account CTA, border, radius, and elevation are present and aligned with the selected visual.
- Hero copy and controls: Manrope matches the logo's geometric character; the heading wrapping, supporting-copy line breaks, button dimensions, spacing, colors, and contrast track the source. The focused crops make these details readable, so no additional crop was necessary.

## Required fidelity surfaces

- Fonts and typography: passed. Manrope Variable is used consistently; display weight, responsive `clamp()` sizing, line height, letter spacing, wrapping, and body hierarchy are faithful and readable.
- Spacing and layout rhythm: passed. Navbar height, desktop content offsets, CTA spacing, responsive padding, hero height, benefit-strip placement, radii, and shadows have no actionable P0/P1/P2 mismatch.
- Colors and visual tokens: passed. Porcelain white, TradeUply navy, emerald CTA, pale green active state, border opacity, and light shadow tokens match the reference direction and meet contrast needs.
- Image quality and asset fidelity: passed. The hero uses a dedicated high-resolution raster background generated from the selected visual; the official supplied logo is used in the navbar. No CSS/div/SVG approximation replaces custom artwork.
- Copy and content: passed. Navbar labels, eyebrow, H1, supporting paragraph, CTAs, and benefit labels match the selected visual and approved SEO copy.

## Interaction and responsive checks

- Mobile menu opens, exposes all navigation links, closes, and restores body scrolling.
- Discover TradeUply targets `#market-access` and scrolls to the benefit strip.
- Desktop and mobile have zero horizontal overflow.
- Primary and secondary links expose clear hover and focus-visible states.
- Browser console checked in the production build: no errors or warnings.
- Production build, TypeScript validation, and ESLint all passed.

## Comparison history

1. Initial desktop pass: P1 background containment exposed a visible image edge and compressed the intended full-bleed composition. Fixed by placing the raster in a full-width, bottom-aligned image stage and using an intentional cover crop.
2. Second pass: P2 navbar height/navigation proportions and hero offsets drifted from the source. Fixed by increasing navbar height and logo scale, widening navigation items, and aligning desktop hero content to the reference grid.
3. Third pass: P2 CTA height/spacing, inherited primary-button text color, and desktop body-copy wrapping differed. Fixed by using 60 px button height, source-like CTA widths/gap, removing the overriding global link color, tuning the responsive heading size, and adding desktop-only semantic line breaks.
4. Final pass: the combined full-view and focused comparisons show no remaining actionable P0/P1/P2 findings. The small difference between the generated source's globe crop and the production background crop is acceptable P3 variation caused by separating the background from the UI for accessible HTML.

## Findings

- No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- P3: the source mock's globe begins slightly lower than the production crop. The current crop keeps the sculpture visible across responsive widths and is accepted for implementation.

## Final result

final result: passed
