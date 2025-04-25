import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { NameStats } from './types';

interface NameLeaderboardProps {
  names: NameStats[];
}

/**
 * Popular names leaderboard section in the GlobalCharts component
 */
export default function NameLeaderboard({ names }: NameLeaderboardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Popular Names
      </h3>
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
            <div className="flex-1 ml-2">
              <div className="font-medium text-gray-800 dark:text-white">{nameStat.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">
                {nameStat.count.toLocaleString()}
              </div>
              <div className={`text-xs flex items-center justify-end
                            ${nameStat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {nameStat.trend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
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