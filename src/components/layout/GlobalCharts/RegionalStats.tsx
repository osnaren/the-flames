import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { RegionalStats as RegionalStatsTypes } from './types';
import { ResultInfo } from './types';

interface RegionalStatsProps {
  stats: RegionalStatsTypes;
  resultInfo: Record<string, ResultInfo>;
}

export default function RegionalStats({ stats, resultInfo }: RegionalStatsProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 md:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Trending in {stats.country}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Popular Names */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Popular Names
          </h4>
          <div className="space-y-2">
            {stats.names.slice(0, 3).map((name, index) => (
              <motion.div
                key={name.name}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {name.name}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {name.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Result Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Result Distribution
          </h4>
          <div className="space-y-2">
            {stats.results.slice(0, 3).map((result, index) => {
              const info = resultInfo[result.result];
              const ResultIcon = info.icon;
              
              return (
                <motion.div
                  key={result.result}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <ResultIcon className={`w-4 h-4 ${info.color}`} />
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {info.text}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {result.count}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Popular Pairs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Popular Pairs
          </h4>
          <div className="space-y-2">
            {stats.pairs.slice(0, 3).map((pair, index) => {
              const info = resultInfo[pair.result];
              const ResultIcon = info.icon;
              
              return (
                <motion.div
                  key={`${pair.name1}-${pair.name2}`}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <ResultIcon className={`w-4 h-4 ${info.color}`} />
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {pair.name1} & {pair.name2}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {pair.count}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}