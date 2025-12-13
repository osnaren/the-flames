import { motion } from 'framer-motion';
import { Globe, Trophy } from 'lucide-react';
import { TopCountry } from '../types';
import { getCountryFlag, getCountryName } from '../utils';

interface TopCountriesProps {
  countries: TopCountry[];
}

export default function TopCountries({ countries }: TopCountriesProps) {
  if (!countries || countries.length === 0) return null;

  const maxCount = Math.max(...countries.map((c) => c.count));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Globe className="mr-2 h-5 w-5 text-green-500" />
          Top Countries
        </h3>
      </div>

      <div className="space-y-4">
        {countries.map((country, index) => {
          const percentage = maxCount > 0 ? (country.count / maxCount) * 100 : 0;
          const isTop3 = index < 3;

          return (
            <motion.div
              key={country.country}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                        : index === 1
                          ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          : index === 2
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500'
                            : 'bg-transparent text-gray-500 dark:text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-emoji text-lg leading-none"
                      role="img"
                      aria-label={getCountryName(country.country)}
                    >
                      {getCountryFlag(country.country)}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{getCountryName(country.country)}</span>
                  </div>
                  {isTop3 && (
                    <Trophy
                      className={`h-3.5 w-3.5 ${
                        index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-amber-600'
                      }`}
                    />
                  )}
                </div>
                <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                  {country.count.toLocaleString()}
                </span>
              </div>

              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                          ? 'bg-amber-600'
                          : 'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
