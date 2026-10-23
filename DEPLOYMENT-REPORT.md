# SEO and performance production releases

## Current release — 23 October 2026

Runtime **`99e5cd86f277c5222340e4950bc834930dbc394f`** is published at [theflames.app](https://theflames.app) from **`codex/netlify-temporary`**. Netlify confirmed production deploy **`6adb8cc8da6da62ccdfae346`**, state **ready**, published **22:06:20 IST on 23 October**. [Deploy details](https://app.netlify.com/projects/theflames/deploys/6adb8cc8da6da62ccdfae346) · [Immutable deployment](https://6adb8cc8da6da62ccdfae346--theflames.netlify.app).

The release includes the previous SEO/Sentry fixes, deferred optional media/settings/statistics, lighter mobile and idle backgrounds, shared theme state, removal of unused GPU/audio work and duplicate font requests, server-rendered supporting content, protected early input, stable charts/game transitions, and accessible footer headings/link without a third-party badge embed. Hosting, DNS, backend schema and provider environment values were preserved.

Verification is scoped to the changes and revisions actually tested:

- Build, TypeScript and lint passed. The initial runtime gate passed **98 checks / six capability skips**. The game-layout follow-up passed **12 performance checks**, plus **20 Safari hydration/Sentry checks / two capability skips**.
- All **14 live acceptance groups passed** on `71694bf`, covering the calculator, saved history/reset, normal-motion mobile Safari/confetti, manual game, charts, APIs, schemas, sharing, crawl routes and battery fallbacks. Subsequent source edits only changed the footer.
- On final revision `99e5cd8`, all seven canonical pages and the calculator API passed the footer/content smoke check. Fresh mobile Lighthouse audits of home and manual each scored **100 accessibility, 100 Best Practices and 100 SEO**. These are bounded automated checks, not comprehensive certification.
- Sequential production audits on the preceding footer revision `a63254a` gave homepage three-run mobile medians: **performance 56 → 83**, **LCP 3.53 → 3.23 s**, **TBT 818 → 340 ms**, initial transfer **3.39 → 0.62 MB**. Desktop performance was **96**. The final home run scored **86**; it is a single run rather than a new median.
- Full animated live journeys on `71694bf` measured CLS **0.002534 mobile / 0.000709 desktop**, down from **0.904 / 0.651** before the layout follow-up. Synthetic INP was **64 / 40 ms**. Lab and field results are distinct.
- The signed-in Chrome Sentry feed filtered to the final revision showed **no matching issues** at observation time. This very short window does not establish non-recurrence or confirm complete event ingestion.

Google's refreshed reports show **Started** for all six active CWV validations, mobile/desktop INP/CLS/LCP. The apex sitemap remains **Success**, with seven discovered pages. Historical other-4xx validation remains **Started**. The homepage remains indexed, but the new recrawl request failed at Google's reCAPTCHA service; submission is unconfirmed. Field CWV, ranking recovery and CTR gains are still unproven. Mobile homepage simulated median LCP remains above 2.5 seconds.

Detailed findings, measurements and official sources: [CWV-IMPROVEMENTS.md](CWV-IMPROVEMENTS.md). Current remaining evidence requirements: [ACTION-PLAN.md](ACTION-PLAN.md). Raw local artifacts: `seo-audit-evidence/2026-10-23/`, especially `sentry-production-acceptance.json`, `footer-acceptance.json`, `live-game-vitals.json`, `live-performance-summary.json`, `final-lighthouse-summary.json`, and the Google validation/Sentry screenshots. Generated evidence is git-ignored.

## Historical release — 22 October 2026

The initial SEO improvements were deployed to the existing production site using branch `codex/netlify-temporary`. The ten production acceptance groups passed. The following records the original release and its then-open limitations; the dated follow-up above supersedes their current status.

## Published release

- Runtime revision: `d9df394beedc5910ab4397fd40549c1c36496d70`.
- Netlify project: `theflames`, ID `71bc8240-8ab4-463f-a318-e8ba276dd7c3`.
- Deploy: `6ada1dd748ea522dd0023b31`, production context, state `ready`, published 22 October 2026 at **20:00:46 IST**.
- [Deployment details](https://app.netlify.com/projects/theflames/deploys/6ada1dd748ea522dd0023b31).
- [Immutable deployment URL](https://6ada1dd748ea522dd0023b31--theflames.netlify.app).
- Initial SEO revision `5449794` published at 19:05 IST. Follow-up `d9df394` fixes reduced-motion hydration, preserves form input when preferences change, improves text contrast and Safari skip-link focus, and removes conflicting transform transitions from settings toggles.
- Hosting, DNS, database schema and production environment variables were not changed.

## Production acceptance

All ten groups passed on the custom production domain after Netlify confirmed the published runtime revision:

1. Seven canonical public pages return successful content.
2. Homepage guide and accurate JSON-LD are present in initial HTML.
3. Three social-preview URL variants retain OG metadata and `noindex, follow` with the home canonical.
4. Sitemap contains seven public URLs without invented dates; robots, HTTP/www redirects and missing-page 404 work.
5. Calculator API returns the verified Rahul/Priya and repeated-letter examples, and rejects missing names.
6. Dynamic and CDN social images return image content.
7. Homepage guide is readable with JavaScript disabled.
8. Desktop calculator completes, saves a pairing in local storage and resets without page errors.
9. Mobile reduced-motion calculator completes the same flow without page errors.
10. Manual mode cancels matching letters, reaches Marriage for Rahul/Priya, returns to input, and live charts render without page errors.

Synthetic game checks used test names; live anonymous game statistics may include those verification plays. No browser-authentication data was exported.

## Local verification and remaining limits

- Production build and TypeScript compilation passed. Lint passed with one existing API-docs `tabIndex` warning.
- The initial reduced-motion regression reproduced React hydration error #418 on desktop/mobile. The hydration fix passed the focused checks, and subsequent five-browser runs passed hydration and form-preservation cases.
- Wider suite: **192/195 passed**. Two rapid Safari theme-toggle stress cases timed out, and one Mobile Safari page-network-idle wait timed out.
- After the toggle correction, the affected run passed **82/85**; the How It Works accessibility case passed, but three Safari rapid-toggle stress cases hit the 30-second budget.
- A single-worker rerun with a 60-second budget passed reduced-motion stress tests on desktop/mobile Safari but still timed out in both normal-motion cases. Ordinary two-toggle theme tests passed. **Rapid normal-motion Safari theme toggling remains an unresolved stress-test limitation.** No claim of a fully green browser matrix is made.
- A further native-button experiment did not resolve the normal-motion stress timeout and was discarded without publication.
- Local builds used placeholder backend configuration and mock chart data. The production checks used the real deployed application and live charts. These are separate evidence sets.

## Google verification

- Google Rich Results Test successfully crawled the homepage at 19:21 IST and detected **one valid Software App item**. Its sole non-critical warning was missing optional `aggregateRating`; no ratings were fabricated. The follow-up did not change that schema.
- [Google test result](https://search.google.com/test/rich-results/result?id=RulCc4ajPlumkObU5OFQ5w).
- Search Console shows the homepage indexed. The canonical apex sitemap reports Success with seven discovered pages; historical 4xx validation was started earlier in this audit.
- The post-deployment homepage recrawl request failed twice: Google reported it could not connect to its reCAPTCHA service. **The request was not confirmed submitted.** No challenge was bypassed or solved.
- Search Console field Core Web Vitals recovery and ranking/CTR improvements remain unverified. See ACTION-PLAN.md for performance profiling and consistent 28-day comparisons. A top ranking cannot be guaranteed by deployment or a valid structured-data test.

## Evidence map

Raw evidence lives in the git-ignored `seo-audit-evidence/2026-10-22/` directory:

| Artifact                                                                                 | Evidence                                                          |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `production-acceptance.json` / `.log`                                                    | Final release ID, ten live acceptance groups and results          |
| `production-chrome-home.jpg`                                                             | Published title, calculator and visible guide in signed-in Chrome |
| `production-desktop-result.png`, `production-mobile-result.png`, `production-manual.png` | Live functional checks                                            |
| `google-rich-results.jpg`                                                                | Google's valid-item result and optional rating warning            |
| `gsc-indexing-request-error.jpg`                                                         | Google's recrawl request service failure                          |
| `full-suite-final.json` / `.log`                                                         | Wider 192/195 result and original timeout details                 |
| `affected-final.json` / `.log`                                                           | Follow-up 82/85 result                                            |
| `safari-stress-final.log`                                                                | Single-worker extended-budget Safari result                       |
| `final-build.log`, `lint-final.log`, `hydration-before.log`, `hydration-after.log`       | Build, lint and hydration reproduction/fix                        |

For a bad published release, fix forward on the same branch and verify the new Netlify production revision. A failed build leaves the previously published release live. Documentation-only release records use `[skip netlify]` to avoid an unnecessary runtime redeploy.
