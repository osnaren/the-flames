'use client';

import { PieChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatNumber, formatPercent, RESULT_META, type NormalizedResult } from '../chartTheme';
import type { FlamesResult } from '../types';
import ChartCard from './ChartCard';

interface ResultDonutProps {
  results: NormalizedResult[];
  periodNoun: string;
}

const SIZE = 220;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3; // px gap between segments

/**
 * Interactive donut of the result mix. Segments draw in with a CSS transition on
 * stroke-dasharray; tapping a segment or legend row focuses it.
 */
export default function ResultDonut({ results, periodNoun }: ResultDonutProps) {
  const [selected, setSelected] = useState<FlamesResult | null>(null);
  const [drawn, setDrawn] = useState(false);
  const total = results.reduce((sum, r) => sum + r.count, 0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = results.filter((r) => r.count > 0);
  const gaps = visible.length > 1 ? GAP : 0;
  const segments = visible.map((r, index) => ({
    ...r,
    length: Math.max(r.share * CIRCUMFERENCE - gaps, 0.5),
    offset: visible.slice(0, index).reduce((sum, prev) => sum + prev.share * CIRCUMFERENCE, 0),
  }));

  const focus = selected ? results.find((r) => r.result === selected) : null;
  const focusMeta = focus ? RESULT_META[focus.result] : null;

  return (
    <ChartCard title="Result mix" subtitle={`How games ended ${periodNoun}`} icon={PieChart} delay={0.1}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full -rotate-90"
            role="img"
            aria-label={`Result mix: ${results.map((r) => `${RESULT_META[r.result].label} ${formatPercent(r.share)}`).join(', ')}`}
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-surface-container-highest"
            />
            {segments.map((segment) => {
              const meta = RESULT_META[segment.result];
              const dimmed = selected !== null && selected !== segment.result;
              return (
                <circle
                  key={segment.result}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={selected === segment.result ? STROKE + 6 : STROKE}
                  strokeLinecap="butt"
                  strokeDasharray={`${drawn ? segment.length : 0} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-segment.offset}
                  className="cursor-pointer transition-[stroke-dasharray,stroke-width,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ opacity: dimmed ? 0.25 : 1 }}
                  onClick={() => setSelected((current) => (current === segment.result ? null : segment.result))}
                />
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {focus && focusMeta ? (
              <>
                <span className="text-2xl" aria-hidden="true">
                  {focusMeta.emoji}
                </span>
                <span className="text-on-surface text-3xl font-bold tabular-nums">{formatPercent(focus.share, 1)}</span>
                <span className="text-on-surface-variant text-xs">
                  {focusMeta.label} · {formatNumber(focus.count)}
                </span>
              </>
            ) : (
              <>
                <span className="text-on-surface text-3xl font-bold tabular-nums">{formatNumber(total)}</span>
                <span className="text-on-surface-variant text-xs">games {periodNoun}</span>
              </>
            )}
          </div>
        </div>

        <ul className="grid w-full max-w-xs grid-cols-2 gap-2 sm:grid-cols-1">
          {results.map((r) => {
            const meta = RESULT_META[r.result];
            const active = selected === r.result;
            return (
              <li key={r.result}>
                <button
                  type="button"
                  onClick={() => setSelected(active ? null : r.result)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors duration-200 ${
                    active ? 'bg-surface-container-highest' : 'hover:bg-surface-container-high'
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span className="text-on-surface min-w-0 flex-1 truncate">{meta.label}</span>
                  <span className="text-on-surface-variant text-xs font-semibold tabular-nums">
                    {formatPercent(r.share)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartCard>
  );
}
