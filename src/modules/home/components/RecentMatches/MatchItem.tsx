/**
 * MatchItem Component
 * Displays a single match entry with animations and interactions
 */
'use client';

import { RECENT_MATCHES_CONFIG } from '@/config/recentMatches';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Play, Trash2, X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import type { MatchItemProps } from './types';

/**
 * Individual match item with hover effects and actions
 */
function MatchItem({ match, index, onClick, shouldAnimate }: MatchItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isTouch = useMediaQuery('(hover: none)');
  const { ANIMATION } = RECENT_MATCHES_CONFIG;

  const showActions = isHovered || isTouch;

  const handleClick = useCallback(() => {
    if (onClick && !isDeleting) {
      onClick(match);
    }
  }, [onClick, match, isDeleting]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
  }, []);

  const handleCancelDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(false);
  }, []);

  const handleConfirmDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Parent will handle deletion via removeMatch
      const deleteEvent = new CustomEvent('flames-delete-match', { detail: { id: match.id } });
      window.dispatchEvent(deleteEvent);
    },
    [match.id]
  );

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: index * ANIMATION.STAGGER_DELAY,
        duration: ANIMATION.ITEM_DURATION,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      variants={shouldAnimate ? itemVariants : undefined}
      initial={shouldAnimate ? 'hidden' : false}
      animate="visible"
      exit="exit"
      layout
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDeleting(false);
      }}
    >
      <motion.div
        variants={shouldAnimate ? hoverVariants : undefined}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className={`bg-surface-container-low/60 hover:bg-surface-container/80 dark:bg-surface-container-low/40 dark:hover:bg-surface-container/60 border-outline/5 hover:border-outline/10 focus-visible:ring-primary/50 relative flex w-full items-center gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:outline-none ${onClick ? 'cursor-pointer' : 'cursor-default'} ${isDeleting ? 'pointer-events-none opacity-50' : ''} `}
        aria-label={`Replay match: ${match.name1} and ${match.name2}, result: ${match.resultData.text}`}
      >
        {/* Result Emoji Badge */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${match.resultData.gradientClass} shadow-md`}
          aria-hidden="true"
        >
          <span className="text-lg">{match.resultData.emoji}</span>
        </div>

        {/* Match Info */}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          {/* Names */}
          <div className="text-on-surface flex w-full items-center gap-1.5 text-sm font-medium">
            <span className="max-w-[45%] truncate" title={match.name1}>
              {match.displayName1}
            </span>
            <span className="text-on-surface-variant/60 shrink-0">×</span>
            <span className="max-w-[45%] truncate" title={match.name2}>
              {match.displayName2}
            </span>
          </div>

          {/* Result & Time */}
          <div className="text-on-surface-variant/70 flex w-full items-center gap-2 text-xs">
            <span
              className={`bg-linear-to-r font-medium ${match.resultData.gradientClass} bg-clip-text text-transparent`}
            >
              {match.resultData.text}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <time dateTime={new Date(match.timestamp).toISOString()}>{match.relativeTime}</time>
            </span>
          </div>
        </div>

        {/* Play/Replay indicator (visible on hover) */}
        <AnimatePresence>
          {showActions && onClick && !isDeleting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-primary flex items-center gap-1 text-xs font-medium"
            >
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              <span className="hidden sm:inline">Replay</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete button (visible on hover) */}
        <AnimatePresence>
          {showActions && !isDeleting && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleDelete}
              className="bg-error/10 hover:bg-error/20 text-error focus-visible:ring-error/50 absolute top-2 right-2 z-10 rounded-full p-1 transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Delete this match"
              type="button"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete confirmation overlay */}
      <AnimatePresence>
        {isDeleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-container/95 absolute inset-0 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm"
          >
            <button
              onClick={handleConfirmDelete}
              className="bg-error text-on-error hover:bg-error/90 focus-visible:ring-error/50 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              type="button"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
              Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-surface-container-high text-on-surface hover:bg-surface-container-highest focus-visible:ring-primary/50 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              type="button"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default memo(MatchItem);
