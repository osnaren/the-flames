# SEO production release — 22 October 2026

The SEO improvements are deployed to the existing production site, https://theflames.app, using branch `codex/netlify-temporary`. The ten production acceptance groups passed. This is bounded verification, not a claim that every browser stress case or every SEO recommendation is complete.

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
