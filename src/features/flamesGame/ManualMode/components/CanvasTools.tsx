import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Eraser, Palette, Share, Trash2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import type { CanvasToolsProps } from '../types';

export default function CanvasTools({
  mode,
  isErasing,
  onErase,
  onClear,
  onBack,
  onShare,
  onModeToggle,
}: CanvasToolsProps) {
  const getToolbarStyle = () => {
    if (mode === 'chalkboard') {
      return {
        container: 'bg-white/10 border border-white/20 backdrop-blur-sm',
        button: 'text-white hover:bg-white/20',
        activeButton: 'bg-white/30 text-white',
      };
    } else {
      return {
        container: 'bg-white/90 border border-gray-200 backdrop-blur-sm shadow-lg',
        button: 'text-gray-700 hover:bg-gray-100',
        activeButton: 'bg-gray-200 text-gray-900',
      };
    }
  };

  const styles = getToolbarStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded-full px-4 py-2 ${styles.container}`}
    >
      <div className="flex items-center space-x-2">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={onBack}
          className={styles.button}
          aria-label="Go back to input"
        >
          Back
        </Button>

        <div className={`h-6 w-px ${mode === 'chalkboard' ? 'bg-white/30' : 'bg-gray-300'}`} />

        {/* Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          icon={mode === 'chalkboard' ? BookOpen : Palette}
          onClick={onModeToggle}
          className={styles.button}
          aria-label={`Switch to ${mode === 'chalkboard' ? 'pen & paper' : 'chalkboard'} mode`}
        >
          {mode === 'chalkboard' ? 'Chalkboard' : 'Pen & Paper'}
        </Button>

        <div className={`h-6 w-px ${mode === 'chalkboard' ? 'bg-white/30' : 'bg-gray-300'}`} />

        {/* Erase Toggle */}
        <Button
          variant="ghost"
          size="sm"
          icon={Eraser}
          onClick={onErase}
          className={`${isErasing ? styles.activeButton : styles.button}`}
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
          className={`${styles.button} hover:text-red-500`}
          aria-label="Clear canvas"
        >
          Clear
        </Button>

        <div className={`h-6 w-px ${mode === 'chalkboard' ? 'bg-white/30' : 'bg-gray-300'}`} />

        {/* Share/Download */}
        <Button
          variant="ghost"
          size="sm"
          icon={Share}
          onClick={onShare}
          className={styles.button}
          aria-label="Share or download image"
        >
          Share
        </Button>
      </div>

      {/* Mobile Tooltip */}
      <div className="mt-2 text-center md:hidden">
        <p className={`text-xs ${mode === 'chalkboard' ? 'text-gray-300' : 'text-gray-500'}`}>
          Right-click to erase • Long press for menu
        </p>
      </div>
    </motion.div>
  );
}
