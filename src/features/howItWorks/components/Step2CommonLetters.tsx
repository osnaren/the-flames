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
      <Card className="p-8 shadow-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading text-on-surface mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="bg-tertiary-container/20 text-tertiary flex h-8 w-8 items-center justify-center rounded-full">
              2
            </span>
            Strike Common Letters
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-on-surface-variant mb-2 text-sm font-semibold">Name 1: {name1}</p>
              <div className="flex flex-wrap gap-2">
                {name1.split('').map((letter, i) => {
                  const isCommon = commonLetters.includes(letter.toLowerCase());
                  return (
                    <motion.span
                      key={`n1-${i}`}
                      className={`relative inline-block rounded px-3 py-1 text-lg font-medium ${
                        isCommon
                          ? 'text-error shadow-elevation-small opacity-60'
                          : 'bg-surface-container-high text-on-surface shadow-md'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 + 0.4 }}
                    >
                      {letter}
                      {isCommon && (
                        <motion.span
                          className="bg-error absolute bottom-1/2 left-0 h-0.5 w-full origin-left"
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
              <p className="text-on-surface-variant mb-2 text-sm font-semibold">Name 2: {name2}</p>
              <div className="flex flex-wrap gap-2">
                {name2.split('').map((letter, i) => {
                  const isCommon = commonLetters.includes(letter.toLowerCase());
                  return (
                    <motion.span
                      key={`n2-${i}`}
                      className={`relative inline-block rounded px-3 py-1 text-lg font-medium ${
                        isCommon
                          ? 'text-error shadow-elevation-small opacity-60'
                          : 'bg-surface-container-high text-on-surface shadow-md'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 + 0.4 }}
                    >
                      {letter}
                      {isCommon && (
                        <motion.span
                          className="bg-error absolute bottom-1/2 left-0 h-0.5 w-full origin-left"
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
          <p className="text-on-surface-variant text-center">
            We strike out matching letters ({commonLetters.join(', ')}) and see how many sparks are left:{' '}
            <strong className="text-primary-container">{remainingLettersCount} letters</strong> remain.
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
