# Sentry remediation and SEO follow-up — 22 October 2026

Runtime revision `6121ff06646eb0b5721fdbcce6cc4fed588c8455` is published on the existing Netlify production site from `codex/netlify-temporary`. All 14 production acceptance groups passed. The release-specific Sentry search showed no matching unresolved production issues immediately after verification; this is a short observation window, not evidence of permanent non-recurrence.

[Production deploy](https://app.netlify.com/projects/theflames/deploys/6ada43154ad223a2efa3ad8a) · [Published site](https://theflames.app) · [Release-specific Sentry view](https://osnaren.sentry.io/issues/?project=4510494216880128&statsPeriod=30d&query=is%3Aunresolved%20environment%3Aproduction%20release%3A6121ff06646eb0b5721fdbcce6cc4fed588c8455)

## Eight inspected issue groups

**23 October follow-up:** the performance release retains these scoped fixes. All 14 live production acceptance groups passed again on `71694bf`, including the battery variants, invalid-name handling, unsupported-action guard and normal-motion Safari result/confetti/reset. The later footer-only revisions passed fresh route/API and Lighthouse checks. Final published runtime is `99e5cd86f277c5222340e4950bc834930dbc394f`; its signed-in Chrome release-filtered feed showed no matching issues immediately after verification. This is a short observation, not proof of a sustained clean window or of complete event ingestion. No issue groups were bulk-resolved.

The previous Safari stress timeout was investigated through CPU/background isolation; the affected normal/reduced-motion Safari checks passed after the theme/background work. Performance findings and additional regression results are in CWV-IMPROVEMENTS.md. All six Google CWV validations now show Started; historical 4xx validation remains Started. The apex sitemap remains Success/seven pages. Google's recrawl request still fails at its reCAPTCHA service, so submission and field/ranking recovery are unconfirmed. The older pending-item list below describes the 22 October state and is superseded by this follow-up and ACTION-PLAN.md.

The supplied Sentry feed contained eight unresolved groups over 30 days. The displayed counts below are the inspected feed counts, not affected-user estimates. Their last-seen dates preceded this evening's releases.

| Sentry group                                                  | Feed events | Evidence and remediation                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | ----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [THE-FLAMES-1T](https://osnaren.sentry.io/issues/7699214223/) |         107 | Invalid names reached the engine's Zod catch block, which read removed `error.errors[0]`. Use typed `error.issues[0]?.message` and a fallback message. Invalid names now show a toast without breaking the calculator.                                                                                                             |
| [THE-FLAMES-F](https://osnaren.sentry.io/issues/7128845287/)  |          83 | The old public chunk maps the failing call to battery `addEventListener`. Check that `getBattery` is callable, accept snapshots without event methods, and handle rejected detection promises.                                                                                                                                     |
| [THE-FLAMES-24](https://osnaren.sentry.io/issues/7789311676/) |           7 | The same battery path explicitly failed on `levelchange` registration. Require both listener methods before subscribing, remove registered listeners, ignore late async results after unmount, and preserve low-battery state across capability refreshes.                                                                         |
| [THE-FLAMES-22](https://osnaren.sentry.io/issues/7778548481/) |           4 | The captured chunk points to canvas-confetti's worker `postMessage`. Result decoration now handles synchronous/rejected worker failures, avoids bitmap messages, cancels delayed bursts, and resets safely on unmount.                                                                                                             |
| [THE-FLAMES-25](https://osnaren.sentry.io/issues/7802694013/) |           2 | The blob worker's canvas-resize fallback calls `getBoundingClientRect`, which OffscreenCanvas lacks. Initialize nonzero viewport dimensions before transfer and disable the transient overlay's DOM-driven worker resizing. CSS still scales it to the viewport. Secondary confetti uses built-in shapes instead of bitmap emojis. |
| [THE-FLAMES-26](https://osnaren.sentry.io/issues/7805099366/) |           2 | The request POSTed `text/x-component` to a page with `Next-Action: cachefn`. This app has no Server Actions. A header-specific proxy guard returns 405 before Next's static/RSC handler. Normal page loads, RSC GET navigation, static assets and `/api/` bypass the guard. Revisit it if Server Actions are added.                |
| [THE-FLAMES-1G](https://osnaren.sentry.io/issues/7631505241/) |           1 | The source is Android's injected `navigation_performance_logger_android`, calling a detached native Java bridge. Filter only this exact message **and** source filename; do not suppress general postMessage failures.                                                                                                             |
| [THE-FLAMES-23](https://osnaren.sentry.io/issues/7786497693/) |           2 | Same injected logger, during before-unload telemetry. The narrow client filter covers this variant. Events containing another application exception remain reportable.                                                                                                                                                             |

The native logger is owned by the browser host; the website cannot repair its Java object. Its known telemetry failure is filtered separately from application bugs. No broad TypeError, worker, RSC or postMessage ignore rule was added. Existing dashboard issue statuses were not bulk-resolved or archived.

The [Zod 4 migration guide](https://zod.dev/v4/changelog#drops-errors) documents the removed alias. The [Next.js proxy reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) describes request interception and header-specific matching. Installed dependency source and the original public release chunks were also inspected; source maps were not assumed to prove a fix.

## Verification

- Baseline reproduced the invalid-name crash, missing battery listener method, and non-callable battery property. Unsupported action requests returned 404 locally; the inspected production incident showed the RSC invariant in Next's handler. The new guard was verified as 405 both locally and in production.
- Production build and TypeScript passed. Lint passed with the existing API-docs `tabIndex` warning.
- **37 new regression/safety checks passed** across Chrome, Firefox, Safari and mobile profiles. Three non-Chromium cases skipped the Chromium-specific worker fault injection; ordinary validation/battery/action cases ran across all five profiles.
- **55 SEO/hydration checks passed** across all five profiles. The hydration fixture's motion preference was moved into the correctly typed `contextOptions` setting.
- **14 live production groups passed:** seven canonical pages, initial-HTML schema/guide, social previews, sitemap/robots/redirects/404, API examples and input errors, social images, unsupported-action 405 with API/RSC compatibility, no-JavaScript guide, desktop/mobile validation-calculation-history-reset, two battery fallback variants, normal-motion mobile Safari positive result/confetti/reset, and manual play/live charts.
- Confetti fault injection verifies that zero DOM measurements and bitmap-cloning restrictions do not break the result flow. Cleanup safety is also covered. These tests do not establish that every historical browser version will behave identically.
- Sentry inspection used the signed-in Chrome feed because no API query tools or local API token were available. No credentials or raw private event payloads were exported.

## SEO still pending

1. **Field performance is the main open SEO item.** Fresh Search Console inspection still shows five poor URLs on both mobile and desktop, using data last updated 20 October. Profile representative pages and interactions, then validate improvements with rolling field data. The release does not certify CWV recovery. [Google's CWV guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).
2. **Google processing and follow-up:** the apex sitemap is currently Success, read 22 October, with seven discovered pages. The earlier recrawl request failed at Google's reCAPTCHA service, and historical 4xx validation had been started; this follow-up did not confirm a new recrawl submission or completed 4xx validation. The homepage was already indexed.
3. **Acquisition measurement:** compare consistent query/country/device periods after sufficient post-release data exists. Ranking/CTR improvement and a top rank are unverified. Backlink quality and the copying/originality claim still require separate evidence.
4. **Existing Safari stress-test limitation:** rapid normal-motion theme toggling was unresolved in the previous release report. This patch's successful Safari result flow does not establish that stress-test recovery.

No unrelated Movie/ProfilePage markup, invented ratings, or unverified image-license metadata was added.

## Evidence

Raw artifacts are under the git-ignored `seo-audit-evidence/2026-10-22/` directory:

- `sentry-before.log`, `sentry-after.json` / `.log`: reproduction and 37 passing checks.
- `sentry-seo-hydration.log`: 55 passing checks.
- `sentry-build.log`, `sentry-typecheck.log`, `sentry-lint.log`: local gates.
- `seo-followup-check.json`: fresh public-page, sitemap, robots and share-indexing checks.
- `sentry-production-acceptance.json` / `.log`: runtime revision and 14 passing live groups.
- `sentry-production-desktop-result.png`, `sentry-production-mobile-result.png`, `sentry-production-safari-result.png`: live functional captures.
- `sentry-new-release.jpg`: release-filtered Sentry search with no matches at observation time.
- `gsc-followup-sitemap.jpg`: current sitemap Success/seven-page state.

Documentation-only release records use `[skip netlify]`; the runtime revision above remains the deployed code.
