import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { RegionalStats as RegionalStatsType, ResultInfo } from '../types';
import { getCountryFlag, getCountryName } from '../utils';

interface RegionalStatsProps {
  stats: RegionalStatsType;
  resultInfo: Record<string, ResultInfo>;
}

export default function RegionalStats({ stats, resultInfo }: RegionalStatsProps) {
  // Find the top result for this region
  const topResult = [...stats.results].sort((a, b) => b.count - a.count)[0];
  const topResultInfo = topResult ? resultInfo[topResult.result] : null;

  return (
    <div className="flex flex-col rounded-xl bg-gray-50 p-5 dark:bg-gray-700/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-500" />
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
            Trending in
            <span className="flex items-center gap-1.5">
              <span className="font-emoji text-xl leading-none" role="img" aria-label={getCountryName(stats.country)}>
                {getCountryFlag(stats.country)}
              </span>
              {getCountryName(stats.country)}
            </span>
          </h3>
        </div>
        {topResultInfo && (
          <div
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${topResultInfo.bgColor} ${topResultInfo.color}`}
          >
            Top: {topResultInfo.text}
          </div>
        )}
      </div>

      <div className="flex-1">
        {/* Result Distribution */}
        <div className="h-full rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Result Distribution</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {stats.results.map((result, index) => {
              const info = resultInfo[result.result];
              const ResultIcon = info.icon;

              return (
                <motion.div
                  key={result.result}
                  className="flex items-center justify-between rounded-md bg-gray-50 p-2 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-1.5 ${info.bgColor}`}>
                      <ResultIcon className={`h-4 w-4 ${info.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{info.text}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{result.count}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
