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
  return (
    <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-700/50">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">FLAMES Results</h3>
      <div className="space-y-4">
        {results.map((stat, index) => {
          const resultData = resultInfo[stat.result];
          const ResultIcon = resultData.icon;
          const maxCount = Math.max(...results.map((s) => s.count));
          const percentage = (stat.count / maxCount) * 100;

          return (
            <motion.div
              key={stat.result}
              className="space-y-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <ResultIcon className={`mr-1.5 h-4 w-4 ${resultData.color}`} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{resultData.text}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-800 dark:text-white">{stat.count.toLocaleString()}</span>
                  <span className={`ml-2 text-xs ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend > 0 ? '+' : ''}
                    {stat.trend}%
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <motion.div
                  className={`h-full ${resultData.bgColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
