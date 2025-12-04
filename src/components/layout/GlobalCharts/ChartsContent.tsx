import { FlamesResultType } from '@/constants/flames';
import Button from '@ui/Button';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
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
import NameLeaderboard from './NameLeaderboard';
import PairingsGrid from './PairingsGrid';
import RegionalStats from './RegionalStats';
import ResultTrendBars from './ResultTrendBars';
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
}

// Loading state component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="mb-4 h-8 w-8 animate-spin text-orange-500" />
    <p className="text-gray-600 dark:text-gray-400">Loading global stats...</p>
  </div>
);

// Error state component
const ErrorState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="mb-4 text-red-500">⚠️</div>
    <p className="text-center text-gray-600 dark:text-gray-400">
      Oops! Something went wrong while loading the stats.
      <br />
      Please try again later.
    </p>
    <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">
      Retry
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
}: ChartsContentProps) {
  return (
    <>
      {/* Header */}
      <div className="relative">
        <div className="rounded-t-xl bg-linear-to-r from-orange-500 to-red-500 p-6 dark:from-orange-600 dark:to-red-600">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="mb-1 flex items-center text-2xl font-bold text-white">
                <BarChart3 className="mr-2 h-5 w-5" />
                Global FLAMES Charts
              </h2>
              <motion.p
                className="text-sm text-white/90"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {tagline}
              </motion.p>
            </div>
            {!isStandalone && onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white/80 transition hover:text-white"
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
      <div className="max-h-[70vh] overflow-y-auto p-6">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <>
            {/* Filters */}
            <div className="mb-6 flex space-x-2">
              <button
                onClick={() => setTimeFilter('today')}
                className={`flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  timeFilter === 'today'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                } transition-colors duration-200 hover:brightness-95`}
                aria-pressed={timeFilter === 'today'}
              >
                <Clock className="mr-1 h-3.5 w-3.5" /> Today
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  timeFilter === 'week'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Clock className="mr-1 h-3.5 w-3.5" /> This Week
              </button>
              <button
                onClick={() => setTimeFilter('alltime')}
                className={`flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  timeFilter === 'alltime'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Award className="mr-1 h-3.5 w-3.5" /> All Time
              </button>
              <motion.button
                className="ml-auto flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors duration-200 hover:brightness-95 dark:bg-blue-900 dark:text-blue-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: 180 }}
                transition={{ duration: 0.4 }}
                onClick={refetch}
                aria-label="Refresh statistics"
              >
                <RefreshCcw className="mr-1 h-3.5 w-3.5" /> Refresh
              </motion.button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Popular Names */}
              <NameLeaderboard names={data.popularNames} />

              {/* Result Stats */}
              <ResultTrendBars results={data.resultStats} resultInfo={resultInfo} />

              {/* Popular Pairings */}
              <PairingsGrid pairs={data.popularPairs} resultInfo={resultInfo} />

              {/* Regional Stats */}
              {data.regionalStats && <RegionalStats stats={data.regionalStats} resultInfo={resultInfo} />}
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      {!isStandalone && (
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="text-xs text-gray-500 italic dark:text-gray-400">Data refreshes every few minutes</div>
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
