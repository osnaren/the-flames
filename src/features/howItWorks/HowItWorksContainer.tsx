import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { motion } from 'framer-motion';
import CallToAction from './components/CallToAction';
import Header from './components/Header';
import MeaningSection from './components/MeaningSection';
import Step1Names from './components/Step1Names';
import Step2CommonLetters from './components/Step2CommonLetters';
import Step3FlamesSimulation from './components/Step3FlamesSimulation';
import { DEMO_COMMON_LETTERS, DEMO_NAME1, DEMO_NAME2, DEMO_REMAINING_COUNT } from './howItWorks.constants';

/**
 * Enhanced container component for the How It Works feature
 * Serves as the composition point for all section components with improved spacing and animations
 */
export default function HowItWorksContainer() {
  const { shouldAnimate } = useAnimationPreferences();

  return (
    <div className="from-surface/50 to-surface-container/30 min-h-screen bg-gradient-to-b">
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Header />

          {/* Tutorial sections with enhanced spacing and staggered animations */}
          <motion.div
            className="space-y-24 md:space-y-28"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Step 1: Names */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Step1Names name1={DEMO_NAME1} name2={DEMO_NAME2} />
            </motion.div>

            {/* Step 2: Common Letters */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Step2CommonLetters
                name1={DEMO_NAME1}
                name2={DEMO_NAME2}
                commonLetters={DEMO_COMMON_LETTERS}
                remainingLettersCount={DEMO_REMAINING_COUNT}
              />
            </motion.div>

            {/* Step 3: FLAMES Simulation */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Step3FlamesSimulation remainingLettersCount={DEMO_REMAINING_COUNT} />
            </motion.div>

            {/* Meaning Section */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MeaningSection />
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <CallToAction />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
