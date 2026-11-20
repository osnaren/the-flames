import { Activity, CalendarDays, Crown, TrendingUp } from 'lucide-react';
import type { CSSProperties } from 'react';
import { formatNumber, formatPercent, PERIOD_LABELS, RESULT_META, type NormalizedResult } from '../chartTheme';
import type { TimeFilter } from '../types';

interface StatTilesProps {
  totalMatches: number;
  periodMatches: number;
  results: NormalizedResult[];
  timeFilter: TimeFilter;
  /** Render labels with placeholder values (server HTML / first load). */
  loading?: boolean;
}

/** Headline numbers. Values use tabular figures so they do not jitter on refresh. */
export default function StatTiles({
  totalMatches,
  periodMatches,
  results,
  timeFilter,
  loading = false,
}: StatTilesProps) {
  const period = PERIOD_LABELS[timeFilter];
  const top = [...results].sort((a, b) => b.count - a.count)[0];
  const topMeta = top && top.count > 0 ? RESULT_META[top.result] : null;
  // "Rising" = biggest positive change among results that actually occurred.
  const rising = period.comparison
    ? [...results].filter((r) => r.count > 0 && r.trend > 0).sort((a, b) => b.trend - a.trend)[0]
    : undefined;
  const risingMeta = rising ? RESULT_META[rising.result] : null;
  const periodCount = results.reduce((sum, r) => sum + r.count, 0) || periodMatches;

  const tiles = [
    {
      label: 'All games',
      value: formatNumber(totalMatches),
      hint: 'Every calculation, worldwide',
      icon: Activity,
      accent: 'from-orange-500 to-rose-500',
    },
    {
      label: `Games ${period.noun}`,
      value: formatNumber(periodCount),
      hint:
        timeFilter === 'today'
          ? 'Played so far today'
          : timeFilter === 'week'
            ? 'Played this week'
            : 'Across every result',
      icon: CalendarDays,
      accent: 'from-sky-500 to-indigo-500',
    },
    {
      label: 'Most common',
      value: topMeta ? `${topMeta.emoji} ${topMeta.label}` : '—',
      hint: top && topMeta ? `${formatPercent(top.share)} of results ${period.noun}` : 'No games yet',
      icon: Crown,
      accent: 'from-amber-400 to-orange-500',
    },
    {
      label: 'Rising',
      value: risingMeta ? `${risingMeta.emoji} ${risingMeta.label}` : 'Steady',
      hint:
        rising && period.comparison
          ? `+${Math.round(rising.trend)}% ${period.comparison}`
          : period.comparison
            ? `No result is up ${period.comparison}`
            : 'Pick Today or This week to compare',
      icon: TrendingUp,
      accent: 'from-emerald-400 to-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile, index) => (
        <div
          key={tile.label}
          className="motion-rise border-outline-variant/40 bg-surface-container-low/80 group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          style={{ '--rise-delay': `${0.05 + index * 0.06}s` } as CSSProperties}
        >
          <span
            aria-hidden="true"
            className={`absolute -top-8 -right-8 h-20 w-20 rounded-full bg-linear-to-br opacity-20 ${tile.accent}`}
          />
          <div className="relative flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-sm ${tile.accent}`}
            >
              <tile.icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <p className="text-on-surface-variant truncate text-[11px] font-semibold tracking-wider uppercase">
              {tile.label}
            </p>
          </div>
          <p className="text-on-surface relative mt-3 truncate text-xl font-bold tabular-nums sm:text-2xl">
            {loading ? '—' : tile.value}
          </p>
          <p className="text-on-surface-variant relative mt-1 line-clamp-2 text-xs">
            {loading ? 'Loading live stats…' : tile.hint}
          </p>
        </div>
      ))}
    </div>
  );
}
