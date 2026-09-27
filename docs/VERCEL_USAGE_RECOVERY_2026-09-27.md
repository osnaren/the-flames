# Vercel usage recovery

Checked on 2026-09-27 for the `osnarens-projects` Hobby team.

## What happened

Vercel's rolling 30-day usage dashboard showed 2,405,404 Edge Requests against the Hobby allowance of 1,000,000. The Flames accounted for 2,299,467 (95.6%). Fast Data Transfer was roughly 215 GB against the 100 GB Hobby allowance; The Flames accounted for 211.57 GB (about 98%). Vercel displayed “Deployments Paused. Your team exceeded the Hobby fair use limits.” The live site returned HTTP 402.

[Edge Requests](https://vercel.com/docs/manage-cdn-usage) count requests handled by the Vercel CDN, including cached static files. [Fast Data Transfer](https://vercel.com/docs/manage-cdn-usage) counts bytes sent from the CDN to visitors. The [Hobby plan](https://vercel.com/docs/plans/hobby) has the allowances above. This is a team-level pause, so other projects on the team are affected.

The project's media files are a strong candidate for the transfer overage: before optimization, `public/` contained about 60 MiB of static files, including a 4.54 MB pattern image, 1–2.6 MB audio files, and several 1 MB+ images. The available Basic Observability history did not provide a historical path breakdown. Treat the media attribution as an inference; do not assume every Edge Request was for media. HTML, JavaScript, APIs, crawlers, and dynamic OG images can also contribute.

## Mitigation prepared

- The existing Cloudflare `osnaren` R2 bucket now holds 169 media objects (64,807,999 bytes) under `the-flames/v1/`. They are public at `https://cdn.osnaren.com/the-flames/v1/`. The bucket and custom domain existed before this work; no new bucket was created.
- A Cloudflare cache rule applies only to `cdn.osnaren.com/the-flames/v1/*`, with a 30-day edge TTL. Objects have `Cache-Control: public, max-age=31536000, immutable`. R2 CORS permits public GET and HEAD for browser-loaded media. Sample SVG, WebP, JSON, and MP3 GETs changed from cache MISS to HIT.
- Source references for existing images, patterns, audio, logos, icons, and static OG images now use the R2 URLs. Next Image is set to `unoptimized` so it does not send those image requests through Vercel's `/_next/image` endpoint. The PWA manifest document remains same-origin, while its icon images use R2.
- 21 smaller WebP variants were generated and uploaded. For example, the Onam pattern is 388 KB instead of 4.76 MB, the noise tile is 49 KB instead of 1.28 MB, and the packaged logo animation is 25 KB instead of 1.20 MB. The original files remain available for older cached pages.
- `scripts/upload-r2-assets.ps1` can upload future media. Use a new prefix such as `the-flames/v2` for changed assets because v1 responses are immutable for one year. Update the code references and scoped cache rule for the new prefix before release. Keep older prefixes while older deployments or cached pages may still reference them.

The [R2 Standard free tier](https://developers.cloudflare.com/r2/pricing/) currently includes 10 GB-month of storage, 1 million Class A operations, 10 million Class B operations, and free egress. The 64.8 MB upload is small relative to the storage allowance, but account-wide usage and future request volume still need monitoring. Cloudflare CDN hits also reduce R2 read operations.

## Restore and release

These changes are local until a Vercel deployment runs. They cannot erase usage already recorded in the rolling 30-day window or unpause the team. Vercel says a Hobby team can [wait for usage to fall below the allowance](https://vercel.com/docs/plans/hobby); Vercel staff also advise [contacting support for unpause after that point](https://community.vercel.com/t/what-to-do-when-your-team-is-paused-or-blocked/45069). A Pro upgrade may restore service sooner but changes billing, so decide that separately.

When the team is available again, deploy the prepared code as a preview first, verify browser media loads and R2 cache headers, then release to production. After release, compare the next few days of Vercel Edge Requests and Fast Data Transfer with Cloudflare CDN/R2 analytics. If Edge Requests remain high, use Vercel path-level Observability or logs to identify HTML, `/_next/static`, `/api/og/*`, bots, or other sources before adding cache or bot rules. Do not proxy the main domain through Cloudflare without testing Vercel compatibility and error caching.

## Operational checks

```powershell
# Review media keys before a new upload.
.\scripts\upload-r2-assets.ps1 -DryRun

# Upload all current media to the configured prefix.
.\scripts\upload-r2-assets.ps1

# Upload a single key after editing it (use a new versioned prefix for release).
.\scripts\upload-r2-assets.ps1 -Prefix 'the-flames/v2' -OnlyKey 'the-flames/v2/assets/example.webp'
```

The upload script uses the authenticated Wrangler session and the configured Cloudflare account; it does not store an API token in the repository.
