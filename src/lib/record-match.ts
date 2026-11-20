/**
 * Lightweight, SDK-free recording of an anonymous game result.
 *
 * The calculator page used to import the full Supabase client (~230 KB) just to
 * insert one row, and evaluating it landed in the middle of the game animation.
 * PostgREST accepts the same insert as a plain HTTP request, so the home page
 * never needs the SDK. Only the result letter and a country code are sent.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const COUNTRY_KEY = 'flames-country';

async function detectCountry(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem(COUNTRY_KEY);
    if (cached) return cached === '-' ? null : cached;
  } catch {
    // Storage can be unavailable (private mode); fall through.
  }

  let country: string | null = null;
  try {
    if (process.env.NEXT_PUBLIC_DEPLOY_PLATFORM !== 'netlify') {
      const local = await fetch('/api/geo');
      if (local.ok) country = ((await local.json()) as { country?: string }).country || null;
    }
    if (!country && SUPABASE_URL) {
      const remote = await fetch(`${SUPABASE_URL}/functions/v1/get-country`, {
        headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
      });
      if (remote.ok) country = ((await remote.json()) as { country?: string }).country || null;
    }
  } catch {
    country = null;
  }

  try {
    sessionStorage.setItem(COUNTRY_KEY, country || '-');
  } catch {
    // Ignore storage errors.
  }
  return country;
}

/** Fire-and-forget. Failures are swallowed: statistics are optional. */
export async function recordMatch(result: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY || !result) return;
  try {
    const country = await detectCountry();
    await fetch(`${SUPABASE_URL}/rest/v1/flames_matches`, {
      method: 'POST',
      keepalive: true,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
        'x-client-info': 'flames-game',
      },
      body: JSON.stringify({ result: result.trim(), country: country ?? undefined }),
    });
  } catch {
    // Recording is optional; the calculator keeps working offline.
  }
}
