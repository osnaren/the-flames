import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { NameStats } from './types';

interface NameLeaderboardProps {
  names: NameStats[];
}

/**
 * Popular names leaderboard section in the GlobalCharts component
 */
export default function NameLeaderboard({ names }: NameLeaderboardProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-700/50">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Popular Names</h3>
      <div className="space-y-3">
        {names.slice(0, 5).map((nameStat, index) => (
          <motion.div
            key={nameStat.name + index}
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-8 text-center">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
            </div>
            <div className="ml-2 flex-1">
              <div className="font-medium text-gray-800 dark:text-white">{nameStat.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{nameStat.count.toLocaleString()}</div>
              <div
                className={`flex items-center justify-end text-xs ${nameStat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {nameStat.trend > 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {Math.abs(nameStat.trend)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
