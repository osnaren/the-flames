import { MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import { formatPercent, normalizeResults, RESULT_META, type NormalizedResult } from '../chartTheme';
import type { RegionalStats } from '../types';
import { getCountryFlag, getCountryName } from '../utils';
import ChartCard from './ChartCard';

interface RegionComparisonProps {
  regional: RegionalStats;
  global: NormalizedResult[];
}

/** Paired bars: the visitor's country against the worldwide mix, per result. */
export default function RegionComparison({ regional, global }: RegionComparisonProps) {
  const local = normalizeResults(regional.results);
  const localTotal = local.reduce((s, r) => s + r.count, 0);
  const country = getCountryName(regional.country);
  const max = Math.max(0.01, ...local.map((r) => r.share), ...global.map((r) => r.share));
  const standout = local
    .filter((r) => r.count > 0)
    .map((r) => ({ ...r, diff: r.share - (global.find((g) => g.result === r.result)?.share ?? 0) }))
    .sort((a, b) => b.diff - a.diff)[0];

  return (
    <ChartCard
      title={`${country} vs the world`}
      subtitle={`${localTotal.toLocaleString()} games from ${country}`}
      icon={MapPin}
      iconClassName="bg-emerald-500/12 text-emerald-500"
      delay={0.25}
      action={
        <span className="font-emoji text-2xl leading-none" role="img" aria-label={country}>
          {getCountryFlag(regional.country)}
        </span>
      }
    >
      {localTotal === 0 ? (
        <p className="text-on-surface-variant py-6 text-center text-sm">No games from {country} in this period yet.</p>
      ) : (
        <>
          <div className="text-on-surface-variant mb-3 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-full bg-linear-to-r from-pink-500 to-orange-400" /> {country}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-on-surface-variant/40 h-2 w-4 rounded-full" /> World
            </span>
          </div>
          <ul className="space-y-3">
            {local.map((r, index) => {
              const meta = RESULT_META[r.result];
              const world = global.find((g) => g.result === r.result)?.share ?? 0;
              return (
                <li key={r.result} className="grid grid-cols-[5.5rem_1fr_2.75rem] items-center gap-2 text-sm">
                  <span className="text-on-surface truncate">
                    <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                  </span>
                  <span className="space-y-1">
                    <span className="bg-surface-container-highest block h-2 overflow-hidden rounded-full">
                      <span
                        className="motion-grow-x block h-full rounded-full"
                        style={
                          {
                            width: `${(r.share / max) * 100}%`,
                            backgroundColor: meta.color,
                            '--grow-delay': `${0.25 + index * 0.05}s`,
                          } as CSSProperties
                        }
                      />
                    </span>
                    <span className="bg-surface-container-highest block h-1.5 overflow-hidden rounded-full">
                      <span
                        className="motion-grow-x bg-on-surface-variant/40 block h-full rounded-full"
                        style={
                          {
                            width: `${(world / max) * 100}%`,
                            '--grow-delay': `${0.3 + index * 0.05}s`,
                          } as CSSProperties
                        }
                      />
                    </span>
                  </span>
                  <span className="text-on-surface text-right text-xs font-semibold tabular-nums">
                    {formatPercent(r.share)}
                  </span>
                </li>
              );
            })}
          </ul>
          {standout && standout.diff > 0.01 && (
            <p className="bg-surface-container text-on-surface-variant mt-4 rounded-xl px-3 py-2 text-xs">
              {country} lands on <strong className="text-on-surface">{RESULT_META[standout.result].label}</strong>{' '}
              {Math.round(standout.diff * 100)} points more often than the world average.
            </p>
          )}
        </>
      )}
    </ChartCard>
  );
}
