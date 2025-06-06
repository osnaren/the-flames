import { motion } from 'framer-motion';
import { PairStats, ResultInfo } from './types';

interface PairingsGridProps {
  pairs: PairStats[];
  resultInfo: Record<string, ResultInfo>;
}

/**
 * Popular pairings grid section in the GlobalCharts component
 */
export default function PairingsGrid({ pairs, resultInfo }: PairingsGridProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 md:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Popular Pairings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {pairs.map((pair, index) => {
          const resultData = resultInfo[pair.result];
          const ResultIcon = resultData.icon;
          
          return (
            <motion.div 
              key={`${pair.name1}-${pair.name2}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-2">
                <div className={`p-1.5 rounded-full ${resultData.bgColor} mr-2`}>
                  <ResultIcon className={`h-4 w-4 ${resultData.color}`} />
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {resultData.text}
                </div>
                <div className="ml-auto text-xs font-semibold">
                  {pair.count} matches
                </div>
              </div>
              <div className="text-center">
                <span className="font-medium text-gray-800 dark:text-white">{pair.name1}</span>
                <span className="text-orange-500 mx-2">&</span>
                <span className="font-medium text-gray-800 dark:text-white">{pair.name2}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}