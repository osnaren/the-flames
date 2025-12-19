import Button from '@/components/ui/Button';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useGameIntegration } from '@/hooks/useGameIntegration';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eraser, Share, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import type { CanvasToolsProps } from '../types';

export default function CanvasTools({
  isErasing,
  onErase,
  onClear,
  onBack,
  onShare,
  onSave,
  isSharing = false,
  isSaving = false,
}: CanvasToolsProps) {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const { sound, uiInteraction } = useGameIntegration();

  const handleBack = useCallback(async () => {
    await sound.playSound('whoosh', { volume: 0.5 });
    onBack();
  }, [sound, onBack]);

  const handleErase = useCallback(async () => {
    await uiInteraction('toggle');
    onErase();
  }, [uiInteraction, onErase]);

  const handleClear = useCallback(async () => {
    await sound.playSound('delete', { volume: 0.6 });
    onClear();
  }, [sound, onClear]);

  const handleShare = useCallback(async () => {
    await uiInteraction('click');
    onShare();
  }, [uiInteraction, onShare]);

  const handleSave = useCallback(async () => {
    await uiInteraction('click');
    onSave();
  }, [uiInteraction, onSave]);

  const toolsVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : -20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerClasses = cn(
    'flex items-center justify-center transition-all duration-300',
    isMobile ? 'fixed bottom-4 left-1/2 z-50 -translate-x-1/2' : 'w-max-content'
  );

  const toolbarClasses = cn(
    'border-outline/20 bg-surface/90 flex items-center justify-center border backdrop-blur-sm',
    'shadow-lg transition-all duration-300',
    isMobile ? 'rounded-full px-2 py-2 shadow-xl' : 'rounded-full px-3 py-2 sm:px-4'
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
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={ArrowLeft}
            onClick={handleBack}
            className="text-on-surface hover:bg-surface-container/50 shrink-0"
            aria-label="Go back to input"
          >
            {!isMobile && <span className="ml-1">Back</span>}
          </Button>

          <div className={cn('bg-outline/30 w-px', isMobile ? 'h-6' : 'h-4 sm:h-6')} />

          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Eraser}
            onClick={handleErase}
            className={cn(
              'shrink-0 transition-all duration-200',
              isErasing
                ? 'bg-error-container text-on-error-container hover:bg-error-container/80 shadow-inner'
                : 'text-on-surface hover:bg-surface-container/50'
            )}
            aria-label={isErasing ? 'Switch to drawing mode' : 'Switch to erasing mode'}
            aria-pressed={isErasing}
          >
            {!isMobile && <span className="ml-1">{isErasing ? 'Erasing' : 'Erase'}</span>}
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Trash2}
            onClick={handleClear}
            className="text-on-surface hover:bg-surface-container/50 hover:text-error shrink-0 transition-all duration-200"
            aria-label="Clear canvas"
          >
            {!isMobile && <span className="ml-1">Clear</span>}
          </Button>

          <div className={cn('bg-outline/30 w-px', isMobile ? 'h-6' : 'h-4 sm:h-6')} />

          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Share}
            onClick={handleShare}
            disabled={isSharing}
            className="text-on-surface hover:bg-surface-container/50 shrink-0 transition-all duration-200 disabled:opacity-50"
            aria-label="Share image"
          >
            {!isMobile && <span className="ml-1">{isSharing ? 'Sharing...' : 'Share'}</span>}
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'sm'}
            icon={Download}
            onClick={handleSave}
            disabled={isSaving}
            className="text-on-surface hover:bg-surface-container/50 shrink-0 transition-all duration-200 disabled:opacity-50"
            aria-label="Save image"
          >
            {!isMobile && <span className="ml-1">{isSaving ? 'Saving...' : 'Save'}</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
