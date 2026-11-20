'use client';

import { UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { formatPercent, normalizeResults, RESULT_META, type NormalizedResult } from '../chartTheme';
import type { FlamesResult } from '../types';
import ChartCard from './ChartCard';

interface PersonalStatsProps {
  global: NormalizedResult[];
}

interface StoredPairing {
  result: FlamesResult | null;
  timestamp: number;
}

const STORAGE_KEY = 'flames-pairing-history';

function readHistory(): StoredPairing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredPairing[]) : [];
    return Array.isArray(parsed) ? parsed.filter((p) => p && p.result && p.result in RESULT_META) : [];
  } catch {
    return [];
  }
}

/**
 * The player's own results (from this browser's history only — nothing is
 * uploaded) compared with the global mix.
 */
export default function PersonalStats({ global }: PersonalStatsProps) {
  const [history, setHistory] = useState<StoredPairing[] | null>(null);

  useEffect(() => {
    setHistory(readHistory());
    const onUpdate = () => setHistory(readHistory());
    window.addEventListener('flames-history-update', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('flames-history-update', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  if (history === null) return null;

  const counts = new Map<FlamesResult, number>();
  history.forEach((p) => counts.set(p.result as FlamesResult, (counts.get(p.result as FlamesResult) ?? 0) + 1));
  const mine = normalizeResults([...counts.entries()].map(([result, count]) => ({ result, count, trend: 0 })));
  const total = history.length;
  const favourite = [...mine].sort((a, b) => b.count - a.count)[0];
  const luckiest = mine
    .filter((r) => r.count > 0)
    .map((r) => ({ ...r, lift: r.share - (global.find((g) => g.result === r.result)?.share ?? 0) }))
    .sort((a, b) => b.lift - a.lift)[0];
  const seen = mine.filter((r) => r.count > 0).length;

  return (
    <ChartCard
      title="Your games"
      subtitle="From this device only — never uploaded"
      icon={UserRound}
      iconClassName="bg-violet-500/12 text-violet-500"
      delay={0.4}
    >
      {total === 0 ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="text-4xl" aria-hidden="true">
            🔮
          </span>
          <p className="text-on-surface-variant max-w-xs text-sm">
            Play a few rounds and your personal result mix will show up here, side by side with the world.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-linear-to-r from-pink-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            Play your first game
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface-container rounded-xl px-2 py-2.5">
              <dt className="text-on-surface-variant text-[11px] font-medium">Games</dt>
              <dd className="text-on-surface text-lg font-bold tabular-nums">{total}</dd>
            </div>
            <div className="bg-surface-container rounded-xl px-2 py-2.5">
              <dt className="text-on-surface-variant text-[11px] font-medium">Favourite</dt>
              <dd className="text-on-surface truncate text-lg font-bold">
                {favourite && favourite.count > 0 ? RESULT_META[favourite.result].emoji : '—'}
              </dd>
            </div>
            <div className="bg-surface-container rounded-xl px-2 py-2.5">
              <dt className="text-on-surface-variant text-[11px] font-medium">Collected</dt>
              <dd className="text-on-surface text-lg font-bold tabular-nums">{seen}/6</dd>
            </div>
          </dl>

          {/* Stacked comparison bars */}
          <div className="space-y-2">
            {[
              { label: 'You', data: mine },
              { label: 'World', data: global },
            ].map((row, rowIndex) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-on-surface-variant w-10 text-xs font-medium">{row.label}</span>
                <div className="bg-surface-container-highest flex h-4 flex-1 overflow-hidden rounded-full">
                  {row.data
                    .filter((r) => r.share > 0)
                    .map((r, i) => (
                      <span
                        key={r.result}
                        className="motion-grow-x h-full"
                        title={`${RESULT_META[r.result].label}: ${formatPercent(r.share)}`}
                        style={
                          {
                            width: `${r.share * 100}%`,
                            backgroundColor: RESULT_META[r.result].color,
                            '--grow-delay': `${0.3 + rowIndex * 0.15 + i * 0.04}s`,
                          } as CSSProperties
                        }
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {mine.map((r) => (
              <span key={r.result} className="text-on-surface-variant flex items-center gap-1 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RESULT_META[r.result].color }} />
                {RESULT_META[r.result].label} {formatPercent(r.share)}
              </span>
            ))}
          </div>

          {luckiest && luckiest.lift > 0.02 && (
            <p className="bg-surface-container text-on-surface-variant rounded-xl px-3 py-2 text-xs">
              You land on <strong className="text-on-surface">{RESULT_META[luckiest.result].label}</strong>{' '}
              {Math.round(luckiest.lift * 100)} points more often than the world. {RESULT_META[luckiest.result].emoji}
            </p>
          )}
          {seen < 6 && (
            <p className="text-on-surface-variant text-xs">
              Still to collect:{' '}
              {mine
                .filter((r) => r.count === 0)
                .map((r) => `${RESULT_META[r.result].emoji} ${RESULT_META[r.result].label}`)
                .join(' · ')}
            </p>
          )}
        </div>
      )}
    </ChartCard>
  );
}
