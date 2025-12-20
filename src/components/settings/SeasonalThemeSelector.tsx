'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/shadcn/carousel';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { useGameIntegration } from '@/hooks/useGameIntegration';
import { SeasonalTheme, SeasonalThemeConfig } from '@/themes/seasonal/types';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

// Theme display order - organized by season/time
const THEME_ORDER: SeasonalTheme[] = [
  'default',
  'pongal', // January
  'valentine', // February
  'holi', // March
  'onam', // August-September
  'halloween', // October
  'diwali', // October-November
  'christmas', // December
  'newYear', // December-January
];

interface ThemeCardProps {
  theme: SeasonalThemeConfig;
  isActive: boolean;
  isDetected: boolean;
  onClick: () => void;
  tabIndex: number;
}

const ThemeCard = memo(function ThemeCard({ theme, isActive, isDetected, onClick, tabIndex }: ThemeCardProps) {
  const { shouldAnimate } = useAnimationPreferences();

  return (
    <motion.button
      onClick={onClick}
      tabIndex={tabIndex}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all',
        'focus:ring-primary/50 min-w-[72px] focus:ring-2 focus:outline-none',
        isActive
          ? 'bg-primary/15 border-primary/50 shadow-primary/20 border shadow-sm'
          : 'hover:bg-surface-container-low border border-transparent'
      )}
      whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
      aria-label={`Select ${theme.name} theme${isActive ? ' (active)' : ''}${isDetected ? ' (auto-detected)' : ''}`}
      aria-pressed={isActive}
    >
      {/* Theme emoji */}
      <span className="text-xl leading-none" role="img" aria-hidden="true">
        {theme.emoji}
      </span>

      {/* Theme name */}
      <span
        className={cn('text-[10px] leading-tight font-medium', isActive ? 'text-primary' : 'text-on-surface-variant')}
      >
        {theme.name}
      </span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="bg-primary absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
          layoutId="theme-indicator"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Auto-detected badge */}
      {isDetected && !isActive && (
        <div className="absolute -top-1 -right-1">
          <Sparkles className="text-secondary h-3 w-3" />
        </div>
      )}
    </motion.button>
  );
});

interface SeasonalThemeSelectorProps {
  isExpanded: boolean;
}

function SeasonalThemeSelector({ isExpanded }: SeasonalThemeSelectorProps) {
  const { currentTheme, detectedTheme, setManualTheme, themes } = useSeasonalTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const { uiInteraction } = useGameIntegration();
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update scroll state
  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on('select', updateScrollState);
    api.on('reInit', updateScrollState);

    return () => {
      api.off('select', updateScrollState);
      api.off('reInit', updateScrollState);
    };
  }, [api]);

  // Scroll to active theme on mount
  useEffect(() => {
    if (!api) return;

    const activeIndex = THEME_ORDER.indexOf(currentTheme);
    if (activeIndex > 0) {
      // Small delay to ensure carousel is initialized
      setTimeout(() => {
        api.scrollTo(Math.max(0, activeIndex - 1));
      }, 100);
    }
  }, [api, currentTheme]);

  const handleThemeSelect = useCallback(
    (themeId: SeasonalTheme) => {
      uiInteraction('select');
      // Always set the manual theme, even for 'default'
      // This ensures we override auto-detection when user explicitly chooses 'default'
      setManualTheme(themeId);
    },
    [setManualTheme, uiInteraction]
  );

  // Get ordered theme configs - defined before getVisibleTheme
  const orderedThemes = useMemo(() => THEME_ORDER.map((id) => themes[id]).filter(Boolean), [themes]);

  // Get the theme at the currently visible center position
  const getVisibleTheme = useCallback((): SeasonalTheme | null => {
    if (!api) return null;
    const selectedIndex = api.selectedScrollSnap();
    return orderedThemes[selectedIndex]?.id || null;
  }, [api, orderedThemes]);

  const handleScrollPrev = useCallback(() => {
    if (!api) return;
    uiInteraction('click');
    api.scrollPrev();
    // After scrolling, select the newly visible theme
    setTimeout(() => {
      const themeId = getVisibleTheme();
      if (themeId && themeId !== currentTheme) {
        handleThemeSelect(themeId);
      }
    }, 150);
  }, [api, getVisibleTheme, currentTheme, handleThemeSelect, uiInteraction]);

  const handleScrollNext = useCallback(() => {
    if (!api) return;
    uiInteraction('click');
    api.scrollNext();
    // After scrolling, select the newly visible theme
    setTimeout(() => {
      const themeId = getVisibleTheme();
      if (themeId && themeId !== currentTheme) {
        handleThemeSelect(themeId);
      }
    }, 150);
  }, [api, getVisibleTheme, currentTheme, handleThemeSelect, uiInteraction]);

  // Keyboard navigation for the whole selector
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleScrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleScrollNext();
      }
    },
    [handleScrollPrev, handleScrollNext]
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="relative flex items-center gap-1"
      onKeyDown={handleKeyDown}
      role="group"
      aria-label="Seasonal theme selector"
    >
      {/* Previous button */}
      <motion.button
        onClick={handleScrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          'hover:bg-surface-container-low focus:ring-primary/50 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all focus:ring-1 focus:outline-none',
          !canScrollPrev && 'pointer-events-none opacity-30'
        )}
        whileHover={shouldAnimate && canScrollPrev ? { scale: 1.1 } : undefined}
        whileTap={shouldAnimate && canScrollPrev ? { scale: 0.9 } : undefined}
        aria-label="Previous themes"
        tabIndex={isExpanded && canScrollPrev ? 0 : -1}
      >
        <ChevronLeft className="text-on-surface-variant h-4 w-4" />
      </motion.button>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: false,
          dragFree: true,
          containScroll: 'trimSnaps',
        }}
        className="w-full max-w-[180px]"
      >
        <CarouselContent className="-ml-1">
          {orderedThemes.map((theme) => (
            <CarouselItem key={theme.id} className="basis-auto pl-1">
              <ThemeCard
                theme={theme}
                isActive={currentTheme === theme.id}
                isDetected={detectedTheme === theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                tabIndex={isExpanded ? 0 : -1}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Next button */}
      <motion.button
        onClick={handleScrollNext}
        disabled={!canScrollNext}
        className={cn(
          'hover:bg-surface-container-low focus:ring-primary/50 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all focus:ring-1 focus:outline-none',
          !canScrollNext && 'pointer-events-none opacity-30'
        )}
        whileHover={shouldAnimate && canScrollNext ? { scale: 1.1 } : undefined}
        whileTap={shouldAnimate && canScrollNext ? { scale: 0.9 } : undefined}
        aria-label="Next themes"
        tabIndex={isExpanded && canScrollNext ? 0 : -1}
      >
        <ChevronRight className="text-on-surface-variant h-4 w-4" />
      </motion.button>
    </div>
  );
}

export default memo(SeasonalThemeSelector);
