# Temporary Netlify deployment

The Netlify site `theflames` deploys branch `codex/netlify-temporary` to
`https://theflames.netlify.app`. This branch keeps the homepage static, serves
personalized share previews from `/share`, and omits Vercel Analytics and the
Vercel-only geo route call from Netlify client builds. Media continues to load
directly from Cloudflare R2 at `cdn.osnaren.com`.

Netlify build settings: Next.js Runtime, `npm run build`, publish `.next`.
Required site environment variables: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_USE_MOCK_DATA=false`,
`NEXT_PUBLIC_SITE_URL=https://theflames.app`, and
`NEXT_PUBLIC_DEPLOY_PLATFORM=netlify`. Keep actual values in Netlify settings.

## DNS and rollback

Netlify serves `theflames.app` with `www.theflames.app` redirecting to the apex.
Cloudflare zone `2178e2f3735a5a02aae8bb1e05961c27` is authoritative.
The intended temporary DNS records are:

| Name                | Type  | Target                  | Proxy    |
| ------------------- | ----- | ----------------------- | -------- |
| `theflames.app`     | A     | `75.2.60.5`             | DNS only |
| `www.theflames.app` | CNAME | `theflames.netlify.app` | DNS only |

Before the switch, the apex A record (`5577848c9c7c4705a42064f0a88a35e4`)
pointed to Vercel `216.198.79.1`; the www CNAME
(`c5ca3f6616e835a38dce742c79c59126`) pointed to
`e026f8b4b56749d9.vercel-dns-017.com`. Both were DNS only with TTL 600.
To return to Vercel, restore these exact targets after verifying that the
Vercel project is active and serving valid content, then confirm HTTPS and
the canonical redirect.

## Usage watch

The osnaren team uses Netlify Free Legacy. Monitor team bandwidth and this
site's function requests in Netlify usage. Static HTML and R2 media reduce
Netlify usage, but `/share`, OG images, and API routes still invoke functions.
If traffic approaches plan limits, stop or rate limit expensive dynamic
routes before Netlify pauses the team's sites.
