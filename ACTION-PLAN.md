# FLAMES SEO action plan — 22 October 2026

## Deployed improvements

- Visible server-rendered homepage guide with original rules, verified example, meanings, useful questions and contextual links.
- Calculator-focused title/H1/description; truthful project provenance and browser-storage wording.
- Initial content no longer hidden for entrance animations; reserved game loading geometry; root loading screen removed so static guide can be read without JavaScript.
- Correct schema descriptions, no misleading SearchAction or invented freshness dates, noindex social previews with sharing retained.
- Repeated-letter animation agrees with calculator results; unsupported promotional totals removed.
- Production build, typecheck, lint and fourteen desktop/mobile checks passed. One pre-existing lint warning remains.

## Google-side work

1. Canonical apex sitemap submitted: **Success**, read 22 October, seven discovered pages.
2. Historical apex/www Product Hunt URL errors currently HTTP 200: **validation started** on 22 October. Outcome pending.
3. Homepage indexing/canonical and manual/security reports inspected. Four crawled-not-indexed examples are fonts/icons/manifest; do not request indexing for them.

## Publish the reviewed patch

**GO for this bounded patch. Production deployment was approved on 22 October 2026 for codex/netlify-temporary.** This is not a claim that all SEO/performance work is finished. The deployment and live acceptance results will be recorded separately.

- Verify the active production target/branch first. Current checkout is codex/netlify-temporary; repository deployment documentation describes the Netlify apex. Do not silently switch hosting/DNS.
- Deploy using existing production environment variables, not the mock values used locally.
- Live acceptance: new title, visible H1/guide, canonical apex, HTTP/www redirects, seven valid sitemap URLs, named share-preview OG image and noindex, primary routes and a working calculator/manual navigation.
- Run Google Rich Results Test on representative live pages, distinguishing actual eligibility from schema syntax. Inspect/request homepage recrawl after changed content is live; never request indexing of share URLs.
- If a published change fails acceptance, fix forward by reverting the release commit and letting the same branch deploy again. A failed build does not replace the published site. No DNS/database changes are part of this source patch.

## Highest-priority follow-up: field performance

GSC currently reports five poor URLs on both mobile and desktop. Local changes remove plausible contributors; field recovery is unverified.

1. Profile normal-motion mobile homepage and worst URL group: actual LCP element, layout-shift sources and event/main-thread work.
2. Investigate measured cost of full-screen particles, blurred animated orbs, background/theme hydration and non-critical bundles. Avoid attributing the GSC failures to a specific component without traces.
3. Consider static decoration and an explicit disabled RAF state on mobile/low-power devices if profiling supports it. **Proposed, not implemented.**
4. Stabilize recent-history loading/empty/populated heights if they contribute to CLS. **Proposed, not implemented.**
5. Keep critical text visible and the homepage static/CDN-served; measure interactions before claiming INP gains.
6. Start CWV validation after representative live lab improvement. Recheck rolling field data; target p75 LCP <=2.5s, INP <=200ms, CLS <=0.1. No guaranteed timetable or rank gain.

## Search intent and content priorities

| Destination   | Relevant searches                                                 | Direction                                                                                                |
| ------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| /             | flames calculator, calculator by name, flames game, flames online | Ship visible explanation; monitor query-specific CTR/position. Avoid duplicate calculator landing pages. |
| /how-it-works | how to calculate flames, how to play flames, flames rules         | Accurate complete walkthrough, contextual link back, profile interactive example.                        |
| /manual       | manual flames, paper-and-pencil flames                            | Preserve differentiated hands-on play; add context only when useful.                                     |
| /about        | who made this app, project provenance                             | Truthful creator/project links; fictional nostalgia clearly identified.                                  |
| /api-docs     | flames API, developer integration                                 | Accurate examples and documentation schema; no fabricated rating.                                        |

Prioritize helpful answers and functional quality over word counts, repeated synonyms, meta-keyword tags, unrelated schema or generated name-pair pages.

## Measure after publishing

- Record deployment date/revision. Compare the next complete 28 days with the preceding 28 using the same Web/query/country/device filters; account for seasonality and query mix.
- Baseline exact calculator query: 389 clicks / 34,783 impressions / displayed 1.1% CTR / position 6.9, 23 September–20 October. India, 14–20 October: 60 / 9,653 / 0.6% / 7.3.
- Track flames game, how to play flames and calculator by name separately. Property-wide average is not every query's rank.
- Recheck 4xx validation, sitemap read, canonical and field CWV. Discovery, indexing, rich-result eligibility and rankings are distinct.
- Inspect legitimate relevant referring links/mentions before planning outreach. Earn references through useful manual walkthrough/API/original demonstrations. No paid/spam links or third-party submissions made.

## Deferred evidence gaps

- Exact ranking causes and copying remain unestablished. One search showed competitor second/app eighth; originality chronology requires separate evidence.
- Verify image rights before adding licensing metadata. Movie is irrelevant; ProfilePage does not fit current pages.
- PageSpeed rate-limited; fresh traces remain outstanding. Live Google Rich Results Test passed on 22 October with one valid Software App item and one non-critical optional aggregateRating warning.
- Existing API-doc lint warning is not a ranking diagnosis.

Detailed evidence and primary sources: FULL-AUDIT-REPORT.md.

Production release and final acceptance are recorded in DEPLOYMENT-REPORT.md. All ten live acceptance groups passed for revision d9df394. Normal-motion Safari rapid-toggle stress tests remain unresolved; the post-deployment recrawl request failed at Google's reCAPTCHA service. Ranking and field CWV recovery remain unverified.
