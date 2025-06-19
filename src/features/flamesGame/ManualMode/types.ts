export type ExperienceMode = 'click' | 'canvas';
export type CanvasState = 'input' | 'experience';

export interface ManualModeState {
  name1: string;
  name2: string;
  experienceMode: ExperienceMode; // click or canvas interaction
  canvasState: CanvasState;
  isDrawing: boolean;
  isErasing: boolean;
  crossedLetters: Set<string>;
  flamesCrossedLetters: Set<string>;
  result: string | null;
}

export interface ManualModeProps {
  onShare?: (imageData: string) => void;
  onClose?: () => void;
}

export interface NameInputFormProps {
  onNamesSubmit: (name1: string, name2: string, experienceMode: ExperienceMode) => void;
  initialName1?: string;
  initialName2?: string;
}

export interface ClickExperienceProps {
  name1: string;
  name2: string;
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
  onResultChange: (result: string | null) => void;
  isSharing?: boolean;
  isSaving?: boolean;
}

export interface CanvasExperienceProps {
  name1: string;
  name2: string;
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isSharing?: boolean;
  isSaving?: boolean;
}

export interface LetterTileProps {
  letter: string;
  index: number;
  nameIndex: 1 | 2;
  isCrossed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export interface FlamesLettersProps {
  crossedLetters?: Set<string>;
  onLetterToggle?: (letter: string) => void;
  className?: string;
  userResult?: string | null;
  correctResult?: string | null;
}

export interface CanvasToolsProps {
  isErasing: boolean;
  onErase: () => void;
  onClear: () => void;
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
  isSharing?: boolean;
  isSaving?: boolean;
}

export interface ResultValidationProps {
  userResult: string | null;
  correctResult: string;
}
