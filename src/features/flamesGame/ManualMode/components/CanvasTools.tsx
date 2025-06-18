import { cn } from '@/utils';
import { useDeviceType } from '@hooks/useDeviceType';
import Button from '@ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eraser, Share, Trash2 } from 'lucide-react';
import type { CanvasToolsProps } from '../types';

export default function CanvasTools({ 
  isErasing, 
  onErase, 
  onClear, 
  onBack, 
  onShare, 
  onSave, 
  isSharing = false, 
  isSaving = false 
}: CanvasToolsProps) {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';

  const toolsVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : -20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerClasses = cn(
    'flex items-center justify-center transition-all duration-300',
    isMobile
      ? 'fixed bottom-4 left-1/2 z-50 -translate-x-1/2' // Mobile: floating dock at bottom
      : 'w-max-content' // Desktop: full width at top
  );

  const toolbarClasses = cn(
    'border-outline/20 bg-surface/90 flex items-center justify-center border backdrop-blur-sm',
    'shadow-lg transition-all duration-300',
    isMobile
      ? 'rounded-full px-2 py-2 shadow-xl' // Mobile: compact floating style
      : 'rounded-full px-3 py-2 sm:px-4' // Desktop: wider toolbar
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={toolsVariants}
      transition={{ duration: 0.5 }}
      className={containerClasses}
    >
      <div className={toolbarClasses}>
        <div className={cn('flex items-center', isMobile ? 'space-x-1' : 'space-x-1 sm:space-x-2')}>
          {/* Back Button */}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={ArrowLeft}
            onClick={onBack}
            className="text-on-surface hover:bg-surface-container/50 flex-shrink-0"
            aria-label="Go back to input"
          >
            {!isMobile && <span className="ml-1">Back</span>}
          </Button>

          <div className={cn('bg-outline/30 w-px', isMobile ? 'h-6' : 'h-4 sm:h-6')} />

          {/* Erase Toggle */}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Eraser}
            onClick={onErase}
            className={cn(
              'flex-shrink-0 transition-all duration-200',
              isErasing
                ? 'bg-error-container text-on-error-container hover:bg-error-container/80 shadow-inner'
                : 'text-on-surface hover:bg-surface-container/50'
            )}
            aria-label={isErasing ? 'Switch to drawing mode' : 'Switch to erasing mode'}
          >
            {!isMobile && <span className="ml-1">{isErasing ? 'Erasing' : 'Draw'}</span>}
          </Button>

          {/* Clear Canvas */}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Trash2}
            onClick={onClear}
            className="text-on-surface hover:bg-surface-container/50 hover:text-error flex-shrink-0 transition-all duration-200"
            aria-label="Clear canvas"
          >
            {!isMobile && <span className="ml-1">Clear</span>}
          </Button>

          <div className={cn('bg-outline/30 w-px', isMobile ? 'h-6' : 'h-4 sm:h-6')} />

          {/* Share/Download */}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Share}
            onClick={onShare}
            disabled={isSharing}
            className="text-on-surface hover:bg-surface-container/50 flex-shrink-0 transition-all duration-200 disabled:opacity-50"
            aria-label="Share image"
          >
            {!isMobile && <span className="ml-1">{isSharing ? 'Sharing...' : 'Share'}</span>}
          </Button>

          {/* Save Button */}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Download}
            onClick={onSave}
            disabled={isSaving}
            className="text-on-surface hover:bg-surface-container/50 flex-shrink-0 transition-all duration-200 disabled:opacity-50"
            aria-label="Save image"
          >
            {!isMobile && <span className="ml-1">{isSaving ? 'Saving...' : 'Save'}</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
