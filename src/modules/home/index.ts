/**
 * Home Module
 *
 * This module contains all components, hooks, and utilities
 * specific to the home page (FLAMES game main interface).
 */

// Main page component
export { default as HomePage } from './HomePage';

// Feature components - AnimatedHeader
export { AnimatedHeader } from './components/AnimatedHeader';

// Feature components - InputForm
export { InputForm } from './components/InputForm';

// Feature components - FlamesProcessor
export { FlamesProcessor } from './components/FlamesProcessor';

// Feature components - ResultCard
export { ResultActionsDock, ResultCard, ResultCardContainer, ResultCardDisplay } from './components/ResultCard';

// Feature components - RecentMatches
export { EmptyState, MatchItem, RecentMatchesSection } from './components/RecentMatches';
export type { DisplayMatch, MatchEntry, MatchItemProps, RecentMatchesSectionProps } from './components/RecentMatches';

// Hooks
export { useFlamesEngine } from './hooks/useFlamesEngine';
export { useRecentMatches } from './hooks/useRecentMatches';

// Types
export * from './types';

// Constants
export * from './constants';

// Utils
export * from './utils';
