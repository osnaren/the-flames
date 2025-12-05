import { motion } from 'framer-motion';
import { Clock, Globe } from 'lucide-react';
import { RecentMatch, ResultInfo } from './types';

interface RecentMatchesProps {
  matches: RecentMatch[];
  resultInfo: Record<string, ResultInfo>;
}

export default function RecentMatches({ matches, resultInfo }: RecentMatchesProps) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
        <Clock className="mr-2 h-5 w-5 text-blue-500" />
        Recent Matches
      </h3>
      <div className="space-y-3">
        {matches.map((match, index) => {
          const info = resultInfo[match.result];
          const date = new Date(match.created_at);
          const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <motion.div
              key={`${match.created_at}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
            >
              <div className="flex items-center space-x-3">
                <div className={`rounded-full p-2 ${info.bgColor}`}>
                  <info.icon className={`h-4 w-4 ${info.color}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{info.text}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    {match.country && (
                      <>
                        <Globe className="mr-1 h-3 w-3" />
                        <span className="mr-2">{match.country}</span>
                      </>
                    )}
                    <span>{timeString}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
