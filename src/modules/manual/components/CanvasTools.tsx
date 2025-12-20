import Button from '@/components/ui/Button';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useGameIntegration } from '@/hooks/useGameIntegration';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eraser, Redo2, Share, Trash2, Undo2 } from 'lucide-react';
import { useCallback } from 'react';
import type { CanvasToolsProps } from '../types';

/**
 * Renders a responsive canvas toolbar with drawing controls and wires user actions to provided callbacks.
 *
 * The toolbar includes back, undo/redo (optional), erase toggle, clear, share, and save controls; it adapts layout for mobile vs desktop and reflects action availability and in-progress states.
 *
 * @param isErasing - Whether the canvas is currently in erasing mode.
 * @param onErase - Callback invoked when the erase toggle is activated.
 * @param onClear - Callback invoked to clear the canvas.
 * @param onBack - Callback invoked to navigate back to the input view.
 * @param onShare - Callback invoked to share the canvas image.
 * @param onSave - Callback invoked to save the canvas image.
 * @param onUndo - Optional callback invoked to undo the last action; if omitted, the undo control is not rendered.
 * @param onRedo - Optional callback invoked to redo the last undone action; if omitted, the redo control is not rendered.
 * @param canUndo - Whether an undo action is currently available; controls the undo button enabled state.
 * @param canRedo - Whether a redo action is currently available; controls the redo button enabled state.
 * @param isSharing - Whether a share operation is in progress; disables the share button when true.
 * @param isSaving - Whether a save operation is in progress; disables the save button when true.
 * @returns A JSX element containing the animated toolbar.
 */
export default function CanvasTools({
  isErasing,
  onErase,
  onClear,
  onBack,
  onShare,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
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

  const handleUndo = useCallback(async () => {
    if (onUndo && canUndo) {
      await sound.playSound('pop', { volume: 0.4 });
      onUndo();
    }
  }, [sound, onUndo, canUndo]);

  const handleRedo = useCallback(async () => {
    if (onRedo && canRedo) {
      await sound.playSound('pop', { volume: 0.4 });
      onRedo();
    }
  }, [sound, onRedo, canRedo]);

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

          {/* Undo/Redo buttons */}
          {onUndo && (
            <Button
              variant="ghost"
              size={isMobile ? 'sm' : 'sm'}
              icon={Undo2}
              onClick={handleUndo}
              disabled={!canUndo}
              className="text-on-surface hover:bg-surface-container/50 shrink-0 transition-all duration-200 disabled:opacity-30"
              aria-label="Undo last action"
            >
              {!isMobile && <span className="ml-1">Undo</span>}
            </Button>
          )}

          {onRedo && (
            <Button
              variant="ghost"
              size={isMobile ? 'sm' : 'sm'}
              icon={Redo2}
              onClick={handleRedo}
              disabled={!canRedo}
              className="text-on-surface hover:bg-surface-container/50 shrink-0 transition-all duration-200 disabled:opacity-30"
              aria-label="Redo last action"
            >
              {!isMobile && <span className="ml-1">Redo</span>}
            </Button>
          )}

          {(onUndo || onRedo) && <div className={cn('bg-outline/30 w-px', isMobile ? 'h-6' : 'h-4 sm:h-6')} />}

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