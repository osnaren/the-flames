import { FlamesResult } from '@features/flamesGame/flames.types';
import SlotMachineLetter from '@ui/SlotMachineLetter';
import { motion } from 'framer-motion';

interface FlamesSlotMachineProps {
  slotStopIndex: number;
  result: FlamesResult;
  shouldAnimate: boolean;
  animationsEnabled: boolean;
}

/**
 * Component for the FLAMES letter animation slot machine
 */
export function FlamesSlotMachine({ slotStopIndex, result, shouldAnimate, animationsEnabled }: FlamesSlotMachineProps) {
  return (
    <motion.div
      className="flex justify-center space-x-2 pt-4 md:space-x-4"
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldAnimate ? 0.5 : 0 }}
    >
      {['F', 'L', 'A', 'M', 'E', 'S'].map((letter, i) => (
        <SlotMachineLetter
          key={letter}
          letter={letter}
          index={i}
          slotStopIndex={slotStopIndex}
          result={result}
          animationsEnabled={animationsEnabled}
        />
      ))}
    </motion.div>
  );
}

export default FlamesSlotMachine;
