'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useGlobalStats } from '@/hooks/useGlobalStats';
import { LayoutGroup, motion } from 'framer-motion';
import { Flame, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react';

import { normalizeResults, PERIOD_LABELS } from './chartTheme';
import LiveFeed from './components/LiveFeed';
import PersonalStats from './components/PersonalStats';
import RegionComparison from './components/RegionComparison';
import ResultBars from './components/ResultBars';
import ResultDonut from './components/ResultDonut';
import StatTiles from './components/StatTiles';
import TopCountries from './components/TopCountries';
import VibeMeter from './components/VibeMeter';
import type { TimeFilter } from './types';
import { getRandomTagline } from './utils';

const FILTERS: TimeFilter[] = ['today', 'week', 'alltime'];

function ChartsSkeleton({ timeFilter }: { timeFilter: TimeFilter }) {
  return (
    <div className="space-y-4 md:space-y-5" aria-busy="true">
      <StatTiles totalMatches={0} periodMatches={0} results={[]} timeFilter={timeFilter} loading />
      <div className="grid gap-4 md:gap-5 lg:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-surface-container-low/80 h-72 animate-pulse rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

function ErrorPanel({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="border-outline-variant/40 bg-surface-container-low/80 flex flex-col items-center rounded-3xl border px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden="true">
        📡
      </span>
      <h2 className="text-on-surface mt-3 text-lg font-semibold">Couldn&apos;t reach the stats server</h2>
      <p className="text-on-surface-variant mt-1 max-w-sm text-sm">
        Check your connection and try again. The game itself works offline.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-linear-to-r from-pink-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        Try again
      </button>
    </div>
  );
}

function ChartsPage() {
  const { shouldAnimate } = useAnimationPreferences();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const { data, isLoading, isRefreshing, error, refetch, lastUpdate, userCountry } = useGlobalStats(timeFilter);
  const [updatedLabel, setUpdatedLabel] = useState('');

  const results = useMemo(() => normalizeResults(data?.resultStats), [data]);
  const period = PERIOD_LABELS[timeFilter];
  const hasGames = results.some((r) => r.count > 0);

  const tagline = useMemo(() => {
    const top = [...results].sort((a, b) => b.count - a.count)[0];
    return top && top.count > 0 ? getRandomTagline(top.result) : '🌍 Relationship trends from FLAMES players worldwide';
  }, [results]);

  // Relative "updated" label, computed on the client only (no hydration mismatch).
  useEffect(() => {
    if (!lastUpdate) return;
    const update = () => {
      const seconds = Math.round((Date.now() - lastUpdate) / 1000);
      setUpdatedLabel(
        seconds < 10
          ? 'Updated just now'
          : seconds < 60
            ? `Updated ${seconds}s ago`
            : `Updated ${Math.round(seconds / 60)}m ago`
      );
    };
    update();
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, [lastUpdate]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-16 md:pt-10">
      {/* Hero */}
      <header className="mb-6 text-center md:mb-8">
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 ${shouldAnimate ? 'motion-pulse' : ''}`}
          style={{ '--pulse-scale': '1.06', '--pulse-duration': '2.8s' } as CSSProperties}
        >
          <Flame className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-on-surface text-3xl font-bold md:text-4xl">FLAMES Global Charts</h1>
        <p className="text-on-surface-variant mx-auto mt-2 min-h-6 max-w-xl text-sm md:text-base">{tagline}</p>
      </header>

      {/* Controls: sticky under the header so switching periods is always one tap away */}
      <div className="sticky-under-nav sticky top-16 z-20 mx-auto mb-2 flex max-w-md items-center gap-2 md:top-[4.5rem]">
        <div
          className="border-outline-variant/40 bg-surface-container-low/95 flex flex-1 rounded-2xl border p-1 shadow-sm"
          role="tablist"
          aria-label="Time period"
        >
          <LayoutGroup id="charts-period">
            {FILTERS.map((filter) => {
              const active = timeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTimeFilter(filter)}
                  className={`relative flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="charts-period-pill"
                      className="absolute inset-0 rounded-xl bg-linear-to-r from-orange-500 to-rose-500 shadow-md shadow-orange-500/25"
                      transition={shouldAnimate ? { type: 'spring', stiffness: 420, damping: 34 } : { duration: 0 }}
                    />
                  )}
                  <span className="relative whitespace-nowrap">{PERIOD_LABELS[filter].tab}</span>
                </button>
              );
            })}
          </LayoutGroup>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isRefreshing}
          className="border-outline-variant/40 bg-surface-container-low/95 text-on-surface hover:bg-surface-container-high flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-colors disabled:opacity-70"
          aria-label="Refresh statistics"
          title="Refresh statistics"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
        </button>
      </div>
      <p className="text-on-surface-variant mb-6 min-h-4 text-center text-xs tabular-nums" aria-live="polite">
        {updatedLabel}
      </p>

      {isLoading && !data ? (
        <ChartsSkeleton timeFilter={timeFilter} />
      ) : error && !hasGames ? (
        <ErrorPanel onRetry={() => void refetch()} />
      ) : data ? (
        <div key={timeFilter} className="space-y-4 md:space-y-5">
          <StatTiles
            totalMatches={data.totalMatches}
            periodMatches={data.todayMatches}
            results={results}
            timeFilter={timeFilter}
          />

          {!hasGames ? (
            <div className="border-outline-variant/40 bg-surface-container-low/80 rounded-3xl border px-6 py-12 text-center">
              <span className="text-4xl" aria-hidden="true">
                🌙
              </span>
              <p className="text-on-surface mt-3 font-semibold">No games {period.noun} yet</p>
              <p className="text-on-surface-variant mt-1 text-sm">Switch to All time, or start the day off yourself.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
              <ResultDonut results={results} periodNoun={period.noun} />
              <ResultBars results={results} comparison={period.comparison} />
              <VibeMeter results={results} periodNoun={period.noun} />
              {data.regionalStats ? (
                <RegionComparison regional={data.regionalStats} global={results} />
              ) : (
                <TopCountries countries={data.topCountries} userCountry={userCountry} />
              )}
              {data.regionalStats && <TopCountries countries={data.topCountries} userCountry={userCountry} />}
              <LiveFeed matches={data.recentMatches} />
              <div className={data.regionalStats ? 'lg:col-span-2' : ''}>
                <PersonalStats global={results} />
              </div>
            </div>
          )}

          {/* Closing call to action */}
          <div className="motion-rise flex flex-col items-center gap-3 rounded-3xl bg-linear-to-br from-orange-500 via-rose-500 to-pink-500 px-6 py-8 text-center text-white shadow-lg shadow-rose-500/20">
            <p className="font-heading text-2xl font-bold">Add your result to the charts</p>
            <p className="max-w-md text-sm text-white/85">
              Every game counts anonymously — only the result letter and country are recorded, never names.
            </p>
            <Link
              href="/"
              className="mt-1 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-md transition-transform hover:-translate-y-0.5"
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
              Play FLAMES
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default memo(ChartsPage);
