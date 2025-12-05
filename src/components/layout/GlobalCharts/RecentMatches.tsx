import { motion } from 'framer-motion';
import { Clock, Globe } from 'lucide-react';
import { RecentMatch, ResultInfo } from './types';

interface RecentMatchesProps {
  matches: RecentMatch[];
  resultInfo: Record<string, ResultInfo>;
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function RecentMatches({ matches, resultInfo }: RecentMatchesProps) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Clock className="mr-2 h-5 w-5 text-blue-500" />
          Live Feed
        </h3>
        <div className="flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </div>
      </div>

      <div className="space-y-3">
        {matches.map((match, index) => {
          const info = resultInfo[match.result];
          const relativeTime = getRelativeTime(match.created_at);

          return (
            <motion.div
              key={`${match.created_at}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700/30 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${info.bgColor} shadow-xs`}>
                  <info.icon className={`h-5 w-5 ${info.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{info.text}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    {match.country ? (
                      <>
                        <Globe className="mr-1 h-3 w-3" />
                        <span className="mr-2 font-medium">{match.country}</span>
                      </>
                    ) : (
                      <span className="mr-2 italic">Global</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-400 dark:text-gray-500">{relativeTime}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
