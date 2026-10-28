import { useGameIntegration } from '@/hooks/useGameIntegration';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { cn } from '@/utils';
import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import Toggle from '@ui/Toggle';
import { useReducedMotion } from 'framer-motion';
import {
  ChevronUp,
  Moon,
  MousePointerClick,
  Music2,
  Music2 as MusicIcon,
  Palette,
  Power,
  PowerOff,
  Settings,
  Sun,
  Vibrate,
  Volume2,
  VolumeX,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useShallow } from 'zustand/react/shallow';

const SeasonalThemeSelector = dynamic(() => import('@/components/settings/SeasonalThemeSelector'), {
  loading: () => <div className="h-16" aria-hidden="true" />,
});
const MusicPlayer = dynamic(() => import('@/components/ui/MusicPlayer').then((mod) => mod.MusicPlayer), {
  loading: () => <div className="bg-surface-container-low/50 h-36 rounded-xl" aria-hidden="true" />,
});

function ThemeControl() {
  const isDarkTheme = usePreferencesStore((state) => state.isDarkTheme);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  return (
    <Toggle
      isActive={!isDarkTheme}
      onToggle={toggleTheme}
      activeIcon={Sun}
      inactiveIcon={Moon}
      label="Theme"
      activeColor="text-primary text-glow-sm"
      inactiveColor="text-on-surface-variant"
      backgroundColor="bg-linear-to-r from-tertiary-container/30 to-tertiary/10"
      ariaLabel={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      tabIndex={0}
    />
  );
}

export default function FloatingControlPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [controlsReady, setControlsReady] = useState(false);
  const [, startControlsTransition] = useTransition();
  const prefersReducedMotion = useReducedMotion();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const soundFrameRef = useRef<number | null>(null);
  const controlsFrameRef = useRef<number | null>(null);

  const { shouldAnimate } = useAnimationPreferences();
  const { isSoundEnabled, isBGMEnabled, isHapticEnabled, toggleSound, toggleBGM, toggleHaptic, toggleAnimations } =
    usePreferencesStore(
      useShallow((state) => ({
        isSoundEnabled: state.isSoundEnabled,
        isBGMEnabled: state.isBGMEnabled,
        isHapticEnabled: state.isHapticEnabled,
        toggleSound: state.toggleSound,
        toggleBGM: state.toggleBGM,
        toggleHaptic: state.toggleHaptic,
        toggleAnimations: state.toggleAnimations,
      }))
    );
  const { uiInteraction, sound } = useGameIntegration();
  const { hapticFeedback } = useHapticFeedback();

  useEffect(
    () => () => {
      if (soundFrameRef.current !== null) cancelAnimationFrame(soundFrameRef.current);
      if (controlsFrameRef.current !== null) cancelAnimationFrame(controlsFrameRef.current);
    },
    []
  );

  // Local wrapper for toggling animations to ensure parent state is updated too
  const handleToggleAnimations = useCallback(() => {
    toggleAnimations();
  }, [toggleAnimations]);

  // Handle scroll to top with proper focus management
  const handleScrollToTop = useCallback(() => {
    const firstFocusableElement = document.querySelector('main button, main a, main input, main [tabindex="0"]');

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Close panel after scroll starts
    setTimeout(() => {
      setIsExpanded(false);
    }, 300);

    // Set focus after scroll completes
    setTimeout(
      () => {
        if (firstFocusableElement instanceof HTMLElement) {
          firstFocusableElement.focus();
        }
      },
      prefersReducedMotion ? 0 : 500
    );
  }, [prefersReducedMotion]);

  // Handle keyboard interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExpanded) return;

      if (e.key === 'Escape') {
        setIsExpanded(false);
        toggleButtonRef.current?.focus();
      }

      // Focus trap for accessibility
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusable[0] as HTMLElement;
        const lastElement = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Auto-focus first control when expanding
  useEffect(() => {
    if (isExpanded && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector(
        'button:not([aria-label="Collapse control panel"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;

      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 150);
      }
    }
  }, [isExpanded]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Element;

      // Check if click is inside panel
      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }

      // Check if click is inside a portal (like Select dropdown)
      // We check for various Radix UI attributes to catch portals
      const isInsidePortal =
        target.closest('[data-radix-popper-content-wrapper]') ||
        target.closest('[role="listbox"]') ||
        target.closest('[data-radix-select-viewport]') ||
        target.closest('[data-radix-portal]');

      if (!isInsidePortal) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isExpanded]);

  // Controls configuration
  const controls = [
    {
      label: 'Animations',
      activeIcon: Power,
      inactiveIcon: PowerOff,
      active: shouldAnimate,
      toggle: handleToggleAnimations,
      color: 'bg-linear-to-r from-primary-container/30 to-primary/10',
      activeColor: 'text-primary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
      ariaLabel: shouldAnimate ? 'Turn off animations' : 'Turn on animations',
    },
  ];

  // Mini audio controls configuration (SFX, Music, Haptics)
  const audioControls = [
    {
      id: 'sfx',
      icon: Volume2,
      inactiveIcon: VolumeX,
      active: isSoundEnabled,
      toggle: toggleSound,
      label: 'SFX',
      ariaLabel: isSoundEnabled ? 'Turn off sound effects' : 'Turn on sound effects',
    },
    {
      id: 'music',
      icon: MusicIcon,
      inactiveIcon: MusicIcon,
      active: isBGMEnabled,
      toggle: toggleBGM,
      label: 'Music',
      ariaLabel: isBGMEnabled ? 'Turn off music' : 'Turn on music',
    },
    {
      id: 'haptics',
      icon: Vibrate,
      inactiveIcon: Vibrate,
      active: isHapticEnabled,
      toggle: toggleHaptic,
      label: 'Haptics',
      ariaLabel: isHapticEnabled ? 'Turn off haptic feedback' : 'Turn on haptic feedback',
    },
  ];

  return (
    <div className={cn('fixed top-20 right-5 z-50 md:right-6')}>
      <div
        ref={panelRef}
        className={cn(
          'border-outline/20 overflow-hidden border',
          'bg-surface-container',
          isExpanded && 'shadow-lg',
          isExpanded && 'shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_2px_rgba(255,182,144,0.15)]',
          isExpanded
            ? 'h-[min(650px,calc(100dvh-6rem))] max-h-[calc(100dvh-6rem)] w-[min(300px,calc(100vw-2.5rem))] overflow-y-auto overscroll-contain rounded-2xl'
            : 'h-12 w-12 rounded-full'
        )}
        aria-label="Settings panel"
        role="region"
        aria-busy={isExpanded && !controlsReady}
      >
        <button
          ref={toggleButtonRef}
          onClick={() => {
            hapticFeedback.tap();
            const nextExpanded = !isExpanded;
            setIsExpanded(nextExpanded);
            if (controlsFrameRef.current !== null) cancelAnimationFrame(controlsFrameRef.current);
            if (nextExpanded) {
              setControlsReady(false);
              // Keep the panel and its close control responsive while the
              // preference controls mount in a separate, interruptible render.
              controlsFrameRef.current = requestAnimationFrame(() => {
                controlsFrameRef.current = requestAnimationFrame(() => {
                  controlsFrameRef.current = null;
                  startControlsTransition(() => setControlsReady(true));
                });
              });
            }
            // Show the panel before optional media initialization can block paint.
            if (soundFrameRef.current !== null) cancelAnimationFrame(soundFrameRef.current);
            soundFrameRef.current = requestAnimationFrame(() => {
              soundFrameRef.current = requestAnimationFrame(() => {
                soundFrameRef.current = null;
                void Promise.allSettled([sound.playSound('toggle')]);
              });
            });
          }}
          className={cn(
            'absolute z-20 flex touch-manipulation items-center justify-center rounded-full transition-colors',
            isExpanded
              ? 'from-surface-container-high to-surface-container top-3 right-3 h-10 w-10 bg-linear-to-br shadow-sm'
              : 'inset-0 h-full w-full bg-transparent',
            'text-on-surface-variant hover:text-primary hover:bg-surface-container-low hover:text-glow-sm focus:ring-primary/50 focus:ring-2 focus:outline-none'
          )}
          aria-label={isExpanded ? 'Close settings' : 'Open settings'}
          suppressHydrationWarning
        >
          {isExpanded ? <ChevronUp size={18} /> : <Settings size={20} />}
        </button>

        <>
          {isExpanded && (
            <div className="px-4 pt-14 pb-3">
              <div className="mb-4 flex items-center justify-center">
                <h3 className="from-primary via-primary-container to-error bg-linear-to-r bg-clip-text text-center text-xs font-medium tracking-wider text-transparent uppercase">
                  Settings
                </h3>
              </div>

              {controlsReady ? (
                <div className="space-y-3">
                  <div>
                    <ThemeControl />
                  </div>
                  {controls.map((control, _index) => (
                    <div key={control.label}>
                      <Toggle
                        isActive={control.active}
                        onToggle={control.toggle}
                        activeIcon={control.activeIcon}
                        inactiveIcon={control.inactiveIcon}
                        label={control.label}
                        activeColor={control.activeColor}
                        inactiveColor={control.inactiveColor}
                        backgroundColor={control.color}
                        ariaLabel={control.ariaLabel}
                        tabIndex={0}
                      />
                    </div>
                  ))}

                  {/* Audio Controls Row (SFX, Music, Haptics) */}
                  <div>
                    <div className="from-secondary-container/30 to-secondary/10 flex items-center justify-between rounded-lg bg-linear-to-r px-3 py-2">
                      <span className="text-on-surface-variant text-xs font-medium">Audio</span>
                      <div className="flex items-center gap-1">
                        {audioControls.map((control) => {
                          const Icon = control.active ? control.icon : control.inactiveIcon;
                          return (
                            <button
                              key={control.id}
                              onClick={() => {
                                hapticFeedback.tap();
                                uiInteraction('toggle');
                                control.toggle();
                              }}
                              className={cn(
                                'flex h-9 w-9 touch-manipulation items-center justify-center rounded-md transition-all',
                                'focus:ring-primary/50 focus:ring-2 focus:outline-none',
                                control.active
                                  ? 'bg-secondary/20 text-secondary text-glow-sm hover:bg-secondary/30 active:bg-secondary/40'
                                  : 'text-on-surface-variant hover:bg-surface-container-highest/50 active:bg-surface-container-highest/70 hover:text-on-surface opacity-50'
                              )}
                              aria-label={control.ariaLabel}
                              title={control.label}
                              tabIndex={0}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Seasonal Theme Selector */}
                  <div className="border-outline/20 mt-3 border-t pt-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Palette className="text-secondary h-3.5 w-3.5" />
                      <span className="text-on-surface-variant text-[10px] font-medium tracking-wide uppercase">
                        Seasonal Theme
                      </span>
                    </div>
                    <div className="min-h-16">
                      <SeasonalThemeSelector isExpanded={isExpanded} compact />
                    </div>
                  </div>

                  {/* Music Player */}
                  <div className="border-outline/20 mt-3 border-t pt-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Music2 className="text-secondary h-3.5 w-3.5" />
                      <span className="text-on-surface-variant text-[10px] font-medium tracking-wide uppercase">
                        Background Music
                      </span>
                    </div>
                    <div className="min-h-36">
                      <MusicPlayer isExpanded={isExpanded} tabIndex={0} compact />
                    </div>
                  </div>

                  <div className="border-outline/20 text-on-surface-variant mt-4 border-t pt-4 text-center text-xs">
                    <button
                      className="hover:bg-surface-container-lowest hover:text-on-surface hover:text-glow-sm focus:ring-primary/50 flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 transition-colors focus:ring-2 focus:outline-none"
                      aria-label="Jump to top of page"
                      onClick={handleScrollToTop}
                      tabIndex={0}
                    >
                      <MousePointerClick size={14} />
                      <span>Jump to top</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p role="status" className="text-on-surface-variant py-8 text-center text-sm">
                  Loading settings…
                </p>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
}
