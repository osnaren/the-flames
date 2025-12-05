import { motion } from 'framer-motion';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { GlobalStats, ResultInfo } from './types';

interface ChartStatsProps {
  data: GlobalStats;
  hottestTrend: {
    result: string;
    trend: number;
  } | null;
  resultInfo: Record<string, ResultInfo>;
}

/**
 * Header statistics shown at the top of the GlobalCharts component
 */
export default function ChartStats({ data, hottestTrend, resultInfo }: ChartStatsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-white/80 uppercase">Total Matches</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{data.totalMatches.toLocaleString()}</h3>
          </div>
          <div className="rounded-lg bg-white/20 p-2 text-white">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-white/60">All-time calculations</div>
      </motion.div>

      <motion.div
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-white/80 uppercase">Today</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{data.todayMatches.toLocaleString()}</h3>
          </div>
          <div className="rounded-lg bg-white/20 p-2 text-white">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-white/60">Calculations today</div>
      </motion.div>

      <motion.div
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-white/80 uppercase">Trending</p>
            <h3 className="mt-1 text-2xl font-bold text-white">
              {hottestTrend && resultInfo[hottestTrend.result]
                ? resultInfo[hottestTrend.result].text
                : hottestTrend?.result || 'N/A'}
            </h3>
          </div>
          <div className="rounded-lg bg-white/20 p-2 text-white">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-white/60">
          {hottestTrend ? (
            <>
              <span className={hottestTrend.trend > 0 ? 'font-bold text-green-300' : 'font-bold text-red-300'}>
                {hottestTrend.trend > 0 ? '+' : ''}
                {hottestTrend.trend}%
              </span>
              <span className="ml-1">vs yesterday</span>
            </>
          ) : (
            'No trend data'
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
