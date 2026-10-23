# Performance and SEO follow-up — 23 October 2026

Scope: site-wide performance and rendering improvements for the seven canonical public pages on the existing Netlify production branch, `codex/netlify-temporary`. Lab measurements establish specific improvements; Google field CWV and rankings require later provider data.

## Findings and changes

| Area                       | Severity | Confidence | Evidence and impact                                                                                                                                                                                                                                                   | Implemented fix                                                                                                                                                                                                                                                               |
| -------------------------- | -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fonts / LCP                | Warning  | Confirmed  | Global CSS imported five Google font stylesheets alongside self-hosted `next/font` fonts. The mobile trace attributed 1.73 seconds of potential savings to render-blocking requests, including external font CSS.                                                     | Remove duplicate imports and Google Fonts preconnects; retain the existing self-hosted fonts and fallback metrics.                                                                                                                                                            |
| Initial payload            | Warning  | Confirmed  | Before interaction, the live homepage downloaded a 624 KB logo animation runtime and 1.88 MB music file.                                                                                                                                                              | Load logo animation on hover intent, start music after a user gesture, and defer settings subpanels.                                                                                                                                                                          |
| Initial JavaScript         | Warning  | Confirmed  | The homepage imported the statistics SDK and performed country detection before a game was played.                                                                                                                                                                    | Import recording/country code only after a valid calculation, without blocking the result.                                                                                                                                                                                    |
| Idle work / responsiveness | Warning  | Confirmed  | A controlled normal-motion mobile session consumed 4.41 seconds of main-thread time during five idle seconds; disabling animations reduced this to 0.54 seconds. Hiding the full-screen background also eliminated a Safari toggle timeout in the diagnostic journey. | Static backgrounds on compact/coarse-pointer/low-power devices; replace animated full-screen blur/shimmer layers with gradients. Desktop ambient particles draw once; game particles retain animation. Cancel background RAF while hidden and correct capped-DPR coordinates. |
| First interaction          | Warning  | Confirmed  | CPU sampling attributed 386 ms to constructing an unused audio context during the first click. Playback uses HTML audio elements.                                                                                                                                     | Remove the unused context. Preserve deferred music selection and explicit enable/resume behavior.                                                                                                                                                                             |
| Device probes              | Warning  | Confirmed  | Instrumentation counted three WebGL context probes on a homepage load, although no consumer used the result.                                                                                                                                                          | Remove unused GPU context creation. Retain defensive Battery API handling.                                                                                                                                                                                                    |
| Theme updates              | Warning  | Confirmed  | Each seasonal-theme hook instance wrote global document styles and scheduled transitions.                                                                                                                                                                             | One shared theme provider owns styles and state; avoid rewriting identical CSS and remove racing transition timers.                                                                                                                                                           |
| Charts / CLS               | Warning  | Confirmed  | Live mobile Lighthouse recorded CLS 0.246 when asynchronously populated overview statistics pushed the chart panel down.                                                                                                                                              | Render the overview shell from the server, keep the tagline area reserved, and maintain the panel's height across loading/data states. A representative local mock-data audit then recorded CLS 0.                                                                            |
| Primary content / LCP      | Warning  | Confirmed  | Supporting pages hid key content behind entrance animations and route loading boundaries. The manual form originally required client rendering.                                                                                                                       | Show headings/intros immediately; render the manual form and chart shell in initial HTML. Lazy-load the manual experiences after selection. Remove loading boundaries from static public routes.                                                                              |
| Early typing               | Warning  | Confirmed  | WebKit checks reproduced entered text being cleared when typing preceded hydration.                                                                                                                                                                                   | Keep name inputs disabled until React and stored preferences are ready; verify typed values persist.                                                                                                                                                                          |

## Measurement baseline

Lighthouse 13.0.1, Chromium 149, mobile defaults: 412 × 823, simulated slow mobile network and 4× CPU slowdown. Three homepage runs on the previous live revision produced median performance **56**, LCP **3.53 s**, TBT **818 ms**, and payload **3.39 MB**. Scores and blocking time varied substantially between runs; these are local lab estimates, not Google field percentiles. TBT is not INP.

The initial optimized local profile reduced five-second idle main-thread time from **4.41 s to 0.59 s**, and the five theme-toggle event durations from **184–296 ms to 64–80 ms**. This profile preceded the additional first-click audio fix. It does not establish whole-session field INP.

The authenticated Chrome Search Console report inspected on 23 October was last updated **21 October**. It still showed five poor mobile and five poor desktop URLs. The mobile group LCP was **4.4 s**, INP **688 ms**, and CLS **1.15**. Example URLs: `/`, `/how-it-works`, `/about`, `/manual`, `/charts`. These values predate this release.

The first live optimized revision exposed a separate post-load problem: the full animated game produced CLS **0.904 mobile / 0.651 desktop**. Load-only Lighthouse did not capture it. Changing stage heights moved the title/guide, and the fixed reveal overlay animated its box dimensions. The follow-up reserves the game workspace and processing subpanels, and uses transforms for the reveal rings/glow.

On published revision `71694bf`, an unthrottled Playwright journey using `web-vitals`, from initial load through the complete animated result, measured:

| Profile                   |     LCP |   INP |      CLS | Page errors |
| ------------------------- | ------: | ----: | -------: | ----------: |
| Mobile (Pixel 5 viewport) | 2.336 s | 64 ms | 0.002534 |           0 |
| Desktop (1365 × 768)      | 1.712 s | 40 ms | 0.000709 |           0 |

These are individual synthetic sessions, not real-user percentiles or representative INP coverage of every interaction. The figures are not directly comparable to Lighthouse's simulated slow-mobile results.

## Verification and deployment

Production build, TypeScript and lint pass. The initial release gate passed **98 checks**, with six browser-capability skips, across desktop Chromium/WebKit and mobile Chrome/Safari. Checks cover initial media requests, music enable/resume, saved-history layout stability, no-JavaScript content, hydration/input preservation, schemas/canonicals, sharing, and the previous Sentry failure paths. The layout follow-up passed **12 performance checks** on desktop/mobile Chromium and **20 Safari hydration/Sentry checks**, with two browser-capability skips. Earlier broad sweeps were interrupted to fix the failures they exposed; they are not reported as a fully passing suite.

All **14 production acceptance groups passed** on `71694bf`, published by Netlify at **21:52:13 IST on 23 October**. They cover canonical pages, schemas/guide without JavaScript, sharing/OG images, robots/sitemap/redirects, API success/validation, the unsupported-action guard, desktop/mobile calculation/history/reset, battery fallbacks, normal-motion mobile Safari result/confetti/reset, manual play and live charts. The first revision's manual-return check needed a focused retry; the complete later run passed every group.

Page-load audits also identified an external Product Hunt badge setting third-party cookies and a footer heading-level skip. The cleanup replaces the external image with a same-size direct link and uses second-level footer headings. No third-party badge request is needed to display the link.

Final runtime **`99e5cd86f277c5222340e4950bc834930dbc394f`** was published at **22:06:20 IST**, Netlify deploy **`6adb8cc8da6da62ccdfae346`**, state ready. The final seven-page/API smoke check passed. Fresh home/manual mobile Lighthouse audits both scored **100 accessibility, Best Practices and SEO**, confirming the footer link's contrast/accessibility-name correction. Their single-run performance scores were **86 / 81**; the manual run had a lower CPU benchmark than the earlier route series. Do not substitute those individual runs for the three-run homepage median below.

Raw diagnostic artifacts are kept locally in `seo-audit-evidence/2026-10-23/`. Local builds use mock statistics and placeholder backend credentials; production verification uses the existing provider configuration.

## Google processing and ranking

The sitemap, canonical URLs, useful visible guide, truthful structured data and noindex share previews from the previous SEO release remain in place. No fabricated ratings, irrelevant Movie/ProfilePage schema, synthetic freshness, duplicate keyword landing pages or paid/spam links are introduced.

On 23 October, Google confirmed **Started** for all six active CWV validations: mobile INP/CLS/LCP and desktop INP/CLS/LCP. Each detail page said it would complete within 28 days; refreshed mobile and desktop summaries retained all three Started states. Google still reports the pre-release poor field values; validation is not a pass.

The post-release homepage request reached Google's live indexing test, then failed to connect to its reCAPTCHA service. **Recrawl submission is unconfirmed.** The homepage remains indexed. No CAPTCHA was completed or bypassed.

Chrome's Links report showed 15 external links, including 14 to the homepage and one to charts. That small reported sample does not establish why another site ranks higher. One suspicious domain-rating-service anchor is insufficient evidence for a disavow or a manual-action diagnosis. No outreach, link purchases or complaints were made.

Recrawl requests and validation initiation are separate from successful Google processing. The acceptance record must distinguish those states. Compare complete post-release periods with identical query/country/device filters; rankings and CTR cannot be certified on deployment day.

## Published page-load measurements

Eight Lighthouse 13.0.1 audits ran sequentially against published revision `a63254a`: five mobile routes, two extra mobile homepage repetitions and desktop home. The homepage row uses medians of three mobile runs. The later badge-only correction changes link contrast and its accessible name; its separate production accessibility audit is recorded with deployment acceptance.

| Mobile page              | Performance before → after | LCP before → after | TBT before → after | After CLS | After transfer |
| ------------------------ | -------------------------: | -----------------: | -----------------: | --------: | -------------: |
| Home (three-run median)  |                    56 → 83 |      3.53 → 3.23 s |       818 → 340 ms |   0.00033 |        0.62 MB |
| Charts                   |                    34 → 86 |      3.43 → 2.05 s |     5,904 → 402 ms |         0 |        0.66 MB |
| Manual                   |                    35 → 89 |     18.81 → 1.78 s |     4,986 → 348 ms |         0 |        0.60 MB |
| How it works             |                    48 → 84 |      3.45 → 2.26 s |     8,143 → 423 ms |         0 |        0.64 MB |
| About (no before sample) |                     — → 95 |         — → 1.92 s |         — → 115 ms |   0.00342 |        0.81 MB |

Desktop home scored **96**, LCP **0.90 s**, TBT **27 ms**, CLS **0.00056**. All eight audits scored **100 for SEO and Best Practices**. These scores are bounded automated checks, not a certification of every SEO/accessibility requirement. The intermediate footer link produced accessibility findings, which prompted its contrast/name correction.

Homepage transfer decreased approximately **82%** and median TBT **58%**. Mobile homepage LCP varied **2.87–3.76 s**, and its median remains above the 2.5-second target. Simulated performance is still sensitive to CPU/network conditions; field recovery and broad interaction coverage remain open evidence requirements.

## Official guidance applied

- [Google: optimize LCP](https://web.dev/articles/optimize-lcp) — identify the actual LCP element and reduce rendering/resource delays.
- [Google: optimize INP](https://web.dev/articles/optimize-inp) — reduce event work and presentation delay; measure actual interactions.
- [Google: optimize CLS](https://web.dev/articles/optimize-cls) — reserve space for content that arrives later and inspect post-load shifts.
- [Next.js: font optimization](https://nextjs.org/docs/app/getting-started/fonts) — serve fonts through `next/font` without browser requests to Google.
- [Next.js: lazy loading](https://nextjs.org/docs/app/guides/lazy-loading) — defer optional components and libraries until needed.
- [Google Search Central: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) — evaluate real-user LCP, INP and CLS; good performance alone does not establish a top ranking.
