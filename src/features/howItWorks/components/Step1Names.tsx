import Card from '@components/ui/Card';
import { motion } from 'framer-motion';

interface Step1Props {
  name1: string;
  name2: string;
}

/**
 * Step 1 component showing the input names
 */
export default function Step1Names({ name1, name2 }: Step1Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <Card className="p-8 shadow-lg dark:shadow-orange-900/20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300">
              1
            </span>
            Enter Two Names
          </h2>
          <div className="relative mb-6 flex flex-col items-center justify-center gap-6 md:flex-row">
            <div className="rounded-lg bg-orange-50 p-6 text-2xl font-medium text-gray-700 shadow-inner dark:bg-orange-900/30 dark:text-gray-200">
              {name1}
            </div>

            <div className="relative flex h-24 w-12 items-center justify-center overflow-visible md:h-12 md:w-24">
              {/* Vertical Beam (Mobile) */}
              <div className="absolute inset-0 block md:hidden">
                <motion.div
                  className="absolute top-0 left-1/2 h-full w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-400 via-yellow-300 to-orange-400 opacity-80 blur-md"
                  animate={{
                    y: [0, 24, 0, -24, 0], // Vertical movement
                    opacity: [0.7, 1, 0.7, 1, 0.7],
                    scaleY: [1, 1.2, 1, 1.2, 1], // Scale vertically
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute top-0 left-1/2 h-1/3 w-2 -translate-x-1/2 rounded-full bg-yellow-300 opacity-80 blur-lg"
                  animate={{
                    y: [0, 48, 0, -48, 0], // Larger vertical movement
                    opacity: [0.8, 1, 0.8, 1, 0.8],
                    scaleY: [1, 1.5, 1, 1.5, 1], // Scale vertically
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {/* Horizontal Beam (Desktop) */}
              <div className="absolute inset-0 hidden md:block">
                <motion.div
                  className="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 opacity-80 blur-md"
                  animate={{
                    x: [0, 24, 0, -24, 0], // Horizontal movement
                    opacity: [0.7, 1, 0.7, 1, 0.7],
                    scaleX: [1, 1.2, 1, 1.2, 1], // Scale horizontally
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-0 h-2 w-1/3 -translate-y-1/2 rounded-full bg-yellow-300 opacity-80 blur-lg"
                  animate={{
                    x: [0, 48, 0, -48, 0], // Larger horizontal movement
                    opacity: [0.8, 1, 0.8, 1, 0.8],
                    scaleX: [1, 1.5, 1, 1.5, 1], // Scale horizontally
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-orange-50 p-6 text-2xl font-medium text-gray-700 shadow-inner dark:bg-orange-900/30 dark:text-gray-200">
              {name2}
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300">
            We start with two names, ready to uncover the spark.
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
