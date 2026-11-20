import { Globe2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { formatNumber, formatPercent } from '../chartTheme';
import type { TopCountry } from '../types';
import { getCountryFlag, getCountryName } from '../utils';
import ChartCard from './ChartCard';

interface TopCountriesProps {
  countries: TopCountry[];
  userCountry?: string | null;
}

const MEDALS = ['🥇', '🥈', '🥉'];

/** Ranked countries with share-of-top bars; the visitor's country is highlighted. */
export default function TopCountries({ countries, userCountry }: TopCountriesProps) {
  const list = countries.filter((c) => c.country);
  const max = Math.max(1, ...list.map((c) => c.count));
  const total = list.reduce((sum, c) => sum + c.count, 0);

  return (
    <ChartCard
      title="Top countries"
      subtitle="Where people are playing"
      icon={Globe2}
      iconClassName="bg-sky-500/12 text-sky-500"
      delay={0.3}
    >
      {list.length === 0 ? (
        <p className="text-on-surface-variant py-6 text-center text-sm">No location data for this period yet.</p>
      ) : (
        <ol className="space-y-3.5">
          {list.map((country, index) => {
            const name = getCountryName(country.country);
            const isUser = userCountry && userCountry === country.country;
            return (
              <li key={country.country}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-5 text-center text-sm">
                      {MEDALS[index] ?? (
                        <span className="text-on-surface-variant text-xs font-semibold tabular-nums">{index + 1}</span>
                      )}
                    </span>
                    <span className="font-emoji text-lg leading-none" role="img" aria-label={name}>
                      {getCountryFlag(country.country)}
                    </span>
                    <span className="text-on-surface truncate font-medium">{name}</span>
                    {isUser && (
                      <span className="bg-primary/15 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                        You
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-baseline gap-1.5">
                    <span className="text-on-surface font-semibold tabular-nums">{formatNumber(country.count)}</span>
                    <span className="text-on-surface-variant w-9 text-right text-xs tabular-nums">
                      {formatPercent(total ? country.count / total : 0)}
                    </span>
                  </span>
                </div>
                <div className="bg-surface-container-highest h-2 overflow-hidden rounded-full">
                  <div
                    className={`motion-grow-x h-full rounded-full bg-linear-to-r ${
                      index === 0
                        ? 'from-amber-400 to-orange-500'
                        : isUser
                          ? 'from-pink-500 to-rose-400'
                          : 'from-sky-500 to-cyan-400'
                    }`}
                    style={
                      {
                        width: `${(country.count / max) * 100}%`,
                        '--grow-delay': `${0.3 + index * 0.06}s`,
                      } as CSSProperties
                    }
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </ChartCard>
  );
}
