import { AnimatePresence, motion } from 'framer-motion';
import { Palette, RotateCcw, Share2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';

interface FloatingToolsProps {
  onReset: () => void;
  onShare?: () => void;
  onToggleStyle: () => void;
  canShare: boolean;
  isChalkboard: boolean;
}

export default function FloatingTools({ onReset, onShare, onToggleStyle, canShare, isChalkboard }: FloatingToolsProps) {
  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {canShare && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button variant="primary" size="sm" icon={Share2} onClick={onShare} className="shadow-lg">
                Share
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={onReset} className="shadow-lg">
          Reset
        </Button>

        <Button
          variant={isChalkboard ? 'purple' : 'blue'}
          size="sm"
          icon={Palette}
          onClick={onToggleStyle}
          className="shadow-lg"
        >
          {isChalkboard ? 'Paper' : 'Chalkboard'}
        </Button>
      </div>
    </motion.div>
  );
}
