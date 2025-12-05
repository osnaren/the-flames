import { FlamesResultType } from '@/constants/flames';
import Button from '@ui/Button';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  Heart,
  Loader2,
  RefreshCcw,
  BellRing as Ring,
  Star,
  Sword,
  Users,
  X,
} from 'lucide-react';
import ChartStats from './ChartStats';
import RecentMatches from './RecentMatches';
import RegionalStats from './RegionalStats';
import ResultTrendBars from './ResultTrendBars';
import TopCountries from './TopCountries';
import { GlobalStats, ResultStats, TimeFilter } from './types';

// Mapping of result letters to meanings and icons
const resultInfo = {
  [FlamesResultType.FRIEND]: {
    text: 'Friendship',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  [FlamesResultType.LOVE]: {
    text: 'Love',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900',
  },
  [FlamesResultType.AFFECTION]: {
    text: 'Affection',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
  },
  [FlamesResultType.MARRIAGE]: {
    text: 'Marriage',
    icon: Ring,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  [FlamesResultType.ENEMY]: {
    text: 'Enemy',
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
  },
  [FlamesResultType.SIBLING]: {
    text: 'Siblings',
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
};

interface ChartsContentProps {
  tagline: string;
  onClose?: () => void;
  isStandalone: boolean;
  data: GlobalStats | null;
  hottestTrend: ResultStats | null;
  isLoading: boolean;
  error: unknown;
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  refetch: () => void;
  lastUpdate?: number;
}

// Loading state component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="mb-4 h-10 w-10 animate-spin text-orange-500" />
    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading global stats...</p>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Gathering data from around the world</p>
  </div>
);

// Error state component
const ErrorState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
      <div className="text-3xl">⚠️</div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unable to load stats</h3>
    <p className="mt-2 max-w-xs text-center text-gray-600 dark:text-gray-400">
      We couldn't fetch the latest data. Please check your connection and try again.
    </p>
    <Button variant="secondary" onClick={() => window.location.reload()} className="mt-6">
      Retry Connection
    </Button>
  </div>
);

export default function ChartsContent({
  tagline,
  onClose,
  isStandalone,
  data,
  hottestTrend,
  isLoading,
  error,
  timeFilter,
  setTimeFilter,
  refetch,
  lastUpdate,
}: ChartsContentProps) {
  return (
    <>
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700">
          <div className="absolute inset-0 bg-[url('/assets/noise.webp')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-yellow-500/20 blur-3xl"></div>
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Global Charts</h2>
              </div>
              <motion.p
                className="mt-2 text-sm font-medium text-white/90 sm:text-base"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {tagline}
              </motion.p>
            </div>
            {!isStandalone && onClose && (
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-2 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                aria-label="Close global charts"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Stats Overview */}
          {data && <ChartStats data={data} hottestTrend={hottestTrend} />}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-h-[70vh] overflow-y-auto bg-gray-50/50 p-4 sm:p-6 dark:bg-gray-900/50">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <>
            {/* Filters & Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
                {(['today', 'week', 'alltime'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                      timeFilter === filter
                        ? 'bg-orange-100 text-orange-700 shadow-sm dark:bg-orange-900/50 dark:text-orange-200'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {filter === 'today' && <Clock className="mr-1.5 h-3.5 w-3.5" />}
                    {filter === 'week' && <Calendar className="mr-1.5 h-3.5 w-3.5" />}
                    {filter === 'alltime' && <Award className="mr-1.5 h-3.5 w-3.5" />}
                    {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'All Time'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                {lastUpdate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Updated {new Date(lastUpdate).toLocaleTimeString()}
                  </span>
                )}
                <motion.button
                  className="flex items-center rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-900/5 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:ring-white/10 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={refetch}
                  aria-label="Refresh statistics"
                >
                  <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                  Refresh
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Result Stats - Full width on mobile, half on large screens */}
              <ResultTrendBars results={data.resultStats} resultInfo={resultInfo} />

              {/* Recent Matches */}
              <RecentMatches matches={data.recentMatches} resultInfo={resultInfo} />

              {/* Top Countries */}
              <TopCountries countries={data.topCountries} />

              {/* Regional Stats */}
              {data.regionalStats && <RegionalStats stats={data.regionalStats} resultInfo={resultInfo} />}
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      {!isStandalone && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Live updates enabled
          </div>
          {onClose && (
            <Button variant="primary" onClick={onClose} size="md">
              Play FLAMES
            </Button>
          )}
        </div>
      )}
    </>
  );
}
