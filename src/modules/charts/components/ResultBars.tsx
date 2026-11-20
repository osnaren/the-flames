import { BarChart3 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { formatNumber, formatPercent, RESULT_META, type NormalizedResult } from '../chartTheme';
import ChartCard from './ChartCard';

interface ResultBarsProps {
  results: NormalizedResult[];
  comparison: string | null;
}

function TrendChip({ trend, comparison }: { trend: number; comparison: string | null }) {
  if (!comparison) return null;
  const rounded = Math.round(trend);
  const tone =
    rounded > 0
      ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
      : rounded < 0
        ? 'bg-rose-500/12 text-rose-600 dark:text-rose-400'
        : 'bg-surface-container-highest text-on-surface-variant';
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${tone}`}
      title={`${rounded > 0 ? '+' : ''}${rounded}% ${comparison}`}
    >
      {rounded > 0 ? '▲' : rounded < 0 ? '▼' : '•'} {Math.abs(rounded)}%
    </span>
  );
}

/** Ranked horizontal bars. Bars grow with a compositor-only scaleX animation. */
export default function ResultBars({ results, comparison }: ResultBarsProps) {
  const ranked = [...results].sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...ranked.map((r) => r.count));

  return (
    <ChartCard
      title="Leaderboard"
      subtitle={comparison ? `Share of games, with change ${comparison}` : 'Share of all games'}
      icon={BarChart3}
      iconClassName="bg-orange-500/12 text-orange-500"
      delay={0.15}
    >
      <ol className="space-y-4">
        {ranked.map((r, index) => {
          const meta = RESULT_META[r.result];
          const Icon = meta.icon;
          return (
            <li key={r.result}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-on-surface-variant w-4 text-xs font-semibold tabular-nums">{index + 1}</span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-on-surface truncate font-medium">{meta.label}</span>
                  <TrendChip trend={r.trend} comparison={comparison} />
                </span>
                <span className="flex shrink-0 items-baseline gap-1.5">
                  <span className="text-on-surface font-semibold tabular-nums">{formatNumber(r.count)}</span>
                  <span className="text-on-surface-variant w-9 text-right text-xs tabular-nums">
                    {formatPercent(r.share)}
                  </span>
                </span>
              </div>
              <div className="bg-surface-container-highest h-2.5 overflow-hidden rounded-full">
                <div
                  className="motion-grow-x h-full rounded-full"
                  style={
                    {
                      width: `${Math.max((r.count / max) * 100, r.count > 0 ? 2 : 0)}%`,
                      backgroundImage: `linear-gradient(90deg, ${meta.color}, ${meta.soft})`,
                      '--grow-delay': `${0.2 + index * 0.06}s`,
                    } as CSSProperties
                  }
                />
              </div>
            </li>
          );
        })}
      </ol>
    </ChartCard>
  );
}
