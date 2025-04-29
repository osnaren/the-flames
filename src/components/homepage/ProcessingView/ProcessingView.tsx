import { FlamesResult } from '@features/flamesGame/flames.types';
import AmbientGlow from '@ui/AmbientGlow';
import { motion } from 'framer-motion';
import FlamesSlotMachine from '../FlamesSlotMachine';
import NameTiles from '../NameTiles';

interface ProcessingViewProps {
  name1: string;
  name2: string;
  commonLetters: string[];
  slotStopIndex: number;
  result: FlamesResult | null;
  shouldAnimate: boolean;
  animationsEnabled: boolean;
}

/**
 * Component for displaying the processing animation
 */
export function ProcessingView({
  name1,
  name2,
  commonLetters,
  slotStopIndex,
  result,
  shouldAnimate,
  animationsEnabled,
}: ProcessingViewProps) {
  return (
    <motion.div
      className="relative space-y-8"
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient glow animation */}
      <AmbientGlow isVisible={true} animationsEnabled={animationsEnabled} />

      {/* Name Tiles Section */}
      <NameTiles name1={name1} name2={name2} commonLetters={commonLetters} shouldAnimate={shouldAnimate} />

      {/* FLAMES Slot Machine */}
      <FlamesSlotMachine
        slotStopIndex={slotStopIndex}
        result={result}
        shouldAnimate={shouldAnimate}
        animationsEnabled={animationsEnabled}
      />

      {/* Calculating message */}
      <motion.p
        className="text-center text-sm text-gray-700 italic dark:text-gray-300"
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldAnimate ? 1 : 0 }}
        aria-live="polite"
      >
        Calculating your destiny...
      </motion.p>
    </motion.div>
  );
}

export default ProcessingView;
