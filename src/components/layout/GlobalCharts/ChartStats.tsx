import { TrendingUp } from 'lucide-react';
import { GlobalStats } from './types';

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
    <div className="mt-4 flex gap-4">
      <div className="flex-1 rounded-lg bg-white/20 p-3 backdrop-blur-sm">
        <div className="text-xs tracking-wider text-white/80 uppercase">Total</div>
        <div className="text-xl font-bold text-white">{data.totalMatches.toLocaleString()}</div>
        <div className="mt-1 text-xs text-white/70">All-time matches</div>
      </div>

      <div className="flex-1 rounded-lg bg-white/20 p-3 backdrop-blur-sm">
        <div className="text-xs tracking-wider text-white/80 uppercase">Today</div>
        <div className="text-xl font-bold text-white">{data.todayMatches.toLocaleString()}</div>
        <div className="mt-1 text-xs text-white/70">Matches today</div>
      </div>

      <div className="flex-1 rounded-lg bg-white/20 p-3 backdrop-blur-sm">
        <div className="text-xs tracking-wider text-white/80 uppercase">Trending</div>
        <div className="text-xl font-bold text-white">{hottestTrend?.result || 'N/A'}</div>
        <div className="mt-1 flex items-center text-xs text-white/70">
          <TrendingUp className="mr-1 h-3 w-3" />
          {hottestTrend ? (hottestTrend.trend > 0 ? `+${hottestTrend.trend}%` : `${hottestTrend.trend}%`) : 'N/A'}
        </div>
      </div>
    </div>
  );
}
