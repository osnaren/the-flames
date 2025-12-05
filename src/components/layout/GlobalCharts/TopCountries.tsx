import { motion } from 'framer-motion';
import { Globe, Trophy } from 'lucide-react';
import { TopCountry } from './types';

interface TopCountriesProps {
  countries: TopCountry[];
}

export default function TopCountries({ countries }: TopCountriesProps) {
  if (!countries || countries.length === 0) return null;

  const maxCount = Math.max(...countries.map((c) => c.count));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
        <Globe className="mr-2 h-5 w-5 text-green-500" />
        Top Countries
      </h3>
      <div className="space-y-4">
        {countries.map((country, index) => (
          <motion.div
            key={country.country}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="mb-1 flex justify-between text-sm">
              <span className="flex items-center font-medium text-gray-700 dark:text-gray-300">
                {index === 0 && <Trophy className="mr-1.5 h-3.5 w-3.5 text-yellow-500" />}
                {index === 1 && <Trophy className="mr-1.5 h-3.5 w-3.5 text-gray-400" />}
                {index === 2 && <Trophy className="mr-1.5 h-3.5 w-3.5 text-amber-600" />}
                {country.country}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">{country.count.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <motion.div
                className="h-full rounded-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${(country.count / maxCount) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
