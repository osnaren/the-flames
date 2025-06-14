import { useAnimationPreferences } from '@hooks/useAnimationPreferences';
import { usePreferences } from '@hooks/usePreferences';
import Toggle from '@ui/Toggle';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronUp, Flame, Moon, MousePointerClick, Settings, Sun, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from 'src/utils';

export default function FloatingControlPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exitingPanel, setExitingPanel] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [{ isDarkTheme, isSoundEnabled }, { toggleTheme, toggleSound, toggleAnimations }] = usePreferences();
  const { shouldAnimate } = useAnimationPreferences();

  // Local wrapper for toggling animations to ensure parent state is updated too
  const handleToggleAnimations = useCallback(() => {
    toggleAnimations();
  }, [toggleAnimations]);

  // Handle scroll to top with proper focus management
  const handleScrollToTop = useCallback(() => {
    const firstFocusableElement = document.querySelector('main button, main a, main input, main [tabindex="0"]');

    // Animate panel closing with better UX
    setExitingPanel(true);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Close panel after scroll starts
    setTimeout(() => {
      setIsExpanded(false);
      setExitingPanel(false);
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

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Controls configuration
  const controls = [
    {
      label: 'Theme',
      activeIcon: Sun,
      inactiveIcon: Moon,
      active: !isDarkTheme,
      toggle: toggleTheme,
      color: 'bg-gradient-to-r from-tertiary-container/30 to-tertiary/10',
      activeColor: 'text-primary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
      ariaLabel: isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme',
    },
    {
      label: 'Animations',
      activeIcon: Flame,
      inactiveIcon: Flame,
      active: shouldAnimate,
      toggle: handleToggleAnimations,
      color: 'bg-gradient-to-r from-primary-container/30 to-primary/10',
      activeColor: 'text-primary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
      ariaLabel: shouldAnimate ? 'Turn off animations' : 'Turn on animations',
    },
    {
      label: 'Sound',
      activeIcon: Volume2,
      inactiveIcon: VolumeX,
      active: isSoundEnabled,
      toggle: toggleSound,
      color: 'bg-gradient-to-r from-secondary-container/30 to-secondary/10',
      activeColor: 'text-secondary text-glow-sm',
      inactiveColor: 'text-on-surface-variant',
      ariaLabel: isSoundEnabled ? 'Turn off sound' : 'Turn on sound',
    },
  ];

  // Animation variants
  const panelVariants = {
    collapsed: {
      width: '48px',
      height: '48px',
      borderRadius: '24px',
    },
    expanded: {
      width: '280px',
      height: 'auto',
      borderRadius: '16px',
    },
  };

  // Staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        staggerDirection: -1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  return (
    <div className={cn('fixed top-20 right-5 z-50 md:right-6')}>
      <motion.div
        ref={panelRef}
        className={cn(
          'border-outline/20 from-surface-container-low/90 to-surface-container-high/80 overflow-hidden border bg-gradient-to-br backdrop-blur-lg',
          isExpanded && 'shadow-lg',
          isExpanded && isDarkTheme && 'shadow-[0_0_15px_2px_rgba(255,182,144,0.15)]',
          isExpanded && !isDarkTheme && 'shadow-[0_0_15px_2px_rgba(0,0,0,0.1)]',
          exitingPanel && 'transition-all duration-300'
        )}
        variants={panelVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{
          type: prefersReducedMotion ? 'tween' : 'spring',
          stiffness: 500,
          damping: 30,
          duration: prefersReducedMotion ? 0.2 : undefined,
        }}
        aria-label="Settings panel"
        aria-modal={isExpanded}
        aria-expanded={isExpanded}
      >
        <motion.button
          ref={toggleButtonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: shouldAnimate ? 1.1 : 1 }}
          whileTap={{ scale: shouldAnimate ? 0.9 : 1 }}
          className={cn(
            'absolute z-20 flex items-center justify-center rounded-full transition-all',
            isExpanded
              ? 'from-surface-container-high to-surface-container top-3 right-3 h-8 w-8 bg-gradient-to-br shadow-sm'
              : 'inset-0 h-full w-full bg-transparent',
            'text-on-surface-variant hover:text-primary hover:bg-surface-container-low hover:text-glow-sm focus:ring-primary/50 focus:ring-2 focus:outline-none'
          )}
          aria-label={isExpanded ? 'Close settings' : 'Open settings'}
        >
          {isExpanded ? (
            <ChevronUp size={18} />
          ) : (
            <Settings size={20} className={shouldAnimate ? 'animate-spin-slow' : ''} />
          )}
        </motion.button>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              className="px-4 pt-14 pb-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={childVariants} className="mb-4 flex items-center justify-center">
                <h3 className="from-primary via-primary-container to-error bg-gradient-to-r bg-clip-text text-center text-xs font-medium tracking-wider text-transparent uppercase">
                  Settings
                </h3>
              </motion.div>

              <div className="space-y-3">
                {controls.map((control, _index) => (
                  <motion.div key={control.label} variants={childVariants}>
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
                      tabIndex={isExpanded ? 0 : -1}
                    />
                  </motion.div>
                ))}

                <motion.div
                  className="border-outline/20 text-on-surface-variant mt-4 border-t pt-4 text-center text-xs"
                  variants={childVariants}
                >
                  <button
                    className="hover:bg-surface-container-lowest hover:text-on-surface hover:text-glow-sm focus:ring-primary/50 flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 transition-colors focus:ring-2 focus:outline-none"
                    aria-label="Jump to top of page"
                    onClick={handleScrollToTop}
                    tabIndex={isExpanded ? 0 : -1}
                  >
                    <MousePointerClick size={14} />
                    <span>Jump to top</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && shouldAnimate && (
          <motion.div
            className="absolute inset-0 flex h-12 w-12 items-center justify-center"
            animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
