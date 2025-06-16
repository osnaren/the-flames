import { useEffect } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import NameInputForm from './components/NameInputForm';
import { useManualMode } from './hooks/useManualMode';
import type { ManualModeProps } from './types';
import { getUrlParams } from './utils';

export default function ManualMode({ onShare, onClose }: ManualModeProps) {
  const {
    state,
    canvasRef,
    handlers: { handleNamesSubmit, toggleMode, goBackToInput, handleShare, handleReset },
  } = useManualMode();

  // Initialize with URL params on mount
  useEffect(() => {
    const urlParams = getUrlParams();
    if (urlParams.name1 && urlParams.name2) {
      // URL params are already handled in the hook initialization
      console.log('Loaded from URL:', urlParams);
    }
  }, []);

  // Handle share with parent component
  const handleShareWithParent = async (imageData: string) => {
    await handleShare();
    if (onShare) {
      onShare(imageData);
    }
  };

  if (state.canvasState === 'input') {
    return (
      <NameInputForm
        onNamesSubmit={handleNamesSubmit}
        mode={state.mode}
        onModeToggle={toggleMode}
        initialName1={state.name1}
        initialName2={state.name2}
      />
    );
  }

  return (
    <DrawingCanvas
      name1={state.name1}
      name2={state.name2}
      mode={state.mode}
      onBack={goBackToInput}
      onShare={handleShareWithParent}
      onModeToggle={toggleMode}
    />
  );
}
