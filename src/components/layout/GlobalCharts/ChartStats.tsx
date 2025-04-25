import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { GlobalStats, TimeFilter } from './types';

interface ChartStatsProps {
  data: GlobalStats;
  hottestTrend: {
    result: string;
    trend: number;
  } | null;
}

/**
 * Header statistics shown at the top of the GlobalCharts component
 */
export default function ChartStats({ data, hottestTrend }: ChartStatsProps) {
  return (
    <div className="flex gap-4 mt-4">
      <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-xs text-white/80 uppercase tracking-wider">Total</div>
        <div className="text-xl font-bold text-white">{data.totalMatches.toLocaleString()}</div>
        <div className="text-xs text-white/70 mt-1">All-time matches</div>
      </div>
      
      <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-xs text-white/80 uppercase tracking-wider">Today</div>
        <div className="text-xl font-bold text-white">{data.todayMatches.toLocaleString()}</div>
        <div className="text-xs text-white/70 mt-1">Matches today</div>
      </div>
      
      <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
        <div className="text-xs text-white/80 uppercase tracking-wider">Trending</div>
        <div className="text-xl font-bold text-white">{hottestTrend?.result || 'N/A'}</div>
        <div className="text-xs text-white/70 mt-1 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          {hottestTrend ? (
            hottestTrend.trend > 0 ? `+${hottestTrend.trend}%` : `${hottestTrend.trend}%`
          ) : (
            'N/A'
          )}
        </div>
      </div>
    </div>
  );
}