import { motion } from 'framer-motion';
import { ArrowLeft, Eraser, Share, Trash2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import type { CanvasToolsProps } from '../types';

export default function CanvasTools({ isErasing, onErase, onClear, onBack, onShare }: CanvasToolsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-outline/20 bg-surface/90 absolute top-4 left-1/2 z-50 -translate-x-1/2 transform rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center space-x-2">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={onBack}
          className="text-on-surface hover:bg-surface-container/50"
          aria-label="Go back to input"
        >
          Back
        </Button>

        <div className="bg-outline/30 h-6 w-px" />

        {/* Erase Toggle */}
        <Button
          variant="ghost"
          size="sm"
          icon={Eraser}
          onClick={onErase}
          className={`${isErasing ? 'bg-error-container text-on-error-container' : 'text-on-surface hover:bg-surface-container/50'}`}
          aria-label={isErasing ? 'Switch to drawing mode' : 'Switch to erasing mode'}
        >
          {isErasing ? 'Erasing' : 'Draw'}
        </Button>

        {/* Clear Canvas */}
        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          onClick={onClear}
          className="text-on-surface hover:bg-surface-container/50 hover:text-error"
          aria-label="Clear canvas"
        >
          Clear
        </Button>

        <div className="bg-outline/30 h-6 w-px" />

        {/* Share/Download */}
        <Button
          variant="ghost"
          size="sm"
          icon={Share}
          onClick={onShare}
          className="text-on-surface hover:bg-surface-container/50"
          aria-label="Share or download image"
        >
          Share
        </Button>
      </div>

      {/* Mobile Tooltip */}
      <div className="mt-2 text-center md:hidden">
        <p className="text-on-surface-variant text-xs">Right-click to erase • Long press for menu</p>
      </div>
    </motion.div>
  );
}
