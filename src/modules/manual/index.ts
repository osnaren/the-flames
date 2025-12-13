/**
 * Manual Module
 *
 * This module contains the manual FLAMES game mode
 * where users can manually cross out letters.
 */

// Main page component
export { default as ManualModePage } from './ManualModePage';

// Main component
export { default as ManualMode } from './ManualMode';

// Components
export { default as CanvasExperience } from './components/CanvasExperience';
export { default as CanvasInstructions } from './components/CanvasInstructions';
export { default as CanvasTools } from './components/CanvasTools';
export { default as ClickExperience } from './components/ClickExperience';
export { default as ClickResultImage } from './components/ClickResultImage';
export { default as ErrorBoundary } from './components/ErrorBoundary';
export { default as FlamesLetters } from './components/FlamesLetters';
export { default as LetterTile } from './components/LetterTile';
export { default as NameInputForm } from './components/NameInputForm';

// Hooks
export { useManualMode } from './hooks/useManualMode';

// Types
export * from './types';

// Utils
export * from './utils';

// Result data
export { getResultData, resultData } from './resultData';

// Image utils
export * from './image.utils';
