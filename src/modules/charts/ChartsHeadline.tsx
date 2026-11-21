import type { FlamesResult } from '@/constants/flames';

const FLAMES_ORDER: readonly FlamesResult[] = ['F', 'L', 'A', 'M', 'E', 'S'];

/** Refresh the server-rendered summary at most once an hour. */
export const HEADLINE_REVALIDATE_SECONDS = 3600;

const LABELS: Record<FlamesResult, string> = {
  F: 'Friends',
  L: 'Love',
  A: 'Affection',
  M: 'Marriage',
  E: 'Enemies',
  S: 'Siblings',
};

interface HeadlineStats {
  total: number;
  results: { result: FlamesResult; count: number }[];
}

/**
 * All-time totals straight from the stats RPC, fetched on the server so the
 * numbers are in the HTML for readers without JavaScript and for crawlers.
 * Any failure (or a placeholder test project) returns null and the section is
 * simply left out; the live charts below still load on the client.
 */
async function getHeadlineStats(): Promise<HeadlineStats | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('example.supabase.co')) return null;

  try {
    const response = await fetch(`${url}/rest/v1/rpc/get_stats_with_trends`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ time_window: 'alltime' }),
      next: { revalidate: HEADLINE_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const raw = (await response.json()) as { total?: unknown; results?: unknown };
    const total = typeof raw.total === 'number' ? raw.total : 0;
    const results = (Array.isArray(raw.results) ? raw.results : [])
      .map((item) => item as { result?: unknown; current_count?: unknown })
      .filter(
        (item): item is { result: FlamesResult; current_count: number } =>
          FLAMES_ORDER.includes(item.result as FlamesResult) && typeof item.current_count === 'number'
      )
      .map((item) => ({ result: item.result, count: item.current_count }));
    const counted = results.reduce((sum, item) => sum + item.count, 0);
    if (total <= 0 || counted <= 0) return null;
    return { total, results };
  } catch {
    return null;
  }
}

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

/** Plain-text "at a glance" summary of every FLAMES result recorded on the site. */
export default async function ChartsHeadline() {
  const stats = await getHeadlineStats();
  if (!stats) return null;

  const counted = stats.results.reduce((sum, item) => sum + item.count, 0);
  const ranked = FLAMES_ORDER.map((letter) => {
    const count = stats.results.find((item) => item.result === letter)?.count ?? 0;
    return { letter, label: LABELS[letter], count, share: count / counted };
  }).sort((a, b) => b.count - a.count);
  const [top, ...rest] = ranked;
  const rarest = rest[rest.length - 1];
  const percent = (share: number) => `${(share * 100).toFixed(1)}%`;

  return (
    <section aria-labelledby="charts-at-a-glance" className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="border-outline-variant/40 bg-surface-container-low/80 space-y-4 rounded-3xl border p-6 sm:p-8">
        <h2 id="charts-at-a-glance" className="font-heading text-on-surface text-2xl font-bold">
          FLAMES statistics at a glance
        </h2>
        <p className="text-on-surface-variant max-w-3xl text-sm leading-7">
          <strong className="text-on-surface">{formatNumber(stats.total)} FLAMES games</strong> have been played on this
          site. The most common result is{' '}
          <strong className="text-on-surface">
            {top.label} ({top.letter})
          </strong>{' '}
          at {percent(top.share)} of games, and the rarest is{' '}
          <strong className="text-on-surface">
            {rarest.label} ({rarest.letter})
          </strong>{' '}
          at {percent(rarest.share)}.
        </p>
        <ul className="text-on-surface-variant grid max-w-3xl grid-cols-2 gap-x-6 gap-y-1 text-sm leading-7 sm:grid-cols-3">
          {ranked.map((item) => (
            <li key={item.letter}>
              <span className="text-on-surface font-medium">
                {item.label} ({item.letter})
              </span>
              : {percent(item.share)}
            </li>
          ))}
        </ul>
        <p className="text-on-surface-variant text-xs">
          All-time totals of anonymous results (no names are stored), refreshed hourly.
        </p>
      </div>
    </section>
  );
}
