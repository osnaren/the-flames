import { FlamesResult } from '../flames.types';

export interface ManualModeState {
  name1: string;
  name2: string;
  name1Locked: boolean;
  name2Locked: boolean;
  crossedLetters: Set<string>;
  result: FlamesResult;
  isChalkboard: boolean;
}

export interface ManualModeProps {
  onShare?: (result: FlamesResult) => void;
  onClose?: () => void;
}

export interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  isLocked: boolean;
  onLock: () => void;
  onEdit: () => void;
  placeholder: string;
  isChalkboard?: boolean;
  error?: string;
}

export interface LetterGridProps {
  name1: string;
  name2: string;
  crossedLetters: Set<string>;
  onLetterClick: (letter: string, nameIndex: number, position: number) => void;
  isChalkboard?: boolean;
}

export interface FlamesCounterProps {
  remainingLetters: number;
  onResult: (result: FlamesResult) => void;
  isChalkboard?: boolean;
}

export interface FloatingToolsProps {
  onReset: () => void;
  onShare?: () => void;
  onToggleStyle: () => void;
  canShare: boolean;
  isChalkboard: boolean;
}
