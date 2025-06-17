import { useEffect } from 'react';
import CanvasExperience from './components/CanvasExperience';
import ClickExperience from './components/ClickExperience';
import NameInputForm from './components/NameInputForm';
import { useManualMode } from './hooks/useManualMode';
import type { ExperienceMode, ManualModeProps } from './types';
import { getUrlParams } from './utils';

export default function ManualMode({ onShare }: ManualModeProps) {
  const {
    state,
    handlers: { handleNamesSubmit, goBackToInput, handleShare },
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

  // Handle names submission with experience mode
  const handleNamesSubmitWithMode = (name1: string, name2: string, experienceMode: ExperienceMode) => {
    handleNamesSubmit(name1, name2, experienceMode);
  };

  if (state.canvasState === 'input') {
    return (
      <NameInputForm onNamesSubmit={handleNamesSubmitWithMode} initialName1={state.name1} initialName2={state.name2} />
    );
  }

  // Render appropriate experience based on experience mode
  if (state.experienceMode === 'click') {
    return (
      <ClickExperience name1={state.name1} name2={state.name2} onBack={goBackToInput} onShare={handleShareWithParent} />
    );
  }

  return (
    <CanvasExperience name1={state.name1} name2={state.name2} onBack={goBackToInput} onShare={handleShareWithParent} />
  );
}
