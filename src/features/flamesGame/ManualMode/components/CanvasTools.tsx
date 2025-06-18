import { motion } from 'framer-motion';
import { ArrowLeft, Eraser, Share, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../../../components/ui/Button';
import type { CanvasToolsProps } from '../types';

export default function CanvasTools({ isErasing, onErase, onClear, onBack, onShare }: CanvasToolsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full items-center justify-center"
    >
      <div className="border-outline/20 bg-surface/90 flex items-center justify-center rounded-full border px-3 py-2 shadow-lg backdrop-blur-sm sm:px-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={onBack}
            className="text-on-surface hover:bg-surface-container/50 flex-shrink-0"
            aria-label="Go back to input"
          >
            {!isMobile && <span className="ml-1">Back</span>}
          </Button>

          <div className="bg-outline/30 h-4 w-px sm:h-6" />

          {/* Erase Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon={Eraser}
            onClick={onErase}
            className={`flex-shrink-0 ${
              isErasing
                ? 'bg-error-container text-on-error-container hover:bg-error-container/80'
                : 'text-on-surface hover:bg-surface-container/50'
            }`}
            aria-label={isErasing ? 'Switch to drawing mode' : 'Switch to erasing mode'}
          >
            {!isMobile && <span className="ml-1">{isErasing ? 'Erasing' : 'Draw'}</span>}
          </Button>

          {/* Clear Canvas */}
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={onClear}
            className="text-on-surface hover:bg-surface-container/50 hover:text-error flex-shrink-0"
            aria-label="Clear canvas"
          >
            {!isMobile && <span className="ml-1">Clear</span>}
          </Button>

          <div className="bg-outline/30 h-4 w-px sm:h-6" />

          {/* Share/Download */}
          <Button
            variant="ghost"
            size="sm"
            icon={Share}
            onClick={onShare}
            className="text-on-surface hover:bg-surface-container/50 flex-shrink-0"
            aria-label="Share or download image"
          >
            {!isMobile && <span className="ml-1">Share</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Instructions - Floating helper */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="absolute top-16 right-4 z-10"
        >
          <div className="bg-surface/90 border-outline/20 rounded-lg border p-2 backdrop-blur-sm">
            <p className="text-on-surface-variant text-xs">Right-click to toggle erase</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
