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
      <Card className="p-8 shadow-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading text-on-surface mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="bg-primary-container/20 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              1
            </span>
            Enter Two Names
          </h2>
          <div className="relative mb-6 flex flex-col items-center justify-center gap-6 md:flex-row">
            <div className="bg-surface-container-highest/80 text-on-surface rounded-lg p-6 text-2xl font-medium shadow-inner">
              {name1}
            </div>

            <div className="relative flex h-24 w-12 items-center justify-center md:h-12 md:w-24">
              <motion.div
                className="from-primary/5 via-primary-container/20 to-primary/5 absolute inset-0 rounded-full bg-gradient-to-b blur-md md:bg-gradient-to-r"
                animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
              <div className="from-primary/80 via-primary-container/90 to-primary/80 h-full w-1 rounded-full bg-gradient-to-b opacity-70 md:h-1 md:w-full md:bg-gradient-to-r" />

              <motion.div
                className="bg-primary shadow-[0_0_8px_2px_theme(colors.primary/80)] absolute h-3 w-1 rounded-full md:hidden"
                initial={{ y: '-70%' }}
                animate={{ y: ['-70%', '50%', '-70%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }}
              />
              <motion.div
                className="bg-primary shadow-[0_0_8px_2px_theme(colors.primary/80)] absolute hidden h-1 w-3 rounded-full md:block"
                initial={{ x: '-70%' }}
                animate={{ x: ['-70%', '50%', '-70%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }}
              />
            </div>

            <div className="bg-surface-container-highest/80 text-on-surface rounded-lg p-6 text-2xl font-medium shadow-inner">
              {name2}
            </div>
          </div>
          <p className="text-on-surface-variant text-center">We start with two names, ready to uncover the spark.</p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
