# FLAMES SEO action plan — 23 October 2026

## Delivered

The SEO, Sentry and measured performance changes are pushed on `codex/netlify-temporary` and deployed through the existing Netlify production site. Runtime revisions and bounded acceptance evidence are recorded in DEPLOYMENT-REPORT.md and CWV-IMPROVEMENTS.md.

- Visible, server-rendered calculator guide; accurate rules, worked example, meanings, useful questions and contextual links.
- Calculator-focused title/H1/description, apex canonicals, seven-page sitemap, proper 404/redirect behavior and noindex social previews with working OG images.
- Truthful structured data and provenance; no invented ratings, freshness, SearchAction, irrelevant Movie/ProfilePage markup or unverified image licensing.
- Repeated-letter animations agree with the algorithm. No-JavaScript content and early typing/hydration checks pass.
- Measured initial payload and main-thread work reduced by removing duplicate font imports, deferring media/settings/statistics, sharing the theme controller, removing unused AudioContext/WebGL creation, and simplifying backgrounds.
- Charts reserve their loading geometry. Full animated game transitions reserve space and animate transforms instead of dimensions. Saved-history loading is covered by layout tests.
- Previous Sentry failure paths retain focused fixes and regression coverage. Generic application exceptions remain reportable; historical issue groups were not bulk-resolved.
- Footer headings are corrected and the third-party Product Hunt image embed is replaced by a direct link.

## Google processing

Use signed-in **Chrome** for provider actions. A recrawl request or validation start is distinct from Google completing it.

- Homepage remains indexed. The apex sitemap previously reported **Success**, read 22 October, with seven discovered pages. Public XML and canonical routes pass current live checks.
- Historical apex/www Product Hunt 4xx validation started on 22 October; Google completion remains unconfirmed.
- The 23 October post-release recrawl request reached live testing, then Google's reCAPTCHA service failed to connect. Submission is **not confirmed**; no challenge was bypassed or solved. Existing indexing is unaffected by that failed request.
- Search Console field data last updated **21 October** still shows five poor URLs on each device. Mobile group: LCP 4.4 s, INP 688 ms, CLS 1.15. Desktop INP 519 ms and CLS 0.74. These predate the performance release.
- All six active CWV validations now show **Started**: mobile INP/CLS/LCP and desktop INP/CLS/LCP. Google says validation will complete within 28 days. A started validation does not mean field CWV passed. Targets remain p75 LCP <=2.5 s, INP <=200 ms, CLS <=0.1.

## Search intent and acquisition

| Destination   | Relevant searches                                                 | Direction                                                              |
| ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| /             | flames calculator, calculator by name, flames game, flames online | Keep the useful visible guide and monitor query-specific CTR/position. |
| /how-it-works | how to calculate flames, how to play flames, flames rules         | Maintain the accurate walkthrough and contextual calculator link.      |
| /manual       | manual flames, paper-and-pencil flames                            | Preserve the differentiated hands-on game.                             |
| /about        | creator and project provenance                                    | Maintain truthful project/creator references.                          |
| /api-docs     | flames API, developer integration                                 | Keep examples accurate and the public API working.                     |

Chrome's Search Console Links report lists **15 external links**: 14 to the homepage, one to charts. Listed domains include Reddit, ChatGate, Gridinsoft, GitHub and LinkedIn. One listed anchor advertises domain-rating services; this does not establish a manual action, justify a disavow, or prove a ranking cause. No paid links, third-party outreach or complaints were submitted.

The copying/originality claim and exact ranking causes remain unestablished. Prior search evidence showed competitor second/app eighth; a specific personal result is not a universal rank. Earn relevant references through the useful walkthrough, manual game and API; do not create duplicate keyword/name-pair landing pages or buy authority metrics.

## Follow-up that requires new evidence

1. Compare the next complete 28 post-release days with the preceding 28, using identical query/country/device filters and accounting for seasonality. Baseline exact calculator query, 23 September–20 October: **389 clicks / 34,783 impressions / 1.1% CTR / position 6.9**. India, 14–20 October: **60 / 9,653 / 0.6% / 7.3**.
2. Recheck Google's CWV validation, rolling field data, 4xx validation and sitemap processing. Lab improvements cannot certify those outcomes or guarantee a top ranking.
3. Observe Sentry over a meaningful post-release traffic window. An immediately empty release-filtered feed is only a point-in-time observation.

The previous normal-motion Safari rapid-toggle timeout was investigated and the affected checks passed after background/theme performance changes. The initial 98-check release gate, additional 12 performance checks and 20 Safari checks are detailed in CWV-IMPROVEMENTS.md. Earlier interrupted broad suites are not represented as completely green.

Detailed original audit: FULL-AUDIT-REPORT.md. Production evidence: DEPLOYMENT-REPORT.md. Error analysis: SENTRY-REMEDIATION.md.
