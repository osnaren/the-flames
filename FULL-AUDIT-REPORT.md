# FLAMES SEO audit — 22 October 2026

Scope: full-site review of the seven public sitemap pages, social previews, crawl controls, content, metadata, structured data, authenticated Google Search Console, available field performance, and the supplied competitor. **Overall assessment: needs improvement**, chiefly because of poor real-user Core Web Vitals and weak calculator-query click-through. No numeric health score: PageSpeed was rate-limited and backlink quality was not independently audited.

**Delivery state at audit completion:** local improvements implemented and validated; two Google-side maintenance actions completed or underway. The user subsequently approved production deployment from codex/netlify-temporary. Deployment and live acceptance results are recorded separately. No guarantee of ranking outcomes or blanket Google-policy certification.

## Search evidence

Authenticated Chrome, domain property `theflames.app`, Web search:

| Filter / period                                    | Clicks | Impressions |  CTR | Average position |
| -------------------------------------------------- | -----: | ----------: | ---: | ---------------: |
| All queries, 21 July–20 October                    |  26.1k |        600k | 4.4% |              5.5 |
| All queries, 23 September–20 October               |  4.25k |        165k | 2.6% |              6.5 |
| Exact `flames calculator`, 23 September–20 October |    389 |      34,783 | 1.1% |              6.9 |
| Exact `flames calculator`, 14–20 October           |    116 |      10,819 | 1.1% |              7.1 |
| Same query, India, 14–20 October                   |     60 |       9,653 | 0.6% |              7.3 |

Other last-28-days queries: `flames game` 1,218 clicks / 15,017 impressions; `how to play flames` 82 / 1,356; `flames calculator by name` 27 / 1,984. Rounded UI totals are preserved. Different-length periods are not a controlled before/after comparison.

One current Chrome search for `flames calculator`, India/English, personalization disabled, showed the competitor second and this app eighth among ordinary web results, on page one. Google displayed “Results are not personalised”; the browser remained signed in and Google used device location. This is one snapshot, not a universal ranking. Results vary by location, device, time and search layout.

## Verified findings

| Area                     | Severity / confidence | Evidence and impact                                                                                                                                                                                     | Fix / current state                                                                                                                                                   |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage content         | Warning / Confirmed   | Explanatory article was wrapped in `sr-only`; ordinary visitors could not read it. It also listed search phrases instead of answering a question.                                                       | Visible server-rendered guide: rules, duplicate-letter explanation, verified example, meanings, practical questions and contextual links. Fixed locally.              |
| Search presentation      | Warning / Confirmed   | Old title led with FLAMES Game; H1 was hidden. Target-query CTR is low, although position and SERP layout also affect it.                                                                               | Natural calculator-focused title, description and visible H1. No CTR increase assumed.                                                                                |
| Performance              | Warning / Confirmed   | GSC/CrUX updated 20 October: five poor mobile and five poor desktop URLs. Mobile: INP >500ms, CLS >0.25, LCP >4s. Desktop: INP >500ms, CLS >0.25; LCP >2.5s needs improvement for five URLs.            | Removed initial page/hero/form opacity hiding, removed the root loading screen and reserved game loading geometry. Remaining profiling and field validation required. |
| Homepage indexing        | Pass / Confirmed      | Indexed; smartphone crawl 21 October 13:18:11; successful fetch; crawling/indexing allowed; Google canonical is the inspected apex homepage.                                                            | Retained canonical host and static homepage.                                                                                                                          |
| Exclusions               | Info / Confirmed      | GSC updated 16 October: seven indexed, twelve excluded. Four crawled-not-indexed examples are icons, a WOFF2 font and manifest.json.                                                                    | Do not request indexing of these resources. Redirect/canonical exclusions are not inherently errors.                                                                  |
| Historical access errors | Warning / Confirmed   | Apex/www `?ref=producthunt` examples last failed 24/26 September. Both currently resolve to apex HTTP 200. Earlier hosting incident is context, not proof of the exact cause.                           | Started Google validation on 22 October; completion pending.                                                                                                          |
| Sitemap submission       | Warning / Confirmed   | Initially only www sitemap was submitted, last read 30 December 2025.                                                                                                                                   | Submitted apex sitemap: GSC Success, last read 22 October, seven discovered pages. Old entry retained.                                                                |
| Dates                    | Warning / Confirmed   | All sitemap lastModified values used generation time; Article dateModified auto-updated, with an unverified publication date.                                                                           | Omitted synthetic dates; current About page now described as AboutPage. Fixed locally.                                                                                |
| Schema semantics         | Warning / Confirmed   | SearchAction described a name calculation; generic Game used VideoGame-only properties; API documentation was a SoftwareApplication.                                                                    | Removed misleading action/fields; API docs now TechArticle about WebAPI. Added stable site/app/organization IDs. Fixed locally.                                       |
| Share previews           | Warning / Confirmed   | Named previews explicitly returned index/follow although they duplicate the calculator.                                                                                                                 | All variants now noindex/follow with home canonical and OG/Twitter previews retained. Fixed locally.                                                                  |
| Accuracy/trust           | Warning / Confirmed   | FAQ said names were not saved despite localStorage history. Repeated shared letters were collapsed for animation while result calculation counted pairs. About included unsupported promotional totals. | Corrected storage wording/counts, added project/repository provenance and removed unsupported million-user wording. Fixed locally.                                    |
| Basic crawlability       | Pass / Confirmed      | Seven sitemap pages HTTP 200; HTTP/www redirect 301 to HTTPS apex; missing-route probe 404. Homepage link checker: zero broken links among fifteen checked.                                             | Preserve behavior. AI-crawler allowance is not a substitute for SEO or an established Google ranking signal.                                                          |
| Google reports           | Pass / Confirmed      | Manual actions and Security issues both display No issues detected.                                                                                                                                     | No observed manual penalty/security warning; not a broader algorithm certification.                                                                                   |

The finding verifier retained eleven deduplicated findings. It checks consistency; human/source review supports the findings, not a Google certification.

## Competitor and copying concern

The competitor visibly answers more practical questions: one-for-one cancellation, normalization, spelling changes, worked example and entertainment limits. Our prior article was hidden. These are useful coverage opportunities and a plausible competitive advantage, **not proof of why Google ranks them**.

This bounded comparison does not establish which site originated specific design/content, whether assets were copied, or a legal violation. No complaints, outreach or public accusations were sent. Repository history and dated captures can support a separate originality review. Avoid copying their prose, manufacturing ratings or generating masses of near-duplicate name-pair pages.

## Applying the supplied Google guidance

| Topic                  | Application                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript/SSR JSON-LD | Existing server-rendered JSON-LD is retained. Moving it into client JavaScript or adding Tag Manager provides no necessary benefit.                                                       |
| ProfilePage            | Current pages are calculator/project pages rather than qualifying creator profiles. AboutPage fits the current About content.                                                             |
| Image license metadata | Consider after verifying rights for each image and truthful license/acquisition pages. Repository license alone does not prove all CDN image rights. Deferred; no invented rights claims. |
| Movie                  | No movie lists exist in this app. Not applicable.                                                                                                                                         |
| Software app           | WebApplication describes the calculator, but a real review/rating is required for Google's Software App rich result. None fabricated. Schema validity, eligibility and ranking differ.    |
| FAQ                    | Useful visible questions included. Current Google changelog says FAQ rich results stopped 7 May 2026; no FAQ-rich-result claim or markup added.                                           |

Primary sources reviewed:

- [JavaScript-generated and server-rendered structured data](https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Image licensing metadata](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata)
- [Movie](https://developers.google.com/search/docs/appearance/structured-data/movie)
- [Software app requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Spam policies, including hidden text](https://developers.google.com/search/docs/essentials/spam-policies)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Current documentation updates](https://developers.google.com/search/updates)
- [Search-box retirement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box)

Bundled SEO references predate this audit and still describe older FAQ eligibility; current primary Google documentation takes precedence.

## Validation and limitations

- Final production build passed. Homepage remains static and share route dynamic. Local checks used mock data/non-production Supabase settings and blank Sentry upload credentials. No production database writes.
- Typecheck passed. Lint: zero errors, one existing API-doc accessibility warning at error-codes.tsx:23, tabIndex on a noninteractive element.
- Fourteen Playwright checks passed against the production build on desktop/mobile Chromium, with retries disabled: JavaScript-free guide, hydrated layout/overflow, JSON-LD, canonical, three preview variants, sitemap membership/dates, secondary schema, worked example and repeated-letter cancellation.
- Final local/live HTTP crawls saved separately. JSON-LD helper validation passed on local home/About/API HTML; not equivalent to Google Rich Results Test.
- PageSpeed API rate-limited; no fresh Lighthouse score or numeric field LCP/INP/CLS claimed. GSC issue bands are live field evidence.
- Verification corrected an incorrect draft worked example and title/canonical test assumptions. A stale Turbopack cache was moved to the ignored evidence folder; removing the root loading screen required an explicit share-page Suspense boundary. Final build/tests passed afterward.
- No production deployment/post-deploy acceptance, Rich Results Test, backlink-authority assessment, full image-rights audit, or refreshed field outcome completed.

## Evidence map

Current raw evidence is in `seo-audit-evidence/2026-10-22/`, ignored by git. This report and action plan are reviewable source artifacts.

| Artifact                                            | Purpose                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| gsc-summary.json                                    | Transcribed UI periods, filters, metrics, indexing, field issues and actions |
| gsc-sitemap-success.jpg                             | Apex sitemap Success and seven discovered pages                              |
| google-search-india.jpg                             | One observed result layout                                                   |
| live-crawl.json / live-\*.txt                       | Current production HTTP, metadata, schema, links, image attributes, sitemap  |
| local-crawl.json / local-\*.txt                     | Final production-build responses, separate from live                         |
| homepage-firecrawl.json / competitor-firecrawl.json | Extracted live content and metadata                                          |
| robots-check.txt / broken-links.txt                 | Crawl-policy and bounded link checks                                         |
| pagespeed-mobile.json                               | API limitation                                                               |
| raw-findings.json / verified-findings.json          | Findings and deduplication                                                   |
| build.log / seo-tests.log                           | Final build/fourteen passing checks                                          |
| home-chromium.png / home-Mobile-Chrome.png          | Hydrated local desktop/mobile captures                                       |

Additional capture: `gsc-4xx-validation.jpg` records Google's validation-started state on 22 October.

See ACTION-PLAN.md for publishing and measurement order.
