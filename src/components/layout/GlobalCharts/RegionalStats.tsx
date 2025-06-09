import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { RegionalStats as RegionalStatsTypes, ResultInfo } from './types';

interface RegionalStatsProps {
  stats: RegionalStatsTypes;
  resultInfo: Record<string, ResultInfo>;
}

export default function RegionalStats({ stats, resultInfo }: RegionalStatsProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-5 md:col-span-2 dark:bg-gray-700/50">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Trending in {stats.country}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Popular Names */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Popular Names</h4>
          <div className="space-y-2">
            {stats.names.slice(0, 3).map((name, index) => (
              <motion.div
                key={name.name}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">{name.name}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{name.count}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Result Distribution */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Result Distribution</h4>
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
                    <ResultIcon className={`h-4 w-4 ${info.color}`} />
                    <span className="text-sm text-gray-800 dark:text-gray-200">{info.text}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{result.count}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Popular Pairs */}
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Popular Pairs</h4>
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
                    <ResultIcon className={`h-4 w-4 ${info.color}`} />
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {pair.name1} & {pair.name2}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{pair.count}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
