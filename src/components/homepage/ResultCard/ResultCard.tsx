import { motion } from 'framer-motion';
import { Heart, BellRing as Ring, Star, Sword, Users, Wand2, X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

import ShareActions from '@components/homepage/ShareActions';
import { FlamesResult } from '@features/flamesGame/flames.types';
import { resultMeanings } from '@features/flamesGame/flames.utils';
import Button from '@ui/Button';
import ResultGlow from '@ui/ResultGlow';

interface ResultCardProps {
  name1: string;
  name2: string;
  result: FlamesResult;
  shouldAnimate: boolean;
  animationsEnabled: boolean;
  onReset: () => void;
  onShare: () => void;
  onCopyLink: () => void;
}

/**
 * Component for displaying the FLAMES result
 */
export function ResultCard({
  name1,
  name2,
  result,
  shouldAnimate,
  animationsEnabled,
  onReset,
  onShare,
  onCopyLink,
}: ResultCardProps) {
  const resultActionsRef = useRef<HTMLDivElement>(null);

  // For getting the appropriate icon based on result
  const getIconComponent = useCallback((letter: FlamesResult) => {
    if (!letter) return null;

    switch (letter) {
      case 'F':
        return Users;
      case 'L':
        return Heart;
      case 'A':
        return Star;
      case 'M':
        return Ring;
      case 'E':
        return Sword;
      case 'S':
        return Users;
      default:
        return null;
    }
  }, []);

  // Show manual mode notification
  const showManualMode = useCallback(() => {
    toast('Manual Mode coming soon!', {
      icon: '🔮',
    });
  }, []);

  const ResultIcon = result ? getIconComponent(result) : null;

  return (
    <motion.div
      className="relative mt-8 overflow-hidden rounded-xl bg-white p-8 text-center shadow-xl dark:bg-gray-800"
      initial={shouldAnimate ? { opacity: 0, y: 30, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: shouldAnimate ? 0.6 : 0,
      }}
      aria-live="polite"
      role="region"
      aria-label="FLAMES result"
    >
      {/* Result-specific glow effect */}
      <ResultGlow result={result} isVisible={true} animationsEnabled={animationsEnabled} />

      <motion.div
        className="mb-6"
        initial={shouldAnimate ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: shouldAnimate ? 0.7 : 0 }}
      >
        {ResultIcon && (
          <ResultIcon
            className={`mx-auto h-16 w-16 ${result ? resultMeanings[result].color : ''}`}
            aria-hidden="true"
          />
        )}
      </motion.div>

      <h2 className="text-shadow mb-2 text-3xl font-bold dark:text-white">
        {result ? resultMeanings[result].text : ''}
      </h2>

      <motion.p
        className="mb-4 text-gray-700 dark:text-gray-300"
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldAnimate ? 0.9 : 0 }}
      >
        {name1} and {name2} are destined to be {result ? resultMeanings[result].text.toLowerCase() : ''}!
      </motion.p>

      <motion.div
        className="mb-8 rounded-lg bg-gray-50 p-3 text-sm italic dark:bg-gray-700 dark:text-gray-200"
        initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldAnimate ? 1.1 : 0 }}
      >
        "{result ? resultMeanings[result].quote : ''}"
      </motion.div>

      <motion.div
        className="grid gap-3"
        initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldAnimate ? 1.2 : 0 }}
        ref={resultActionsRef}
      >
        <div className="mb-3 grid grid-cols-2 gap-3">
          <Button onClick={onReset} variant="secondary" icon={X} fullWidth>
            Try Again
          </Button>

          <Button
            onClick={showManualMode}
            variant="purple"
            icon={Wand2}
            aria-label="Try the manual calculation mode"
            fullWidth
          >
            Manual Mode
          </Button>
        </div>

        {/* Using the ShareActions component */}
        <ShareActions onShare={onShare} onCopyLink={onCopyLink} result={result} />
      </motion.div>
    </motion.div>
  );
}

export default ResultCard;
