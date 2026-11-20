'use client';

import { Radio } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { RESULT_META } from '../chartTheme';
import type { RecentMatch } from '../types';
import { getCountryFlag, getCountryName } from '../utils';
import ChartCard from './ChartCard';

interface LiveFeedProps {
  matches: RecentMatch[];
}

const COLLAPSED = 6;

function relativeTime(dateString: string, now: number) {
  const diff = Math.max(0, Math.floor((now - new Date(dateString).getTime()) / 1000));
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateString).toLocaleDateString();
}

/** Latest anonymous results, with a colour strip summarising the recent mix. */
export default function LiveFeed({ matches }: LiveFeedProps) {
  const [now, setNow] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const valid = matches.filter((m) => m.result in RESULT_META);
  const visible = expanded ? valid : valid.slice(0, COLLAPSED);

  return (
    <ChartCard
      title="Live feed"
      subtitle="Latest games around the world"
      icon={Radio}
      iconClassName="bg-emerald-500/12 text-emerald-500"
      delay={0.35}
      action={
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      }
    >
      {valid.length === 0 ? (
        <p className="text-on-surface-variant py-6 text-center text-sm">No games yet. Be the first!</p>
      ) : (
        <>
          {/* Recent mix strip */}
          <div className="mb-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
            {valid.map((m, i) => (
              <span
                key={`${m.created_at}-${i}`}
                className="motion-grow-y flex-1"
                style={
                  { backgroundColor: RESULT_META[m.result].color, '--grow-delay': `${i * 0.03}s` } as CSSProperties
                }
              />
            ))}
          </div>

          <ul className="space-y-2">
            {visible.map((match, index) => {
              const meta = RESULT_META[match.result];
              const country = match.country ? getCountryName(match.country) : 'Somewhere';
              return (
                <li
                  key={`${match.created_at}-${index}`}
                  className="motion-rise bg-surface-container hover:bg-surface-container-high flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200"
                  style={{ '--rise-delay': `${Math.min(index, 8) * 0.04}s`, '--rise-distance': '8px' } as CSSProperties}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: `${meta.color}22` }}
                    aria-hidden="true"
                  >
                    {meta.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-on-surface block text-sm font-semibold" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                    <span className="text-on-surface-variant flex items-center gap-1 truncate text-xs">
                      {match.country && (
                        <span className="font-emoji leading-none" aria-hidden="true">
                          {getCountryFlag(match.country)}
                        </span>
                      )}
                      {country}
                    </span>
                  </span>
                  <span className="text-on-surface-variant shrink-0 text-xs tabular-nums">
                    {now ? relativeTime(match.created_at, now) : ''}
                  </span>
                </li>
              );
            })}
          </ul>

          {valid.length > COLLAPSED && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-primary hover:bg-primary/8 mt-3 w-full rounded-xl py-2 text-sm font-medium transition-colors"
            >
              {expanded ? 'Show less' : `Show ${valid.length - COLLAPSED} more`}
            </button>
          )}
        </>
      )}
    </ChartCard>
  );
}
