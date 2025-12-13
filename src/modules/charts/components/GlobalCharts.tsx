import { useGlobalStats } from '@/hooks/useGlobalStats';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FlamesResult, TimeFilter } from '../types';
import { getRandomTagline } from '../utils';
import ChartsContent from './ChartsContent';

interface GlobalChartsProps {
  onClose?: () => void;
  isVisible?: boolean;
  isStandalone?: boolean;
}

export default function GlobalCharts({ onClose, isVisible = true, isStandalone = false }: GlobalChartsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');

  // Use the custom hook to fetch stats with retry and error handling
  const { data, isLoading, error, refetch, lastUpdate } = useGlobalStats(timeFilter);

  // Update tagline when data changes
  const tagline = useMemo(() => {
    if (data && data.resultStats && data.resultStats.length > 0) {
      const topResult = data.resultStats[0].result as FlamesResult;
      return getRandomTagline(topResult);
    }
    return '';
  }, [data]);

  // Find the result with highest percentage growth
  const hottestTrend = data?.resultStats?.sort((a, b) => b.trend - a.trend)[0] || null;

  const contentProps = {
    tagline,
    onClose,
    isStandalone,
    data: data || null,
    hottestTrend,
    isLoading,
    error,
    timeFilter,
    setTimeFilter,
    refetch,
    lastUpdate,
  };

  // For standalone page version
  if (isStandalone) {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
        <ChartsContent {...contentProps} />
      </div>
    );
  }

  // For modal version
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ChartsContent {...contentProps} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
