import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3,
  Users, 
  Heart, 
  Star, 
  BellRing as Ring, 
  Sword, 
  RefreshCcw,
  X,
  Clock,
  Award,
  Loader2
} from 'lucide-react';
import Button from '../../ui/Button/Button';
import ChartStats from './ChartStats';
import NameLeaderboard from './NameLeaderboard';
import ResultTrendBars from './ResultTrendBars';
import PairingsGrid from './PairingsGrid';
import RegionalStats from './RegionalStats';
import { getRandomTagline } from './utils';
import { GlobalStats, TimeFilter, FlamesResult } from './types';
import { useGlobalStats } from '../../../hooks/useGlobalStats';

// Mapping of result letters to meanings and icons
const resultInfo = {
  F: { text: 'Friendship', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900' },
  L: { text: 'Love', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
  A: { text: 'Affection', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900' },
  M: { text: 'Marriage', icon: Ring, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900' },
  E: { text: 'Enemy', icon: Sword, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900' },
  S: { text: 'Siblings', icon: Users, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900' }
};

interface GlobalChartsProps {
  onClose?: () => void;
  isVisible?: boolean;
  isStandalone?: boolean;
}

export default function GlobalCharts({ 
  onClose, 
  isVisible = true, 
  isStandalone = false 
}: GlobalChartsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [tagline, setTagline] = useState<string>("");
  
  // Use the custom hook to fetch stats with retry and error handling
  const { data, isLoading, error, refetch } = useGlobalStats(timeFilter);
  
  // Update tagline when data changes
  useEffect(() => {
    if (data?.resultStats?.length > 0) {
      const topResult = data.resultStats[0].result as FlamesResult;
      setTagline(getRandomTagline(topResult));
    }
  }, [data?.resultStats]);
  
  // Find the result with highest percentage growth
  const hottestTrend = data?.resultStats?.sort((a, b) => b.trend - a.trend)[0] || null;
  
  // Loading state component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Loading global stats...</p>
    </div>
  );
  
  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-red-500 mb-4">⚠️</div>
      <p className="text-gray-600 dark:text-gray-400 text-center">
        Oops! Something went wrong while loading the stats.
        <br />
        Please try again later.
      </p>
      <Button 
        variant="secondary"
        onClick={() => window.location.reload()}
        className="mt-4"
      >
        Retry
      </Button>
    </div>
  );
  
  // Create content component to reuse in both modal and standalone views
  const ChartsContent = () => (
    <>
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 dark:from-orange-600 dark:to-red-600 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Global FLAMES Charts
              </h2>
              <motion.p 
                className="text-white/90 text-sm"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {tagline}
              </motion.p>
            </div>
            {!isStandalone && onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-full transition"
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
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : data ? (
          <>
            {/* Filters */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setTimeFilter('today')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center
                          ${timeFilter === 'today'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
                          transition-colors duration-200 hover:brightness-95`}
                aria-pressed={timeFilter === 'today'}
              >
                <Clock className="w-3.5 h-3.5 mr-1" /> Today
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center
                          ${timeFilter === 'week' 
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <Clock className="w-3.5 h-3.5 mr-1" /> This Week
              </button>
              <button
                onClick={() => setTimeFilter('alltime')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center
                          ${timeFilter === 'alltime' 
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <Award className="w-3.5 h-3.5 mr-1" /> All Time
              </button>
              <motion.button
                onClick={() => window.location.reload()}
                className="ml-auto px-3 py-1.5 rounded-full text-sm font-medium flex items-center
                          bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200
                          hover:brightness-95 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: 180 }}
                transition={{ duration: 0.4 }}
                onClick={refetch}
                aria-label="Refresh statistics"
              >
                <RefreshCcw className="w-3.5 h-3.5 mr-1" /> Refresh
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Popular Names */}
              <NameLeaderboard names={data.popularNames} />
              
              {/* Result Stats */}
              <ResultTrendBars results={data.resultStats} resultInfo={resultInfo} />
              
              {/* Popular Pairings */}
              <PairingsGrid pairs={data.popularPairs} resultInfo={resultInfo} />
              
              {/* Regional Stats */}
              {data.regionalStats && (
                <RegionalStats stats={data.regionalStats} resultInfo={resultInfo} />
              )}
            </div>
          </>
        ) : null}
      </div>
      
      {/* Footer */}
      {!isStandalone && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            Data refreshes every few minutes
          </div>
          {onClose && (
            <Button 
              variant="primary"
              onClick={onClose}
              size="md"
            >
              Play FLAMES
            </Button>
          )}
        </div>
      )}
    </>
  );

  // For standalone page version
  if (isStandalone) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <ChartsContent />
      </div>
    );
  }
  
  // For modal version
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ChartsContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}