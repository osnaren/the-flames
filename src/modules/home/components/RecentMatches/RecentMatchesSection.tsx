/**
 * RecentMatchesSection Component
 * Displays recent match history with animations and interactions
 */
'use client';

import { RECENT_MATCHES_CONFIG } from '@/config/recentMatches';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useGameIntegration } from '@/hooks/useGameIntegration';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, History, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import useRecentMatches from '../../hooks/useRecentMatches';
import EmptyState from './EmptyState';
import MatchItem from './MatchItem';
import type { MatchEntry, RecentMatchesSectionProps } from './types';

/**
 * Section header with title, count badge, and actions
 */
interface SectionHeaderProps {
  totalCount: number;
  isExpanded: boolean;
  hasMatches: boolean;
  onToggleExpand: () => void;
  onClearAll: () => void;
  shouldAnimate: boolean;
  showExpandButton: boolean;
  playSound: (id: 'whoosh' | 'delete' | 'click') => void;
}

/**
 * Renders the header for the Recent Matches section, including title, numeric badge, clear-all controls, and an optional expand/collapse action.
 *
 * @param totalCount - Total number of recent matches; shown as a small numeric badge when greater than zero.
 * @param isExpanded - Whether the matches list is currently expanded; affects the expand/collapse button state and icon.
 * @param hasMatches - Whether there are any matches to display; controls visibility of the clear-all control.
 * @param onToggleExpand - Callback invoked to toggle the expanded state of the matches list.
 * @param onClearAll - Callback invoked to clear all recent matches when the user confirms.
 * @param shouldAnimate - Whether entry/exit animations should be applied to header elements.
 * @param showExpandButton - Whether to render the expand/collapse button.
 * @param playSound - Function to play UI sounds; called with 'whoosh', 'delete', or 'click' for respective user actions.
 * @returns The rendered header element for the Recent Matches section.
 */
function SectionHeader({
  totalCount,
  isExpanded,
  hasMatches,
  onToggleExpand,
  onClearAll,
  shouldAnimate,
  showExpandButton,
  playSound,
}: SectionHeaderProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleClearClick = useCallback(() => {
    playSound('click');
    setIsConfirmingClear(true);
  }, [playSound]);

  const handleConfirmClear = useCallback(() => {
    playSound('delete');
    onClearAll();
    setIsConfirmingClear(false);
  }, [onClearAll, playSound]);

  const handleCancelClear = useCallback(() => {
    playSound('click');
    setIsConfirmingClear(false);
  }, [playSound]);

  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.div
          initial={shouldAnimate ? { rotate: -180, opacity: 0 } : false}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg"
        >
          <History className="text-primary h-4 w-4" aria-hidden="true" />
        </motion.div>
        <h3 className="text-on-surface text-sm font-semibold">Recent Matches</h3>
        {totalCount > 0 && (
          <motion.span
            initial={shouldAnimate ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            className="bg-primary/15 text-primary flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium"
          >
            {totalCount}
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Clear all button */}
        <AnimatePresence mode="wait">
          {hasMatches && !isConfirmingClear && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClearClick}
              className="text-on-surface-variant/60 hover:text-error hover:bg-error/10 focus-visible:ring-error/50 rounded-lg p-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Clear all matches"
              type="button"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          )}
          {isConfirmingClear && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <button
                onClick={handleConfirmClear}
                className="text-on-error bg-error hover:bg-error/90 rounded-md px-2 py-1 text-xs font-medium transition-colors"
                type="button"
              >
                Clear All
              </button>
              <button
                onClick={handleCancelClear}
                className="text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest rounded-md px-2 py-1 text-xs font-medium transition-colors"
                type="button"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand/Collapse button */}
        {showExpandButton && (
          <button
            onClick={() => {
              playSound('whoosh');
              onToggleExpand();
            }}
            className="text-on-surface-variant/60 hover:text-primary hover:bg-primary/10 focus-visible:ring-primary/50 rounded-lg p-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
            aria-label={isExpanded ? 'Show less' : 'Show more'}
            aria-expanded={isExpanded}
            type="button"
          >
            <motion.div animate={{ rotate: isExpanded ? 360 : 0 }} transition={{ duration: 0.2 }}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </motion.div>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Displays the Recent Matches section, including header controls, a paginated list of match items, loading/empty states, and interactive animations.
 *
 * Shows a loading skeleton while matches load, renders a header with clear/expand controls (and sound callbacks), lists recent matches (with an optional "plus more" expand button), and listens for global 'flames-delete-match' events to remove matches.
 *
 * @param displayCount - Number of matches to show when the list is collapsed (defaults to RECENT_MATCHES_CONFIG.DEFAULT_DISPLAY_COUNT)
 * @param onMatchClick - Optional callback invoked with a match when the user clicks a match (only called when replay is enabled via configuration)
 * @param showHeader - Whether to render the section header (defaults to true)
 * @param className - Additional CSS classes applied to the outer container
 * @returns The rendered Recent Matches section React element
 */
function RecentMatchesSection({
  displayCount = RECENT_MATCHES_CONFIG.DEFAULT_DISPLAY_COUNT,
  onMatchClick,
  showHeader = true,
  className = '',
}: RecentMatchesSectionProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const { sound } = useGameIntegration();
  const { displayMatches, totalCount, isLoading, hasMatches, removeMatch, clearAllMatches, getDisplayMatches } =
    useRecentMatches();

  const [isExpanded, setIsExpanded] = useState(false);
  const { UI } = RECENT_MATCHES_CONFIG;

  // Determine number of matches to show
  const visibleMatches = isExpanded ? displayMatches : getDisplayMatches(displayCount);

  // Should show expand button
  const showExpandButton = totalCount > displayCount;

  // Handle expand toggle
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Handle match click (replay)
  const handleMatchClick = useCallback(
    (match: MatchEntry) => {
      if (onMatchClick && UI.ENABLE_REPLAY) {
        onMatchClick(match);
      }
    },
    [onMatchClick, UI.ENABLE_REPLAY]
  );

  // Listen for delete events from MatchItem
  useEffect(() => {
    const handleDeleteMatch = (e: CustomEvent<{ id: string }>) => {
      removeMatch(e.detail.id);
    };

    window.addEventListener('flames-delete-match', handleDeleteMatch as EventListener);
    return () => {
      window.removeEventListener('flames-delete-match', handleDeleteMatch as EventListener);
    };
  }, [removeMatch]);

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: RECENT_MATCHES_CONFIG.ANIMATION.SECTION_DURATION,
        delay: RECENT_MATCHES_CONFIG.ANIMATION.SECTION_DELAY,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: RECENT_MATCHES_CONFIG.ANIMATION.STAGGER_DELAY,
      },
    },
  };

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="bg-surface-container-high h-6 w-32 rounded-md" />
          <div className="bg-surface-container-low h-16 w-full rounded-xl" />
          <div className="bg-surface-container-low h-16 w-full rounded-xl opacity-70" />
          <div className="bg-surface-container-low h-16 w-full rounded-xl opacity-40" />
        </div>
      </div>
    );
  }

  return (
    <motion.section
      variants={shouldAnimate ? sectionVariants : undefined}
      initial={shouldAnimate ? 'hidden' : false}
      animate="visible"
      className={`w-full ${className}`}
      aria-label="Recent matches history"
    >
      {/* Section container with glass effect */}
      <div className="bg-surface-container-lowest/50 dark:bg-surface-container-lowest/30 border-outline/5 rounded-2xl border p-4 shadow-sm backdrop-blur-sm">
        {/* Header */}
        {showHeader && (
          <SectionHeader
            totalCount={totalCount}
            isExpanded={isExpanded}
            hasMatches={hasMatches}
            onToggleExpand={handleToggleExpand}
            onClearAll={clearAllMatches}
            shouldAnimate={shouldAnimate}
            showExpandButton={showExpandButton}
            playSound={(id) => sound.playSound(id)}
          />
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {hasMatches ? (
            <motion.div
              key="matches-list"
              variants={shouldAnimate ? listVariants : undefined}
              initial={shouldAnimate ? 'hidden' : false}
              animate="visible"
              className="space-y-2"
            >
              <AnimatePresence mode="popLayout">
                {visibleMatches.map((match, index) => (
                  <MatchItem
                    key={match.id}
                    match={match}
                    index={index}
                    onClick={onMatchClick ? handleMatchClick : undefined}
                    shouldAnimate={shouldAnimate}
                  />
                ))}
              </AnimatePresence>

              {/* Show more indicator */}
              {!isExpanded && totalCount > displayCount && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleToggleExpand}
                  className="text-primary/80 hover:text-primary hover:bg-primary/5 focus-visible:ring-primary/50 w-full rounded-lg py-2 text-xs font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
                  type="button"
                >
                  +{totalCount - displayCount} more matches
                </motion.button>
              )}
            </motion.div>
          ) : (
            <EmptyState key="empty-state" shouldAnimate={shouldAnimate} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default memo(RecentMatchesSection);