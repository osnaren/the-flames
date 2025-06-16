export type DrawingMode = 'chalkboard' | 'pen-paper';
export type CanvasState = 'input' | 'drawing';

export interface ManualModeState {
  name1: string;
  name2: string;
  mode: DrawingMode;
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
  onNamesSubmit: (name1: string, name2: string) => void;
  mode: DrawingMode;
  onModeToggle: () => void;
  initialName1?: string;
  initialName2?: string;
}

export interface DrawingCanvasProps {
  name1: string;
  name2: string;
  mode: DrawingMode;
  onBack: () => void;
  onShare: (imageData: string) => void;
  onModeToggle: () => void;
}

export interface LetterTileProps {
  letter: string;
  index: number;
  nameIndex: 1 | 2;
  mode: DrawingMode;
  className?: string;
}

export interface FlamesLettersProps {
  mode: DrawingMode;
  className?: string;
}

export interface CanvasToolsProps {
  mode: DrawingMode;
  isErasing: boolean;
  onErase: () => void;
  onClear: () => void;
  onBack: () => void;
  onShare: () => void;
  onModeToggle: () => void;
}
