import Card from '@components/ui/Card';
import { motion } from 'framer-motion';

interface Step2Props {
  name1: string;
  name2: string;
  commonLetters: string[];
  remainingLettersCount: number;
}

/**
 * Step 2 component showing the common letters calculation
 */
export default function Step2CommonLetters({ name1, name2, commonLetters, remainingLettersCount }: Step2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <Card className="p-8 shadow-lg dark:shadow-purple-900/20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
              2
            </span>
            Strike Common Letters
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Name 1: {name1}</p>
              <div className="flex flex-wrap gap-2">
                {name1.split('').map((letter, i) => {
                  const isCommon = commonLetters.includes(letter.toLowerCase());
                  return (
                    <motion.span
                      key={`n1-${i}`}
                      className={`relative inline-block rounded px-3 py-1 text-lg font-medium ${
                        isCommon
                          ? 'text-red-500 opacity-60 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 + 0.4 }}
                    >
                      {letter}
                      {isCommon && (
                        <motion.span
                          className="absolute bottom-1/2 left-0 h-0.5 w-full origin-left bg-red-400 dark:bg-red-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.08 + 0.7, duration: 0.4, ease: 'easeOut' }}
                        />
                      )}
                    </motion.span>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3">
              <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Name 2: {name2}</p>
              <div className="flex flex-wrap gap-2">
                {name2.split('').map((letter, i) => {
                  const isCommon = commonLetters.includes(letter.toLowerCase());
                  return (
                    <motion.span
                      key={`n2-${i}`}
                      className={`relative inline-block rounded px-3 py-1 text-lg font-medium ${
                        isCommon
                          ? 'text-red-500 opacity-60 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 + 0.4 }}
                    >
                      {letter}
                      {isCommon && (
                        <motion.span
                          className="absolute bottom-1/2 left-0 h-0.5 w-full origin-left bg-red-400 dark:bg-red-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.08 + 0.7, duration: 0.4, ease: 'easeOut' }}
                        />
                      )}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300">
            We strike out matching letters ({commonLetters.join(', ')}) and see how many sparks are left:{' '}
            <strong className="text-orange-500">{remainingLettersCount} letters</strong> remain.
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
