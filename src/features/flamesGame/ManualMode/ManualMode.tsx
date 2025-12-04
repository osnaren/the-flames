import CanvasExperience from './components/CanvasExperience';
import ClickExperience from './components/ClickExperience';
import NameInputForm from './components/NameInputForm';
import { useManualMode } from './hooks/useManualMode';

export default function ManualMode() {
  const {
    name1,
    name2,
    canvasState,
    experienceMode,
    canvasRef,
    isSharing,
    isSaving,
    handleNamesSubmit,
    goBackToInput,
    handleShare,
    handleSave,
    handleResultChange,
  } = useManualMode();

  if (canvasState === 'input') {
    return <NameInputForm onNamesSubmit={handleNamesSubmit} initialName1={name1} initialName2={name2} />;
  }

  if (experienceMode === 'click') {
    return (
      <ClickExperience
        name1={name1}
        name2={name2}
        onBack={goBackToInput}
        onShare={handleShare}
        onSave={handleSave}
        onResultChange={handleResultChange}
        isSharing={isSharing}
        isSaving={isSaving}
      />
    );
  }

  return (
    <CanvasExperience
      name1={name1}
      name2={name2}
      onBack={goBackToInput}
      onShare={handleShare}
      onSave={handleSave}
      canvasRef={canvasRef}
      isSharing={isSharing}
      isSaving={isSaving}
    />
  );
}
