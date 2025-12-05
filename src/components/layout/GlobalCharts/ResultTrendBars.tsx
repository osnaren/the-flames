import { motion } from 'framer-motion';
import { ResultInfo, ResultStats } from './types';

interface ResultTrendBarsProps {
  results: ResultStats[];
  resultInfo: Record<string, ResultInfo>;
}

/**
 * FLAMES result trend bars section in the GlobalCharts component
 */
export default function ResultTrendBars({ results, resultInfo }: ResultTrendBarsProps) {
  const maxCount = Math.max(...results.map((s) => s.count));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Result Distribution</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Percentage of total</span>
      </div>

      <div className="space-y-5">
        {results.map((stat, index) => {
          const resultData = resultInfo[stat.result];
          const ResultIcon = resultData.icon;
          const percentage = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
          const totalCount = results.reduce((acc, curr) => acc + curr.count, 0);
          const absolutePercentage = totalCount > 0 ? Math.round((stat.count / totalCount) * 100) : 0;

          return (
            <motion.div
              key={stat.result}
              className="group relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-2 flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md ${resultData.bgColor}`}>
                    <ResultIcon className={`h-3.5 w-3.5 ${resultData.color}`} />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{resultData.text}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 dark:text-white">{stat.count.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({absolutePercentage}%)</span>
                </div>
              </div>

              <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${resultData.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />
                </motion.div>
              </div>

              {/* Trend indicator */}
              <div className="mt-1 flex justify-end">
                <span
                  className={`text-[10px] font-medium ${
                    stat.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% trend
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
