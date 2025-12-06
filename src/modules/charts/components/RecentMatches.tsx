import { motion } from 'framer-motion';
import { Clock, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RecentMatch, ResultInfo } from '../types';
import { getCountryFlag, getCountryName } from '../utils';

interface RecentMatchesProps {
  matches: RecentMatch[];
  resultInfo: Record<string, ResultInfo>;
}

// Calculate relative time - must be called only on client side
function getRelativeTime(dateString: string, currentTime: number) {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((currentTime - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function RecentMatches({ matches, resultInfo }: RecentMatchesProps) {
  // Track current time on client only to avoid hydration mismatch
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    // Set initial time on mount
    setCurrentTime(Date.now());

    // Update every 30 seconds for "just now" / "Xm ago" accuracy
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
          // Only show relative time after hydration, otherwise show placeholder
          const relativeTime = currentTime ? getRelativeTime(match.created_at, currentTime) : '...';

          return (
            <motion.div
              key={`${match.created_at}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 ${info.color.replace('text-', 'hover:border-')}`}
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
                        <span
                          className="font-emoji mr-1.5 text-base leading-none"
                          role="img"
                          aria-label={getCountryName(match.country)}
                        >
                          {getCountryFlag(match.country)}
                        </span>
                        <span className="mr-2 font-medium">{getCountryName(match.country)}</span>
                      </>
                    ) : (
                      <>
                        <Globe className="mr-1 h-3 w-3" />
                        <span className="mr-2 italic">Global</span>
                      </>
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
